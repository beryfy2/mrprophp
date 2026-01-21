<?php
include_once 'includes/db.php';
requireLogin();

$db = getDB();
$nav_item_id = isset($_GET['nav_item_id']) ? $_GET['nav_item_id'] : null;

if (!$nav_item_id) {
    header('Location: nav_items.php');
    exit();
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = isset($_POST['name']) ? $_POST['name'] : '';
    $slug = isset($_POST['slug']) ? $_POST['slug'] : '';
    $order_num = isset($_POST['order_num']) ? $_POST['order_num'] : 0;

    $query = "INSERT INTO titles (title, nav_item_id, order_num) VALUES (:name, :nid, :order_num)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':order_num', $order_num);
    $stmt->bindParam(':nid', $nav_item_id);

    if ($stmt->execute()) {
        header('Location: nav_item_detail.php?id=' . $nav_item_id);
        exit();
    } else {
        $error = "Database error";
    }
}

$pageTitle = 'Add Title';
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
                    <a href="nav_item_detail.php?id=<?php echo $nav_item_id; ?>" class="btn" style="background: #e2e8f0; color: #333;">Back</a>
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
                            <label class="form-label">Order Number</label>
                            <input type="number" name="order_num" class="form-control" value="0">
                        </div>
                        <button type="submit" class="btn btn-primary">Create Title</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
