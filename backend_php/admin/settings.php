<?php
include_once 'includes/db.php';
requireLogin();

$db = getDB();
$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $currentPassword = isset($_POST['current_password']) ? $_POST['current_password'] : '';
    $newPassword = isset($_POST['new_password']) ? $_POST['new_password'] : '';
    $confirmPassword = isset($_POST['confirm_password']) ? $_POST['confirm_password'] : '';
    
    $email = $_SESSION['admin_email'];
    
    if (!$currentPassword || !$newPassword || !$confirmPassword) {
        $error = 'All fields are required';
    } elseif ($newPassword !== $confirmPassword) {
        $error = 'New passwords do not match';
    } else {
        // Verify current password
        $query = "SELECT * FROM admin_config WHERE email = :email";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // If user doesn't exist in DB yet (using fallback), create them if fallback matches
        if (!$user) {
            $adminEmail = isset($_ENV['ADMIN_EMAIL']) ? $_ENV['ADMIN_EMAIL'] : 'beryfy2@gmail.com';
            if ($email === $adminEmail && $currentPassword === 'admin123') {
                // Fallback valid, create real user now
                $hash = password_hash($newPassword, PASSWORD_BCRYPT);
                $insert = "INSERT INTO admin_config (email, password_hash) VALUES (:email, :hash)";
                $iStmt = $db->prepare($insert);
                $iStmt->bindParam(':email', $email);
                $iStmt->bindParam(':hash', $hash);
                
                if ($iStmt->execute()) {
                    $success = 'Password updated successfully';
                } else {
                    $error = 'Database error';
                }
            } else {
                $error = 'Incorrect current password';
            }
        } else {
            if (password_verify($currentPassword, $user['password_hash'])) {
                $hash = password_hash($newPassword, PASSWORD_BCRYPT);
                $update = "UPDATE admin_config SET password_hash = :hash WHERE email = :email";
                $uStmt = $db->prepare($update);
                $uStmt->bindParam(':hash', $hash);
                $uStmt->bindParam(':email', $email);
                
                if ($uStmt->execute()) {
                    $success = 'Password updated successfully';
                } else {
                    $error = 'Database error';
                }
            } else {
                $error = 'Incorrect current password';
            }
        }
    }
}

$pageTitle = 'Settings';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle; ?> - Admin Panel</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="admin-layout">
        <?php include 'includes/sidebar.php'; ?>
        
        <div class="admin-main">
            <?php include 'includes/header.php'; ?>
            
            <div class="admin-content">
                <div class="page-header">
                    <h1 class="page-title"><?php echo $pageTitle; ?></h1>
                </div>
                
                <div class="card" style="max-width: 500px;">
                    <h2 style="margin-top: 0;">Change Password</h2>
                    
                    <?php if ($error): ?>
                        <div class="alert alert-danger"><?php echo htmlspecialchars($error); ?></div>
                    <?php endif; ?>
                    
                    <?php if ($success): ?>
                        <div class="alert alert-success" style="background: #d1fae5; color: #065f46; padding: 10px; border-radius: 4px; margin-bottom: 20px;">
                            <?php echo htmlspecialchars($success); ?>
                        </div>
                    <?php endif; ?>
                    
                    <form method="POST">
                        <div class="form-group">
                            <label>Current Password</label>
                            <input type="password" name="current_password" class="form-control" required>
                        </div>
                        
                        <div class="form-group">
                            <label>New Password</label>
                            <input type="password" name="new_password" class="form-control" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Confirm New Password</label>
                            <input type="password" name="confirm_password" class="form-control" required>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">Update Password</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
