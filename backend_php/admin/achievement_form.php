<?php
include_once 'includes/db.php';
requireLogin();

$db = getDB();

$id = isset($_GET['id']) ? $_GET['id'] : null;
$item = null;
$error = '';

if ($id) {
    $stmt = $db->prepare("SELECT * FROM achievements WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$item) {
        header('Location: achievements.php');
        exit();
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $content = $_POST['content'];
    $link = $_POST['link'];
    $date = $_POST['date'];
    
    // Handle File Upload
    $photoPath = $item ? $item['photo'] : '';
    
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === 0) {
        $uploadDir = __DIR__ . '/../uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
        
        $fileName = time() . '_' . basename($_FILES['photo']['name']);
        $targetPath = $uploadDir . $fileName;
        
        if (move_uploaded_file($_FILES['photo']['tmp_name'], $targetPath)) {
            // Delete old photo
            if ($item && $item['photo'] && file_exists(__DIR__ . '/../' . $item['photo'])) {
                unlink(__DIR__ . '/../' . $item['photo']);
            }
            $photoPath = 'uploads/' . $fileName;
        }
    }
    
    if ($id) {
        // Update
        $query = "UPDATE achievements SET title = :title, content = :content, link = :link, date = :date, photo = :photo WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
    } else {
        // Insert
        $query = "INSERT INTO achievements (title, content, link, date, photo) VALUES (:title, :content, :link, :date, :photo)";
        $stmt = $db->prepare($query);
    }

    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':content', $content);
    $stmt->bindParam(':link', $link);
    $stmt->bindParam(':date', $date);
    $stmt->bindParam(':photo', $photoPath);

    if ($stmt->execute()) {
        header('Location: achievements.php');
        exit();
    } else {
        $error = "Database error";
    }
}

$pageTitle = $id ? 'Edit Achievement' : 'Add Achievement';
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
                    <a href="achievements.php" class="btn btn-secondary">Back</a>
                </div>
                
                <div class="card">
                    <?php if ($error): ?>
                        <div class="alert alert-danger"><?php echo $error; ?></div>
                    <?php endif; ?>
                    
                    <form method="POST" enctype="multipart/form-data">
                        <div class="form-group">
                            <label>Title</label>
                            <input type="text" name="title" class="form-control" value="<?php echo $item ? htmlspecialchars($item['title']) : ''; ?>" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Content</label>
                            <textarea name="content" class="form-control" rows="5"><?php echo $item ? htmlspecialchars($item['content']) : ''; ?></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>External Link</label>
                            <input type="url" name="link" class="form-control" value="<?php echo $item ? htmlspecialchars($item['link']) : ''; ?>" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Date</label>
                            <input type="date" name="date" class="form-control" value="<?php echo $item ? date('Y-m-d', strtotime($item['date'])) : date('Y-m-d'); ?>" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Photo</label>
                            <?php if ($item && $item['photo']): ?>
                                <?php
                                    $photoSrc = $item['photo'];
                                    $pos = strpos($photoSrc, 'uploads/');
                                    if ($pos !== false) {
                                        $photoSrc = substr($photoSrc, $pos);
                                    }
                                    if (strpos($photoSrc, '/') !== 0) {
                                        $photoSrc = '/' . $photoSrc;
                                    }
                                ?>
                                <div style="margin-bottom: 10px;">
                                    <img src="<?php echo htmlspecialchars($photoSrc); ?>" alt="Current Photo" style="max-width: 250px; max-height: 250px; object-fit: contain; border-radius: 4px;">
                                </div>
                            <?php endif; ?>
                            <input type="file" name="photo" class="form-control" accept="image/*" <?php echo $item ? '' : 'required'; ?>>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">Save Achievement</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
