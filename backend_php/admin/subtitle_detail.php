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

// Handle Delete Question
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_question_index'])) {
    $index = (int)$_POST['delete_question_index'];
    
    // Fetch current questions
    $stmt = $db->prepare("SELECT questions FROM subtitles WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result) {
        $questions = json_decode($result['questions'], true);
        if (!$questions) $questions = [];
        if (isset($questions[$index])) {
            // Remove question
            array_splice($questions, $index, 1);
            
            // Update DB
            $json = json_encode($questions);
            $update = $db->prepare("UPDATE subtitles SET questions = :json WHERE id = :id");
            $update->bindParam(':json', $json);
            $update->bindParam(':id', $id);
            if ($update->execute()) {
                $success = "Question deleted successfully";
            } else {
                $error = "Failed to delete question";
            }
        }
    }
}

// Update Subtitle
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_subtitle'])) {
    $name = isset($_POST['name']) ? $_POST['name'] : '';
    $slug = isset($_POST['slug']) ? $_POST['slug'] : '';
    $order_num = isset($_POST['order_num']) ? $_POST['order_num'] : 0;

    $query = "UPDATE subtitles SET name = :name, slug = :slug, order_num = :order_num WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':slug', $slug);
    $stmt->bindParam(':order_num', $order_num);
    $stmt->bindParam(':id', $id);
    
    if ($stmt->execute()) {
        $success = "Subtitle updated successfully";
    } else {
        $error = "Failed to update subtitle";
    }
}

// Fetch Subtitle
$stmt = $db->prepare("SELECT * FROM subtitles WHERE id = :id");
$stmt->bindParam(':id', $id);
$stmt->execute();
$subtitle = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$subtitle) {
    header('Location: nav_items.php');
    exit();
}

$questions = json_decode($subtitle['questions'], true);
if (!$questions) $questions = [];

$pageTitle = 'Manage Subtitle: ' . $subtitle['name'];
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
                    <h1 class="page-title"><?php echo htmlspecialchars($subtitle['name']); ?></h1>
                    <a href="title_detail.php?id=<?php echo $subtitle['parent_title_id']; ?>" class="btn" style="background: #e2e8f0; color: #333;">Back</a>
                </div>

                <?php if ($error): ?>
                    <div class="alert alert-danger"><?php echo htmlspecialchars($error); ?></div>
                <?php endif; ?>
                <?php if ($success): ?>
                    <div class="alert alert-success" style="background: #dcfce7; color: #166534; padding: 10px; border-radius: 4px; margin-bottom: 20px;"><?php echo htmlspecialchars($success); ?></div>
                <?php endif; ?>

                <div class="login-card" style="max-width: 100%; margin-bottom: 32px;">
                    <h2 style="margin-top:0; font-size:18px;">Edit Subtitle Details</h2>
                    <form method="POST">
                        <input type="hidden" name="update_subtitle" value="1">
                        <div style="display: flex; gap: 20px;">
                            <div class="form-group" style="flex:1;">
                                <label class="form-label">Name</label>
                                <input type="text" name="name" class="form-control" required value="<?php echo htmlspecialchars($subtitle['name']); ?>">
                            </div>
                            <div class="form-group" style="flex:1;">
                                <label class="form-label">Slug</label>
                                <input type="text" name="slug" class="form-control" required value="<?php echo htmlspecialchars(isset($subtitle['slug']) ? $subtitle['slug'] : ''); ?>">
                            </div>
                            <div class="form-group" style="width: 100px;">
                                <label class="form-label">Order</label>
                                <input type="number" name="order_num" class="form-control" value="<?php echo htmlspecialchars(isset($subtitle['order_num']) ? $subtitle['order_num'] : 0); ?>">
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: auto;">Save Changes</button>
                    </form>
                </div>

                <div class="page-header">
                    <h2 class="page-title" style="font-size: 20px;">Questions</h2>
                    <a href="question_form.php?subtitle_id=<?php echo $subtitle['id']; ?>" class="btn btn-primary">Add Question</a>
                </div>
                
                <div class="card">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th style="width: 50px;">#</th>
                                <th>Question</th>
                                <th>Format</th>
                                <th>Files</th>
                                <th style="width: 150px;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($questions as $index => $q): ?>
                            <tr>
                                <td><?php echo $index + 1; ?></td>
                                <td><?php echo htmlspecialchars(substr(isset($q['question']) ? $q['question'] : '', 0, 100)) . (strlen(isset($q['question']) ? $q['question'] : '') > 100 ? '...' : ''); ?></td>
                                <td><?php echo htmlspecialchars(isset($q['format']) ? $q['format'] : 'written'); ?></td>
                                <td><?php echo count(isset($q['files']) ? $q['files'] : []); ?> files</td>
                                <td>
                                    <a href="question_form.php?subtitle_id=<?php echo $subtitle['id']; ?>&index=<?php echo $index; ?>" class="action-btn btn-edit">Edit</a>
                                    <form method="POST" style="display:inline;" onsubmit="return confirm('Delete this question?');">
                                        <input type="hidden" name="delete_question_index" value="<?php echo $index; ?>">
                                        <button type="submit" class="action-btn btn-delete">Delete</button>
                                    </form>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                            
                            <?php if (empty($questions)): ?>
                            <tr>
                                <td colspan="5" style="text-align:center;">No questions found.</td>
                            </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
