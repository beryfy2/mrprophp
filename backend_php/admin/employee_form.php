<?php
include_once 'includes/db.php';
requireLogin();

$db = getDB();
$id = isset($_GET['id']) ? $_GET['id'] : null;
$employee = ['name' => '', 'designation' => '', 'bio' => '', 'order_num' => 0, 'photo_url' => ''];
$error = '';

if ($id) {
    $stmt = $db->prepare("SELECT * FROM employees WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $fetched = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($fetched) {
        $employee = $fetched;
    } else {
        header('Location: employees.php');
        exit();
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = isset($_POST['name']) ? $_POST['name'] : '';
    $designation = isset($_POST['designation']) ? $_POST['designation'] : '';
    $bio = isset($_POST['bio']) ? $_POST['bio'] : '';
    $order_num = isset($_POST['order_num']) ? $_POST['order_num'] : 0;
    
    // Handle Photo Upload
    $photoPath = isset($employee['photo_url']) ? $employee['photo_url'] : '';
    
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
        
        $filename = time() . '-' . preg_replace('/[^a-zA-Z0-9._-]/', '_', basename($_FILES['photo']['name']));
        $targetFile = $uploadDir . $filename;
        
        if (move_uploaded_file($_FILES['photo']['tmp_name'], $targetFile)) {
            // Delete old photo
            if ($photoPath && file_exists('../' . $photoPath)) {
                unlink('../' . $photoPath);
            }
            $photoPath = 'uploads/' . $filename;
        }
    }

    if ($id) {
        // Update
        $query = "UPDATE employees SET name = :name, designation = :designation, bio = :bio, order_num = :order_num, photo_url = :photo WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
    } else {
        // Insert
        $query = "INSERT INTO employees (name, designation, bio, order_num, photo_url) VALUES (:name, :designation, :bio, :order_num, :photo)";
        $stmt = $db->prepare($query);
    }

    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':designation', $designation);
    $stmt->bindParam(':bio', $bio);
    $stmt->bindParam(':order_num', $order_num);
    $stmt->bindParam(':photo', $photoPath);

    if ($stmt->execute()) {
        header('Location: employees.php');
        exit();
    } else {
        $error = "Database error";
    }
}

$pageTitle = $id ? 'Edit Employee' : 'Add Employee';
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
                    <a href="employees.php" class="btn" style="background: #e2e8f0; color: #333;">Back</a>
                </div>

                <?php if ($error): ?>
                    <div class="alert alert-danger"><?php echo htmlspecialchars($error); ?></div>
                <?php endif; ?>

                <div class="login-card" style="max-width: 800px;">
                    <form method="POST" enctype="multipart/form-data">
                        <div class="form-group">
                            <label class="form-label">Name</label>
                            <input type="text" name="name" class="form-control" required value="<?php echo htmlspecialchars($employee['name']); ?>">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Designation</label>
                            <input type="text" name="designation" class="form-control" required value="<?php echo htmlspecialchars($employee['designation']); ?>">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Bio</label>
                            <textarea name="bio" class="form-control" rows="4"><?php echo htmlspecialchars($employee['bio']); ?></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Order Number</label>
                            <input type="number" name="order_num" class="form-control" value="<?php echo htmlspecialchars($employee['order_num']); ?>">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Photo</label>
                            <?php if (isset($employee['photo_url']) && $employee['photo_url']): ?>
                                <div style="margin-bottom: 10px;">
                                    <img src="../<?php echo htmlspecialchars($employee['photo_url']); ?>" alt="Current Photo" style="width: 100px; border-radius: 8px;">
                                </div>
                            <?php endif; ?>
                            <input type="file" name="photo" class="form-control" accept="image/*">
                        </div>
                        <button type="submit" class="btn btn-primary">Save Employee</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
