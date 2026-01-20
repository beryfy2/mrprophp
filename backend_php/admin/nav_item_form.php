<?php
include_once 'includes/db.php';
requireLogin();

$db = getDB();
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = isset($_POST['name']) ? $_POST['name'] : '';
    $slug = isset($_POST['slug']) ? $_POST['slug'] : '';
    $order_num = isset($_POST['order_num']) ? $_POST['order_num'] : 0;

    $query = "INSERT INTO nav_items (name, slug, order_num) VALUES (:name, :slug, :order_num)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':slug', $slug);
    $stmt->bindParam(':order_num', $order_num);

    if ($stmt->execute()) {
        header('Location: nav_items.php');
        exit();
    } else {
        $error = "Database error";
    }
}

$pageTitle = 'Add Navigation Item';
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
                    <a href="nav_items.php" class="btn" style="background: #e2e8f0; color: #333;">Back</a>
                </div>

                <?php if ($error): ?>
                    <div class="alert alert-danger"><?php echo htmlspecialchars($error); ?></div>
                <?php endif; ?>

                <div class="login-card" style="max-width: 600px;">
                    <form method="POST">
                        <div class="form-group">
                            <label class="form-label">Name</label>
                            <input type="text" name="name" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Slug</label>
                            <input type="text" name="slug" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Order Number</label>
                            <input type="number" name="order_num" class="form-control" value="0">
                        </div>
                        <button type="submit" class="btn btn-primary">Create Item</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
