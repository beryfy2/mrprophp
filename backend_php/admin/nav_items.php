<?php
include_once 'includes/db.php';
requireLogin();

$db = getDB();

// Handle Delete (Nav Item)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_id'])) {
    $id = $_POST['delete_id'];
    $stmt = $db->prepare("DELETE FROM nav_items WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    header('Location: nav_items.php');
    exit();
}

// Fetch All
$stmt = $db->query("SELECT * FROM nav_items ORDER BY order_num ASC");
$navItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

$pageTitle = 'Navigation Items';
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
                    <h1 class="page-title">Navigation Items</h1>
                    <a href="nav_item_form.php" class="btn btn-add">Add New Item</a>
                </div>

                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Slug</th>
                                <th>Order</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($navItems as $item): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($item['name']); ?></td>
                                <td><?php echo htmlspecialchars($item['slug']); ?></td>
                                <td><?php echo htmlspecialchars($item['order_num']); ?></td>
                                <td>
                                    <a href="nav_item_detail.php?id=<?php echo $item['id']; ?>" class="action-btn btn-edit">Manage</a>
                                    <form method="POST" style="display:inline;" onsubmit="return confirm('Delete this item and all its contents?');">
                                        <input type="hidden" name="delete_id" value="<?php echo $item['id']; ?>">
                                        <button type="submit" class="action-btn btn-delete">Delete</button>
                                    </form>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
