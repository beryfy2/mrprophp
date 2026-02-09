<?php
session_start();
include_once 'includes/db.php';
include_once '../lib/env_loader.php';
include_once '../lib/smtp_sender.php';

// Load .env
loadEnv(__DIR__ . '/../../.env');

$db = getDB();

try {
    // Get the first admin
    $stmt = $db->query("SELECT id, email FROM admin_config LIMIT 1");
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $email = $user['email'];
        
        // Generate OTP
        $otp = rand(100000, 999999);
        $expiry = date('Y-m-d H:i:s', strtotime('+15 minutes'));

        // Save to DB
        $update = $db->prepare("UPDATE admin_config SET reset_otp = :otp, reset_otp_expiry = :expiry WHERE id = :id");
        $update->bindParam(':otp', $otp);
        $update->bindParam(':expiry', $expiry);
        $update->bindParam(':id', $user['id']);
        $update->execute();

        // Send Email using SMTP from .env
        $smtp_host = getenv('SMTP_HOST');
        $smtp_port = getenv('SMTP_PORT');
        $smtp_user = getenv('SMTP_USER');
        $smtp_pass = getenv('SMTP_PASS');
        $from_email = getenv('FROM_EMAIL');

        if ($smtp_host && $smtp_user && $smtp_pass) {
            $sender = new SMTPSender($smtp_host, $smtp_port, $smtp_user, $smtp_pass, $from_email);
            
            $subject = "Password Reset OTP - Mr. Professional";
            $message = "
                <h2>Password Reset Request</h2>
                <p>You have requested to reset your password.</p>
                <p><strong>Your OTP is: $otp</strong></p>
                <p>This OTP is valid for 15 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
            ";

            $result = $sender->send($email, $subject, $message);
            
            if ($result !== true) {
                // Log error but continue (fallback to file log for dev)
                error_log("SMTP Error: " . $result);
                echo "<script>alert('Error sending email: $result');</script>";
            }
        } else {
             // Fallback to mail() if .env not configured (unlikely given user request)
             $subject = "Password Reset OTP";
             $headers = "From: no-reply@mrprofessional.in";
             @mail($email, $subject, "OTP: $otp", $headers);
        }

        // For development/debugging (Always keep this as backup)
        file_put_contents(__DIR__ . '/../../last_otp.txt', "Email: $email\nOTP: $otp\nTime: " . date('Y-m-d H:i:s'));

        // Set session and redirect
        $_SESSION['reset_email'] = $email;
        header('Location: verify_otp.php');
        exit();
    } else {
        die("No admin account found.");
    }
} catch (Exception $e) {
    die("System error: " . $e->getMessage());
}
?>