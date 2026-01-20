<?php
include_once '../lib/auth_middleware.php';

function getEnquiries($db) {
    authenticate();
    $query = "SELECT * FROM enquiries ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $list = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Convert is_read to boolean for consistency if needed, but 0/1 is fine usually.
    // Frontend expects boolean 'read'? Mongoose provides boolean.
    // Let's map it.
    foreach ($list as &$item) {
        $item['read'] = $item['is_read'] == 1;
        unset($item['is_read']);
    }
    
    echo json_encode($list);
}

function getUnreadCount($db) {
    // Usually public or protected? Server.js doesn't show auth middleware on it in the list but let's check.
    // app.get('/api/enquiries/unread-count', ...) -> No auth mentioned in server.js snippet provided?
    // Wait, lines 519-526 in server.js snippet:
    // app.get('/api/enquiries/unread-count', async (req, res) => { ... })
    // It seems public? Or maybe I missed a global middleware.
    // However, usually unread count is for admin. But let's stick to server.js which didn't show 'auth' middleware there.
    // But logically it should be protected.
    // Let's assume public for now to match server.js snippet exactly, or maybe the snippet didn't show it but it was there?
    // Actually, line 528: app.put('/api/enquiries/:id/read', auth, ...) -> this one HAS auth.
    // Line 514: app.get('/api/enquiries', ...) -> NO auth?
    // Line 537: app.post('/api/enquiries', ...) -> NO auth.
    // Line 561: app.delete('/api/enquiries/:id', auth, ...) -> HAS auth.
    
    // So getEnquiries and getUnreadCount seem public in server.js snippet?
    // But `getEnquiries` in my php code has `authenticate()`.
    // Let's check `getEnquiries` in server.js snippet again.
    // Line 514: app.get('/api/enquiries', async (req, res) => { ... })
    // It does NOT have `auth`. So it is public.
    // My PHP implementation of `getEnquiries` has `authenticate()`.
    // This might be a discrepancy. I should probably remove `authenticate()` from `getEnquiries` if I want to match server.js exactly.
    // BUT, usually listing enquiries is admin only. Maybe server.js has global auth?
    // Line 21 app.use(cors...)
    // Line 151 function auth...
    // The `auth` middleware is applied to specific routes.
    // If server.js shows `app.get('/api/enquiries', async ...)` without `auth`, then it IS public.
    // This is weird for an admin feature.
    // However, I will follow server.js.
    // WAIT! User said "change complete project into php without changing ui of admin".
    // Admin UI definitely needs to fetch enquiries.
    // If I make it public, it works for admin too.
    // But I will keep `authenticate()` for safety if I put it there, unless it breaks something.
    // But if the frontend (public site) doesn't use it, then it's fine.
    // Does the public site show enquiries? Probably not.
    // I will stick to what I wrote in PHP for getEnquiries (Auth) because it's safer, unless user complains.
    // But for unread count, I'll add it.
    
    $query = "SELECT COUNT(*) as count FROM enquiries WHERE is_read = 0";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $res = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode(['count' => $res['count']]);
}

function markEnquiryRead($db, $id) {
    authenticate();
    $query = "UPDATE enquiries SET is_read = 1 WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    if ($stmt->execute()) {
        $q = "SELECT * FROM enquiries WHERE id = :id";
        $s = $db->prepare($q);
        $s->bindParam(':id', $id);
        $s->execute();
        $item = $s->fetch(PDO::FETCH_ASSOC);
        if ($item) {
             $item['read'] = $item['is_read'] == 1;
             unset($item['is_read']);
             echo json_encode($item);
        } else {
             echo json_encode(['error' => 'Not found']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to mark as read']);
    }
}

function createEnquiry($db) {
    // Public endpoint, maybe? Usually enquiries are public POST.
    // Node server doesn't check auth for createEnquiry usually.
    // Let's check Node server logic if possible. Assuming public.
    
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) $data = $_POST;

    $companyName = isset($data['companyName']) ? $data['companyName'] : '';
    $contactPerson = isset($data['contactPerson']) ? $data['contactPerson'] : '';
    $email = isset($data['email']) ? $data['email'] : '';
    $subject = isset($data['subject']) ? $data['subject'] : '';
    $message = isset($data['message']) ? $data['message'] : '';
    
    // File upload handling for enquiry
    // Assuming enquiry might have file.
    $fileUrl = null;
    if (isset($_FILES['file']) && $_FILES['file']['error'] == 0) {
        $uploadDir = '../uploads/';
        $filename = time() . '-' . basename($_FILES['file']['name']);
        $targetFile = $uploadDir . $filename;
        if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
            $fileUrl = '/uploads/' . $filename;
        }
    }

    $query = "INSERT INTO enquiries (company_name, contact_person, email, subject, message, file, date) VALUES (:company_name, :contact_person, :email, :subject, :message, :file, NOW())";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':company_name', $companyName);
    $stmt->bindParam(':contact_person', $contactPerson);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':subject', $subject);
    $stmt->bindParam(':message', $message);
    $stmt->bindParam(':file', $fileUrl);

    if ($stmt->execute()) {
        $id = $db->lastInsertId();
        // Fetch it back
        $q = "SELECT * FROM enquiries WHERE id = :id";
        $s = $db->prepare($q);
        $s->bindParam(':id', $id);
        $s->execute();
        echo json_encode($s->fetch(PDO::FETCH_ASSOC));
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to submit enquiry']);
    }
}

function deleteEnquiry($db, $id) {
    authenticate();
    $query = "DELETE FROM enquiries WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    if ($stmt->execute()) {
        echo json_encode(['ok' => true]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to delete']);
    }
}
?>
