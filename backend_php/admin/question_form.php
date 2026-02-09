<?php
include_once 'includes/db.php';
requireLogin();

$db = getDB();
$subtitle_id = isset($_GET['subtitle_id']) ? $_GET['subtitle_id'] : null;
$index = isset($_GET['index']) ? (int)$_GET['index'] : null;
$type = isset($_GET['type']) ? $_GET['type'] : 'questions'; // 'questions' or 'faqs'

if (!$subtitle_id) {
    header('Location: nav_items.php');
    exit();
}

// Fetch Subtitle
$stmt = $db->prepare("SELECT * FROM subtitles WHERE id = :id");
$stmt->bindParam(':id', $subtitle_id);
$stmt->execute();
$subtitle = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$subtitle) {
    header('Location: nav_items.php');
    exit();
}

$questions = isset($subtitle[$type]) ? json_decode($subtitle[$type], true) : [];
if (!$questions) $questions = [];
$question = null;

if ($index !== null && isset($questions[$index])) {
    $question = $questions[$index];
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // $q_number = isset($_POST['q_number']) ? $_POST['q_number'] : ''; // Removed manual order
    $q_text = isset($_POST['question']) ? $_POST['question'] : '';
    $a_text = isset($_POST['answer']) ? $_POST['answer'] : '';
    $format = isset($_POST['format']) ? $_POST['format'] : 'written';
    
    // Parse Table
    $table = [
        'headers' => [],
        'rows' => []
    ];
    
    if ($format === 'table' || $format === 'both') {
        $headers_str = isset($_POST['table_headers']) ? $_POST['table_headers'] : '';
        if (trim($headers_str)) {
            $table['headers'] = array_map('trim', explode(',', $headers_str));
        }
        
        $rows_str = isset($_POST['table_rows']) ? $_POST['table_rows'] : '';
        if (trim($rows_str)) {
            $lines = explode("\n", $rows_str);
            foreach ($lines as $line) {
                if (trim($line)) {
                    $table['rows'][] = array_map('trim', explode('|', $line));
                }
            }
        }
    }
    
    $newQuestion = [
        // 'q_number' => $q_number,
        'question' => $q_text,
        'answer' => $a_text,
        'format' => $format,
        'table' => $table,
        'files' => isset($question['files']) ? $question['files'] : [] // Preserve existing files for now
    ];
    
    if ($index !== null) {
        $questions[$index] = $newQuestion;
    } else {
        $questions[] = $newQuestion;
    }
    
    $json = json_encode($questions);
    $update = $db->prepare("UPDATE subtitles SET $type = :json WHERE id = :id");
    $update->bindParam(':json', $json);
    $update->bindParam(':id', $subtitle_id);
    
    if ($update->execute()) {
        header('Location: subtitle_detail.php?id=' . $subtitle_id);
        exit();
    } else {
        $error = "Database error";
    }
}

$pageTitle = ($index !== null ? 'Edit ' . ($type === 'faqs' ? 'FAQ' : 'Question') : 'Add ' . ($type === 'faqs' ? 'FAQ' : 'Question')) . ' - ' . $subtitle['title'];

// Prepare table data for form
$table_headers = '';
$table_rows = '';
if ($question && isset($question['table'])) {
    if (isset($question['table']['headers']) && is_array($question['table']['headers'])) {
        $table_headers = implode(', ', $question['table']['headers']);
    }
    if (isset($question['table']['rows']) && is_array($question['table']['rows'])) {
        $rows_txt = [];
        foreach ($question['table']['rows'] as $r) {
            if (is_array($r)) {
                $rows_txt[] = implode(' | ', $r);
            }
        }
        $table_rows = implode("\n", $rows_txt);
    }
}
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
                    <a href="subtitle_detail.php?id=<?php echo $subtitle_id; ?>" class="btn btn-secondary">Back</a>
                </div>
                
                <div class="card">
                    <?php if ($error): ?>
                        <div class="alert alert-danger"><?php echo $error; ?></div>
                    <?php endif; ?>
                    
                    <form method="POST">
                        <div class="form-group">
                            <label>Question</label>
                            <textarea name="question" class="form-control" rows="3" required><?php echo htmlspecialchars(isset($question['question']) ? $question['question'] : ''); ?></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>Answer</label>
                            <textarea name="answer" class="form-control" rows="5"><?php echo htmlspecialchars(isset($question['answer']) ? $question['answer'] : ''); ?></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>Format</label>
                            <select name="format" class="form-control" id="formatSelect">
                                <option value="written" <?php echo ($question && (isset($question['format']) ? $question['format'] : '') == 'written') ? 'selected' : ''; ?>>Written</option>
                                <option value="table" <?php echo ($question && (isset($question['format']) ? $question['format'] : '') == 'table') ? 'selected' : ''; ?>>Table</option>
                                <option value="both" <?php echo ($question && (isset($question['format']) ? $question['format'] : '') == 'both') ? 'selected' : ''; ?>>Both</option>
                            </select>
                        </div>
                        
                        <div id="tableFields" style="display: none; background: #f9f9f9; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                            <h3 style="margin-top: 0; font-size: 16px;">Table Data</h3>
                            <div class="form-group">
                                <label>Headers (comma separated)</label>
                                <input type="text" name="table_headers" class="form-control" value="<?php echo htmlspecialchars($table_headers); ?>" placeholder="Column 1, Column 2, Column 3">
                            </div>
                            
                            <div class="form-group">
                                <label>Rows (one per line, columns separated by |)</label>
                                <textarea name="table_rows" class="form-control" rows="5" placeholder="Value 1 | Value 2 | Value 3&#10;Value A | Value B | Value C"><?php echo htmlspecialchars($table_rows); ?></textarea>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Files</label>
                            <p class="text-muted">File upload management coming soon. Existing files are preserved.</p>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">Save Question</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script>
        const formatSelect = document.getElementById('formatSelect');
        const tableFields = document.getElementById('tableFields');

        function toggleTableFields() {
            if (formatSelect.value === 'table' || formatSelect.value === 'both') {
                tableFields.style.display = 'block';
            } else {
                tableFields.style.display = 'none';
            }
        }

        formatSelect.addEventListener('change', toggleTableFields);
        toggleTableFields(); // Init
    </script>
</body>
</html>
