<?php
include_once '../lib/env_loader.php';
loadEnv(dirname(__DIR__) . '/.env');

function initiatePayment($db) {
    // POST /api/phonepe/pay
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) $data = $_POST;

    $name = isset($data['name']) ? $data['name'] : '';
    $email = isset($data['email']) ? $data['email'] : '';
    $phone = isset($data['phone']) ? $data['phone'] : '';
    $address = isset($data['address']) ? $data['address'] : '';
    $amount = isset($data['amount']) ? $data['amount'] : 0;

    $transactionId = 'TXN_' . floor(microtime(true) * 1000);

    // Save INITIATED payment
    $query = "INSERT INTO payments (transaction_id, name, email, phone, address, amount, status) VALUES (:txnId, :name, :email, :phone, :address, :amount, 'INITIATED')";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':txnId', $transactionId);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':phone', $phone);
    $stmt->bindParam(':address', $address);
    $stmt->bindParam(':amount', $amount);
    
    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error']);
        return;
    }

    $merchantId = isset($_ENV['PHONEPE_MERCHANT_ID']) ? $_ENV['PHONEPE_MERCHANT_ID'] : '';
    $saltKey = isset($_ENV['PHONEPE_SALT_KEY']) ? $_ENV['PHONEPE_SALT_KEY'] : '';
    $saltIndex = isset($_ENV['PHONEPE_SALT_INDEX']) ? $_ENV['PHONEPE_SALT_INDEX'] : 1;
    $payUrl = isset($_ENV['PHONEPE_PAY_URL']) ? $_ENV['PHONEPE_PAY_URL'] : 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';

    // Frontend URL for redirect. Assuming frontend is on port 5173.
    // Ideally this should also be env var, but hardcoded in Node logic too.
    $redirectUrl = "http://localhost:5173/payment-status?txnId=$transactionId";
    
    // Callback URL - point to this PHP server
    // Node was http://localhost:5000/api/phonepe/callback
    // PHP will be whatever this server is. Let's assume similar structure or updated config.
    // For now, hardcode localhost:8000 or relative? PhonePe needs absolute URL.
    // I will use localhost:8000 for now, user needs to update if deployed.
    $callbackUrl = "http://localhost:8000/api/phonepe/callback";

    $payload = [
        'merchantId' => $merchantId,
        'merchantTransactionId' => $transactionId,
        'merchantUserId' => $phone ? $phone : 'USER_' . time(),
        'amount' => $amount * 100,
        'redirectUrl' => $redirectUrl,
        'redirectMode' => 'GET',
        'callbackUrl' => $callbackUrl,
        'paymentInstrument' => ['type' => 'PAY_PAGE']
    ];

    $base64Payload = base64_encode(json_encode($payload));
    $string = $base64Payload . '/pg/v1/pay' . $saltKey;
    $hash = hash('sha256', $string);
    $xVerify = "$hash###$saltIndex";

    // Make request using curl
    $ch = curl_init($payUrl);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['request' => $base64Payload]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        "X-VERIFY: $xVerify"
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode >= 200 && $httpCode < 300) {
        $resData = json_decode($response, true);
        if (isset($resData['data']['instrumentResponse']['redirectInfo']['url'])) {
            echo json_encode(['redirectUrl' => $resData['data']['instrumentResponse']['redirectInfo']['url']]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Invalid response from PhonePe', 'details' => $resData]);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Payment initiation failed', 'details' => $response]);
    }
}

function checkPaymentStatus($db, $txnId) {
    $merchantId = isset($_ENV['PHONEPE_MERCHANT_ID']) ? $_ENV['PHONEPE_MERCHANT_ID'] : '';
    $saltKey = isset($_ENV['PHONEPE_SALT_KEY']) ? $_ENV['PHONEPE_SALT_KEY'] : '';
    $saltIndex = isset($_ENV['PHONEPE_SALT_INDEX']) ? $_ENV['PHONEPE_SALT_INDEX'] : 1;
    $statusUrl = isset($_ENV['PHONEPE_STATUS_URL']) ? $_ENV['PHONEPE_STATUS_URL'] : 'https://api-preprod.phonepe.com/apis/pg-sandbox';
    
    // Clean statusUrl to not have trailing slash
    $statusUrl = rtrim($statusUrl, '/');
    
    // Construct check status URL path: /pg/v1/status/{merchantId}/{merchantTransactionId}
    // Node code: `${PHONEPE_STATUS_URL}/${PHONEPE_MERCHANT_ID}/${txnId}`
    // But verify calculation needs `/pg/v1/status/...`
    // Usually PHONEPE_STATUS_URL is base like https://api.phonepe.com/apis/hermes
    // The path is /pg/v1/status/...
    
    // Let's assume standard path if env is just base.
    // Node: `const string = /pg/v1/status/${PHONEPE_MERCHANT_ID}/${txnId} + PHONEPE_SALT_KEY;`
    // So the path is definitely `/pg/v1/status/...`
    
    $path = "/pg/v1/status/$merchantId/$txnId";
    $string = $path . $saltKey;
    $hash = hash('sha256', $string);
    $xVerify = "$hash###$saltIndex";
    
    $fullUrl = "$statusUrl$path"; // Assuming statusUrl is the base host
    // Wait, Node code: axios.get(`${PHONEPE_STATUS_URL}/${PHONEPE_MERCHANT_ID}/${txnId}`)
    // This implies PHONEPE_STATUS_URL includes /pg/v1/status or similar? 
    // Or maybe it is just the host.
    // If Node does string calculation as `/pg/v1/status/...`, then the URL must match.
    // Let's rely on the string construction logic which is standard.
    
    // However, if PHONEPE_STATUS_URL in .env is full path, we need to be careful.
    // Let's assume PHONEPE_STATUS_URL in .env is `https://api-preprod.phonepe.com/apis/pg-sandbox`.
    
    $ch = curl_init($fullUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "X-VERIFY: $xVerify",
        "X-MERCHANT-ID: $merchantId"
    ]);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    $resData = json_decode($response, true);
    $status = isset($resData['data']['state']) ? $resData['data']['state'] : 'FAILED';
    
    // Update payment
    $query = "UPDATE payments SET status = :status, phonepe_response = :resp WHERE transaction_id = :txnId";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':status', $status);
    $jsonResp = json_encode($resData);
    $stmt->bindParam(':resp', $jsonResp);
    $stmt->bindParam(':txnId', $txnId);
    $stmt->execute();
    
    // Fetch updated payment
    $q = "SELECT * FROM payments WHERE transaction_id = :txnId";
    $s = $db->prepare($q);
    $s->bindParam(':txnId', $txnId);
    $s->execute();
    $payment = $s->fetch(PDO::FETCH_ASSOC);
    
    if ($payment) {
        syncEnquiry($db, $payment);
    }
    
    echo json_encode(['status' => $status]);
}

function handleCallback($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Decode response (it's base64 encoded in 'response' field usually?)
    // Node code: const { merchantTransactionId, state } = req.body;
    // So it seems it receives JSON directly?
    // PhonePe documentation says S2S callback sends base64 encoded JSON in 'response' body param.
    // But Node code accesses `req.body.merchantTransactionId`.
    // This implies Node might be using a middleware or the payload is flat?
    // Actually, `req.body` in express with `app.use(express.json())` parses JSON.
    // Let's assume req.body has the fields.
    
    $txnId = isset($data['merchantTransactionId']) ? $data['merchantTransactionId'] : null;
    $state = isset($data['state']) ? $data['state'] : null;
    
    if ($txnId && $state) {
        $query = "UPDATE payments SET status = :status, phonepe_response = :resp WHERE transaction_id = :txnId";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':status', $state);
        $jsonResp = json_encode($data);
        $stmt->bindParam(':resp', $jsonResp);
        $stmt->bindParam(':txnId', $txnId);
        $stmt->execute();
        
        $q = "SELECT * FROM payments WHERE transaction_id = :txnId";
        $s = $db->prepare($q);
        $s->bindParam(':txnId', $txnId);
        $s->execute();
        $payment = $s->fetch(PDO::FETCH_ASSOC);
        
        if ($payment) {
            syncEnquiry($db, $payment);
        }
    }
    
    // Always 200 OK
    http_response_code(200);
}

function syncEnquiry($db, $payment) {
    if (!in_array($payment['status'], ['SUCCESS', 'FAILED'])) return;
    
    $txnId = $payment['transaction_id'];
    
    // Check existing
    $q = "SELECT * FROM enquiries WHERE transaction_id = :txnId";
    $stmt = $db->prepare($q);
    $stmt->bindParam(':txnId', $txnId);
    $stmt->execute();
    $existing = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($existing) {
        $msg = "Transaction ID: " . $payment['transaction_id'] . "\nPhone: " . $payment['phone'] . "\nAddress: " . $payment['address'] . "\nAmount: " . $payment['amount'] . "\nStatus: " . $payment['status'] . "\nUpdated: " . date('Y-m-d H:i:s');
        $subject = "Payment " . $payment['status'] . " - " . $payment['amount']; // Remove rupee symbol to avoid charset issues
        
        $u = "UPDATE enquiries SET payment_status = :ps, subject = :sub, message = :msg WHERE id = :id";
        $s = $db->prepare($u);
        $s->bindParam(':ps', $payment['status']);
        $s->bindParam(':sub', $subject);
        $s->bindParam(':msg', $msg);
        $s->bindParam(':id', $existing['id']);
        $s->execute();
    } else {
        $companyName = 'Payment';
        $contactPerson = $payment['name'] ?: 'Unknown';
        $email = $payment['email'] ?: 'no-email@provided.com';
        $subject = "Payment " . $payment['status'] . " - " . $payment['amount'];
        $msg = "Transaction ID: " . $payment['transaction_id'] . "\nPhone: " . $payment['phone'] . "\nAddress: " . $payment['address'] . "\nAmount: " . $payment['amount'] . "\nStatus: " . $payment['status'];
        
        $i = "INSERT INTO enquiries (company_name, contact_person, email, subject, message, transaction_id, payment_status, amount, date) VALUES (:cn, :cp, :email, :sub, :msg, :tid, :ps, :amt, NOW())";
        $s = $db->prepare($i);
        $s->bindParam(':cn', $companyName);
        $s->bindParam(':cp', $contactPerson);
        $s->bindParam(':email', $email);
        $s->bindParam(':sub', $subject);
        $s->bindParam(':msg', $msg);
        $s->bindParam(':tid', $txnId);
        $s->bindParam(':ps', $payment['status']);
        $s->bindParam(':amt', $payment['amount']);
        $s->execute();
    }
}
?>
