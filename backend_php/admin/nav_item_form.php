<?php
include_once 'includes/db.php';
requireLogin();

$db = getDB();
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = isset($_POST['name']) ? $_POST['name'] : '';
    // Auto-generate slug from name
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
    
    // Auto-calculate order number
    $stmt = $db->query("SELECT MAX(order_num) as max_order FROM nav_items");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $order_num = ($row && $row['max_order'] !== null) ? $row['max_order'] + 1 : 1;

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
                        <!-- Slug is auto-generated from name -->
                        <!-- Order Number is auto-calculated -->
                        <button type="submit" class="btn btn-primary">Create Item</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
