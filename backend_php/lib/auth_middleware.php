<?php
include_once 'jwt_helper.php';

function authenticate() {
    if (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    } else {
        $authHeader = '';
    }
    
    // Some environments don't have apache_request_headers, try $_SERVER
    if (!$authHeader && isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    }

    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
        $payload = JWT::decode($token, 'dev_secret_change_me'); // Use same secret
        if ($payload) {
            return $payload;
        }
    }

    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}
?>
