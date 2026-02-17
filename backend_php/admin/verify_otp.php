<?php
include_once 'includes/db.php';

$error = '';
$email = isset($_SESSION['reset_email']) ? $_SESSION['reset_email'] : '';

if (!$email) {
    header('Location: send_reset_otp.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $otp = isset($_POST['otp']) ? trim($_POST['otp']) : '';
    $new_password = isset($_POST['new_password']) ? $_POST['new_password'] : '';
    $confirm_password = isset($_POST['confirm_password']) ? $_POST['confirm_password'] : '';
    $db = getDB();

    if ($new_password !== $confirm_password) {
        $error = "Passwords do not match.";
    } elseif (strlen($new_password) < 6) {
        $error = "Password must be at least 6 characters.";
    } else {
        try {
            // Verify OTP (expiry checked in PHP to avoid DB timezone issues)
            $stmt = $db->prepare("SELECT id, reset_otp_expiry FROM admin_config WHERE email = :email AND reset_otp = :otp");
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':otp', $otp);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                $isExpired = false;
                if (!empty($user['reset_otp_expiry'])) {
                    $expiryTime = strtotime($user['reset_otp_expiry']);
                    if ($expiryTime !== false && $expiryTime < time()) {
                        $isExpired = true;
                    }
                }

                if ($isExpired) {
                    $error = "Invalid or expired OTP.";
                } else {
                    // Update Password and Clear OTP
                    $hash = password_hash($new_password, PASSWORD_BCRYPT);
                    $update = $db->prepare("UPDATE admin_config SET password_hash = :hash, reset_otp = NULL, reset_otp_expiry = NULL WHERE id = :id");
                    $update->bindParam(':hash', $hash);
                    $update->bindParam(':id', $user['id']);
                    
                    if ($update->execute()) {
                        unset($_SESSION['reset_email']);
                        echo "<script>alert('Password reset successfully!'); window.location.href='login.php';</script>";
                        exit();
                    } else {
                        $error = "Failed to update password.";
                    }
                }
            } else {
                $error = "Invalid or expired OTP.";
            }
        } catch (Exception $e) {
            $error = "System error: " . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify OTP - Admin Panel</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="login-page">
    <div class="login-card">
        <h1 class="login-title">Verify OTP</h1>
        <p style="text-align: center; color: #666; margin-bottom: 20px;">
            OTP sent to: <strong><?php echo htmlspecialchars($email); ?></strong>
            <br>
            <small>(Check 'last_otp.txt' in project root if email fails locally)</small>
        </p>
        
        <?php if ($error): ?>
            <div class="alert alert-danger"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>

        <form method="POST">
            <div class="form-group">
                <label class="form-label">Enter OTP</label>
                <input type="text" name="otp" class="form-control" required placeholder="6-digit OTP" pattern="\d{6}" title="6-digit number">
            </div>
            <div class="form-group">
                <label class="form-label">New Password</label>
                <input type="password" name="new_password" class="form-control" required minlength="6">
            </div>
            <div class="form-group">
                <label class="form-label">Confirm Password</label>
                <input type="password" name="confirm_password" class="form-control" required minlength="6">
            </div>
            <button type="submit" class="btn btn-primary">Reset Password</button>
            <div style="text-align: center; margin-top: 15px;">
                <a href="send_reset_otp.php" style="color: #666; font-size: 14px; text-decoration: none;">Resend OTP</a>
            </div>
        </form>
    </div>
</body>
</html>
