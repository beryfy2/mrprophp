<?php
include_once 'includes/db.php';
requireLogin();

$db = getDB();
$id = isset($_GET['id']) ? $_GET['id'] : null;
if (!$id) {
    header('Location: nav_items.php');
    exit();
}

$error = '';
$success = '';

// Handle Nav Item Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_item'])) {
    $name = isset($_POST['name']) ? $_POST['name'] : '';
    // Auto-generate slug from name
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
    $order_num = isset($_POST['order_num']) ? $_POST['order_num'] : 0;

    $query = "UPDATE nav_items SET name = :name, slug = :slug, order_num = :order_num WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':slug', $slug);
    $stmt->bindParam(':order_num', $order_num);
    $stmt->bindParam(':id', $id);
    
    if ($stmt->execute()) {
        $success = "Nav Item updated successfully";
    } else {
        $error = "Failed to update item";
    }
}

// Handle Title Delete
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_title_id'])) {
    $tid = $_POST['delete_title_id'];
    $stmt = $db->prepare("DELETE FROM titles WHERE id = :id");
    $stmt->bindParam(':id', $tid);
    $stmt->execute();
    $success = "Title deleted";
}

// Fetch Nav Item
$stmt = $db->prepare("SELECT * FROM nav_items WHERE id = :id");
$stmt->bindParam(':id', $id);
$stmt->execute();
$item = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$item) {
    header('Location: nav_items.php');
    exit();
}

// Fetch Titles
$stmt = $db->prepare("SELECT * FROM titles WHERE nav_item_id = :id ORDER BY order_num ASC");
$stmt->bindParam(':id', $id);
$stmt->execute();
$titles = $stmt->fetchAll(PDO::FETCH_ASSOC);

$pageTitle = 'Manage: ' . $item['name'];
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
                    <h1 class="page-title"><?php echo htmlspecialchars($item['name']); ?></h1>
                    <a href="nav_items.php" class="btn" style="background: #e2e8f0; color: #333;">Back</a>
                </div>

                <?php if ($error): ?>
                    <div class="alert alert-danger"><?php echo htmlspecialchars($error); ?></div>
                <?php endif; ?>
                <?php if ($success): ?>
                    <div class="alert" style="background: #dcfce7; color: #166534;"><?php echo htmlspecialchars($success); ?></div>
                <?php endif; ?>

                <div class="login-card" style="max-width: 100%; margin-bottom: 32px;">
                    <h2 style="margin-top:0; font-size:18px;">Edit Nav Item Details</h2>
                    <form method="POST">
                        <input type="hidden" name="update_item" value="1">
                        <div style="display: flex; gap: 20px;">
                            <div class="form-group" style="flex:1;">
                                <label class="form-label">Name</label>
                                <input type="text" name="name" class="form-control" required value="<?php echo htmlspecialchars($item['name']); ?>">
                            </div>
                            <!-- Slug is auto-generated from name -->
                            <div class="form-group" style="width: 100px;">
                                <label class="form-label">Order</label>
                                <input type="number" name="order_num" class="form-control" value="<?php echo htmlspecialchars($item['order_num']); ?>">
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: auto;">Save Changes</button>
                    </form>
                </div>

                <div class="page-header">
                    <h2 class="page-title" style="font-size: 20px;">Titles</h2>
                    <a href="title_form.php?nav_item_id=<?php echo $item['id']; ?>" class="btn btn-add">Add Title</a>
                </div>

                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Order</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($titles as $t): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($t['title']); ?></td>
                                <td><?php echo htmlspecialchars($t['order_num']); ?></td>
                                <td>
                                    <a href="title_detail.php?id=<?php echo $t['id']; ?>" class="action-btn btn-edit">Manage</a>
                                    <form method="POST" style="display:inline;" onsubmit="return confirm('Delete this title?');">
                                        <input type="hidden" name="delete_title_id" value="<?php echo $t['id']; ?>">
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
