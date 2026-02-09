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

// Handle Delete Question or FAQ
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_item_index'])) {
    $index = (int)$_POST['delete_item_index'];
    $type = isset($_POST['item_type']) ? $_POST['item_type'] : 'questions'; // 'questions' or 'faqs'
    
    // Fetch current data
    $stmt = $db->prepare("SELECT questions, faqs FROM subtitles WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result) {
        $items = json_decode($result[$type], true);
        if (!$items) $items = [];
        if (isset($items[$index])) {
            // Remove item
            array_splice($items, $index, 1);
            
            // Update DB
            $json = json_encode($items);
            $update = $db->prepare("UPDATE subtitles SET $type = :json WHERE id = :id");
            $update->bindParam(':json', $json);
            $update->bindParam(':id', $id);
            if ($update->execute()) {
                $success = ($type == 'questions' ? "Question" : "FAQ") . " deleted successfully";
            } else {
                $error = "Failed to delete item";
            }
        }
    }
}

// Update Subtitle
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_subtitle'])) {
    $name = isset($_POST['name']) ? $_POST['name'] : '';
    $order_num = isset($_POST['order_num']) ? $_POST['order_num'] : 0;
    $content = isset($_POST['content']) ? $_POST['content'] : '';

    $query = "UPDATE subtitles SET title = :name, order_num = :order_num, content = :content WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':order_num', $order_num);
    $stmt->bindParam(':content', $content);
    $stmt->bindParam(':id', $id);
    
    if ($stmt->execute()) {
        $success = "Subtitle updated successfully";
    } else {
        $error = "Failed to update subtitle";
    }
}

// Handle File Upload
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['upload_file'])) {
    $label = isset($_POST['label']) ? $_POST['label'] : '';
    $customName = isset($_POST['custom_name']) ? $_POST['custom_name'] : '';
    
    // Fetch current files
    $stmt = $db->prepare("SELECT files FROM subtitles WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $currentFiles = ($row && $row['files']) ? json_decode($row['files'], true) : [];
    if (!is_array($currentFiles)) $currentFiles = [];
    
    $uploadDir = '../uploads/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    if (isset($_FILES['document'])) {
        if ($_FILES['document']['error'] === UPLOAD_ERR_OK) {
            $filename = time() . '-' . basename($_FILES['document']['name']);
            $targetFile = $uploadDir . $filename;
            
            if (move_uploaded_file($_FILES['document']['tmp_name'], $targetFile)) {
                $newFile = [
                    'filename' => $filename,
                    'url' => '/uploads/' . $filename,
                    'mimetype' => $_FILES['document']['type'],
                    'size' => $_FILES['document']['size'],
                    'label' => $label,
                    'customName' => $customName
                ];
                
                $currentFiles[] = $newFile;
                
                $json = json_encode($currentFiles);
                $update = $db->prepare("UPDATE subtitles SET files = :files WHERE id = :id");
                $update->bindParam(':files', $json);
                $update->bindParam(':id', $id);
                
                if ($update->execute()) {
                    $success = "File uploaded successfully";
                } else {
                    $error = "Failed to update database with new file";
                }
            } else {
                $error = "Failed to move uploaded file. Check permissions for " . $uploadDir;
            }
        } else {
            $uploadErrors = [
                UPLOAD_ERR_INI_SIZE => 'The uploaded file exceeds the upload_max_filesize directive in php.ini',
                UPLOAD_ERR_FORM_SIZE => 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form',
                UPLOAD_ERR_PARTIAL => 'The uploaded file was only partially uploaded',
                UPLOAD_ERR_NO_FILE => 'No file was uploaded',
                UPLOAD_ERR_NO_TMP_DIR => 'Missing a temporary folder',
                UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
                UPLOAD_ERR_EXTENSION => 'A PHP extension stopped the file upload',
            ];
            $errorCode = $_FILES['document']['error'];
            $error = isset($uploadErrors[$errorCode]) ? $uploadErrors[$errorCode] : 'Unknown upload error (' . $errorCode . ')';
        }
    } else {
        $error = "No file selected or upload error (FILES array empty)";
    }
}

// Handle Delete File
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_file_index'])) {
    $index = (int)$_POST['delete_file_index'];
    
    $stmt = $db->prepare("SELECT files FROM subtitles WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $currentFiles = ($row && $row['files']) ? json_decode($row['files'], true) : [];
    
    if (isset($currentFiles[$index])) {
        // Optionally delete file from disk
        $fileToDelete = '../uploads/' . $currentFiles[$index]['filename'];
        if (file_exists($fileToDelete)) {
            unlink($fileToDelete);
        }
        
        array_splice($currentFiles, $index, 1);
        
        $json = json_encode($currentFiles);
        $update = $db->prepare("UPDATE subtitles SET files = :files WHERE id = :id");
        $update->bindParam(':files', $json);
        $update->bindParam(':id', $id);
        
        if ($update->execute()) {
            $success = "File deleted successfully";
        } else {
            $error = "Failed to delete file from database";
        }
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

$files = isset($subtitle['files']) ? json_decode($subtitle['files'], true) : [];
if (!$files) $files = [];

$faqs = isset($subtitle['faqs']) ? json_decode($subtitle['faqs'], true) : [];
if (!$faqs) $faqs = [];

$pageTitle = 'Manage Subtitle: ' . $subtitle['title'];
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
                    <h1 class="page-title"><?php echo htmlspecialchars($subtitle['title']); ?></h1>
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
                        
                        <div class="form-group">
                            <label class="form-label">Content</label>
                            <textarea name="content" class="form-control" rows="5" placeholder="Enter content description..."><?php echo htmlspecialchars(isset($subtitle['content']) ? $subtitle['content'] : ''); ?></textarea>
                        </div>

                        <div style="display: flex; gap: 20px;">
                            <div class="form-group" style="flex:1;">
                                <label class="form-label">Name</label>
                                <input type="text" name="name" class="form-control" required value="<?php echo htmlspecialchars($subtitle['title']); ?>">
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
                    <h2 class="page-title" style="font-size: 20px;">Documents</h2>
                </div>

                <div class="card" style="margin-bottom: 32px;">
                     <!-- Upload Form -->
                     <form method="POST" enctype="multipart/form-data" style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                        <input type="hidden" name="upload_file" value="1">
                        <div style="display: flex; gap: 20px; align-items: flex-end;">
                            <div class="form-group" style="flex: 2;">
                                <label class="form-label">Select File</label>
                                <input type="file" name="document" class="form-control" required>
                            </div>
                            <div class="form-group" style="flex: 2;">
                                <label class="form-label">Custom Name (Optional)</label>
                                <input type="text" name="custom_name" class="form-control" placeholder="Display Name">
                            </div>
                            <div class="form-group" style="flex: 1;">
                                <label class="form-label">Label (Optional)</label>
                                <input type="text" name="label" class="form-control" placeholder="e.g. Registration">
                            </div>
                            <button type="submit" class="btn btn-primary" style="margin-bottom: 15px;">Upload</button>
                        </div>
                    </form>

                    <!-- Files List -->
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Label</th>
                                <th>Type</th>
                                <th>Size</th>
                                <th style="width: 100px;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($files as $index => $file): ?>
                            <tr>
                                <td>
                                    <a href="<?php echo htmlspecialchars($file['url']); ?>" target="_blank">
                                        <?php echo htmlspecialchars(isset($file['customName']) && $file['customName'] ? $file['customName'] : $file['filename']); ?>
                                    </a>
                                </td>
                                <td><?php echo htmlspecialchars(isset($file['label']) ? $file['label'] : '-'); ?></td>
                                <td><?php echo htmlspecialchars(isset($file['mimetype']) ? $file['mimetype'] : '-'); ?></td>
                                <td><?php echo round((isset($file['size']) ? $file['size'] : 0) / 1024, 1); ?> KB</td>
                                <td>
                                    <form method="POST" style="display:inline;" onsubmit="return confirm('Delete this file?');">
                                        <input type="hidden" name="delete_file_index" value="<?php echo $index; ?>">
                                        <button type="submit" class="action-btn btn-delete">Delete</button>
                                    </form>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                            
                            <?php if (empty($files)): ?>
                            <tr>
                                <td colspan="5" style="text-align:center;">No documents uploaded.</td>
                            </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>

                <div class="page-header">
                    <h2 class="page-title" style="font-size: 20px;">Questions</h2>
                    <a href="question_form.php?subtitle_id=<?php echo $subtitle['id']; ?>" class="btn btn-primary">Add Question</a>
                </div>
                
                <div class="card" style="margin-bottom: 40px;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th style="width: 50px;">No.</th>
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
                                    <a href="question_form.php?subtitle_id=<?php echo $subtitle['id']; ?>&index=<?php echo $index; ?>&type=questions" class="action-btn btn-edit">Edit</a>
                                    <form method="POST" style="display:inline;" onsubmit="return confirm('Delete this question?');">
                                        <input type="hidden" name="delete_item_index" value="<?php echo $index; ?>">
                                        <input type="hidden" name="item_type" value="questions">
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

                <div class="page-header">
                    <h2 class="page-title" style="font-size: 20px;">Frequently Asked Questions (FAQs)</h2>
                    <a href="question_form.php?subtitle_id=<?php echo $subtitle['id']; ?>&type=faqs" class="btn btn-primary">Add FAQ</a>
                </div>
                
                <div class="card">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th style="width: 50px;">No.</th>
                                <th>Question</th>
                                <th>Answer</th>
                                <th style="width: 150px;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($faqs as $index => $f): ?>
                            <tr>
                                <td><?php echo $index + 1; ?></td>
                                <td><?php echo htmlspecialchars(substr(isset($f['question']) ? $f['question'] : '', 0, 100)) . (strlen(isset($f['question']) ? $f['question'] : '') > 100 ? '...' : ''); ?></td>
                                <td><?php echo htmlspecialchars(substr(isset($f['answer']) ? $f['answer'] : '', 0, 100)) . (strlen(isset($f['answer']) ? $f['answer'] : '') > 100 ? '...' : ''); ?></td>
                                <td>
                                    <a href="question_form.php?subtitle_id=<?php echo $subtitle['id']; ?>&index=<?php echo $index; ?>&type=faqs" class="action-btn btn-edit">Edit</a>
                                    <form method="POST" style="display:inline;" onsubmit="return confirm('Delete this FAQ?');">
                                        <input type="hidden" name="delete_item_index" value="<?php echo $index; ?>">
                                        <input type="hidden" name="item_type" value="faqs">
                                        <button type="submit" class="action-btn btn-delete">Delete</button>
                                    </form>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                            
                            <?php if (empty($faqs)): ?>
                            <tr>
                                <td colspan="4" style="text-align:center;">No FAQs found.</td>
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
