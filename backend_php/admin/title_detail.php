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

// Update Title
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_title'])) {
    $name = isset($_POST['name']) ? $_POST['name'] : '';
    $slug = isset($_POST['slug']) ? $_POST['slug'] : '';
    $order_num = isset($_POST['order_num']) ? $_POST['order_num'] : 0;

    $query = "UPDATE titles SET name = :name, slug = :slug, order_num = :order_num WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':slug', $slug);
    $stmt->bindParam(':order_num', $order_num);
    $stmt->bindParam(':id', $id);
    
    if ($stmt->execute()) {
        $success = "Title updated successfully";
    } else {
        $error = "Failed to update title";
    }
}

// Delete Subtitle
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_subtitle_id'])) {
    $sid = $_POST['delete_subtitle_id'];
    $stmt = $db->prepare("DELETE FROM subtitles WHERE id = :id");
    $stmt->bindParam(':id', $sid);
    $stmt->execute();
    $success = "Subtitle deleted";
}

// Fetch Title
$stmt = $db->prepare("SELECT * FROM titles WHERE id = :id");
$stmt->bindParam(':id', $id);
$stmt->execute();
$title = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$title) {
    header('Location: nav_items.php');
    exit();
}

// Fetch Subtitles
$stmt = $db->prepare("SELECT * FROM subtitles WHERE title_id = :id ORDER BY order_num ASC");
$stmt->bindParam(':id', $id);
$stmt->execute();
$subtitles = $stmt->fetchAll(PDO::FETCH_ASSOC);

$pageTitle = 'Manage Title: ' . $title['name'];
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
                    <h1 class="page-title"><?php echo htmlspecialchars($title['name']); ?></h1>
                    <a href="nav_item_detail.php?id=<?php echo $title['nav_item_id']; ?>" class="btn" style="background: #e2e8f0; color: #333;">Back</a>
                </div>

                <?php if ($error): ?>
                    <div class="alert alert-danger"><?php echo htmlspecialchars($error); ?></div>
                <?php endif; ?>
                <?php if ($success): ?>
                    <div class="alert" style="background: #dcfce7; color: #166534;"><?php echo htmlspecialchars($success); ?></div>
                <?php endif; ?>

                <div class="login-card" style="max-width: 100%; margin-bottom: 32px;">
                    <h2 style="margin-top:0; font-size:18px;">Edit Title Details</h2>
                    <form method="POST">
                        <input type="hidden" name="update_title" value="1">
                        <div style="display: flex; gap: 20px;">
                            <div class="form-group" style="flex:1;">
                                <label class="form-label">Name</label>
                                <input type="text" name="name" class="form-control" required value="<?php echo htmlspecialchars($title['name']); ?>">
                            </div>
                            <div class="form-group" style="flex:1;">
                                <label class="form-label">Slug</label>
                                <input type="text" name="slug" class="form-control" required value="<?php echo htmlspecialchars($title['slug']); ?>">
                            </div>
                            <div class="form-group" style="width: 100px;">
                                <label class="form-label">Order</label>
                                <input type="number" name="order_num" class="form-control" value="<?php echo htmlspecialchars($title['order_num']); ?>">
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: auto;">Save Changes</button>
                    </form>
                </div>

                <div class="page-header">
                    <h2 class="page-title" style="font-size: 20px;">Subtitles</h2>
                    <a href="subtitle_form.php?title_id=<?php echo $title['id']; ?>" class="btn btn-add">Add Subtitle</a>
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
                            <?php foreach ($subtitles as $s): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($s['name']); ?></td>
                                <td><?php echo htmlspecialchars($s['slug']); ?></td>
                                <td><?php echo htmlspecialchars($s['order_num']); ?></td>
                                <td>
                                    <a href="subtitle_detail.php?id=<?php echo $s['id']; ?>" class="action-btn btn-edit">Manage</a>
                                    <form method="POST" style="display:inline;" onsubmit="return confirm('Delete this subtitle?');">
                                        <input type="hidden" name="delete_subtitle_id" value="<?php echo $s['id']; ?>">
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
