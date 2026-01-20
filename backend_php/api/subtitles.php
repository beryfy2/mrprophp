<?php
include_once '../lib/auth_middleware.php';

function getSubtitleById($db, $id) {
    $query = "SELECT * FROM subtitles WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($item) {
        $item['_id'] = $item['id'];
        if ($item['files']) $item['files'] = json_decode($item['files'], true);
        if ($item['questions']) $item['questions'] = json_decode($item['questions'], true);
        if ($item['faqs']) $item['faqs'] = json_decode($item['faqs'], true);
        echo json_encode($item);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
    }
}

function updateSubtitle($db, $id) {
    authenticate();
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) $data = $_POST;

    $title = isset($data['title']) ? $data['title'] : '';
    $content = isset($data['content']) ? $data['content'] : '';
    $price = isset($data['price']) ? $data['price'] : '';
    
    // If partial update, we need to be careful.
    // Assuming full update for simplicity or check keys.
    // For now, assume provided keys are updated, or standard CRUD.
    
    $files = isset($data['files']) ? json_encode($data['files']) : null;
    $questions = isset($data['questions']) ? json_encode($data['questions']) : null;
    $faqs = isset($data['faqs']) ? json_encode($data['faqs']) : null;

    // Build dynamic query
    $fields = [];
    if (isset($data['title'])) $fields[] = 'title = :title';
    if (isset($data['content'])) $fields[] = 'content = :content';
    if (isset($data['price'])) $fields[] = 'price = :price';
    if (isset($data['files'])) $fields[] = 'files = :files';
    if (isset($data['questions'])) $fields[] = 'questions = :questions';
    if (isset($data['faqs'])) $fields[] = 'faqs = :faqs';

    if (empty($fields)) {
         getSubtitleById($db, $id);
         return;
    }

    $query = "UPDATE subtitles SET " . implode(', ', $fields) . " WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    
    if (isset($data['title'])) $stmt->bindParam(':title', $title);
    if (isset($data['content'])) $stmt->bindParam(':content', $content);
    if (isset($data['price'])) $stmt->bindParam(':price', $price);
    if (isset($data['files'])) $stmt->bindParam(':files', $files);
    if (isset($data['questions'])) $stmt->bindParam(':questions', $questions);
    if (isset($data['faqs'])) $stmt->bindParam(':faqs', $faqs);

    if ($stmt->execute()) {
        getSubtitleById($db, $id);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to update subtitle']);
    }
}

function deleteSubtitle($db, $id) {
    authenticate();
    $query = "DELETE FROM subtitles WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    if ($stmt->execute()) {
        echo json_encode(['ok' => true]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to delete subtitle']);
    }
}

function slugifyTitle($text) {
    $text = preg_replace('~[^\pL\d]+~u', '-', $text);
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
    $text = preg_replace('~[^-\w]+~', '', $text);
    $text = trim($text, '-');
    $text = preg_replace('~-+~', '-', $text);
    $text = strtolower($text);
    return $text;
}

function getSubtitleBySlug($db, $slug) {
    // The node version iterates all subtitles and matches slugified title variants.
    // This is inefficient but let's replicate logic for compatibility.
    // slugVariants logic:
    // base = slug
    // reg = slug + "-registration"
    // alt = slug without "-company" + "-registration"
    
    $variants = [$slug, $slug . '-registration', str_replace('-company', '', $slug) . '-registration'];
    
    $query = "SELECT * FROM subtitles ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $list = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($list as $item) {
        $st = slugifyTitle($item['title']);
        if (in_array($st, $variants)) {
            if ($item['files']) $item['files'] = json_decode($item['files'], true);
            if ($item['questions']) $item['questions'] = json_decode($item['questions'], true);
            if ($item['faqs']) $item['faqs'] = json_decode($item['faqs'], true);
            echo json_encode($item);
            return;
        }
    }
    
    http_response_code(404);
    echo json_encode(['error' => 'Not found']);
}

// Handling file uploads for subtitles/questions
// This requires complex array manipulation in JSON.
// Ideally, we fetch, decode, modify, encode, save.
function uploadSubtitleFiles($db, $id) {
    authenticate();
    
    // Fetch current
    $query = "SELECT files FROM subtitles WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
        return;
    }
    
    $currentFiles = $row['files'] ? json_decode($row['files'], true) : [];
    
    $label = isset($_POST['label']) ? $_POST['label'] : null;
    
    $uploadedFiles = [];
    if (isset($_FILES['files'])) {
        $uploadDir = '../uploads/';
        // Handle multiple files
        $count = count($_FILES['files']['name']);
        for ($i = 0; $i < $count; $i++) {
            if ($_FILES['files']['error'][$i] == 0) {
                $filename = time() . '-' . basename($_FILES['files']['name'][$i]);
                $targetFile = $uploadDir . $filename;
                if (move_uploaded_file($_FILES['files']['tmp_name'][$i], $targetFile)) {
                    $key = "customName_$i";
                    $cn = isset($_POST[$key]) ? $_POST[$key] : null;
                    $uploadedFiles[] = [
                        'filename' => $filename,
                        'url' => '/uploads/' . $filename,
                        'mimetype' => $_FILES['files']['type'][$i],
                        'size' => $_FILES['files']['size'][$i],
                        'label' => $label,
                        'customName' => $cn
                    ];
                }
            }
        }
    }
    
    $newFiles = array_merge($currentFiles, $uploadedFiles);
    
    $updateQuery = "UPDATE subtitles SET files = :files WHERE id = :id";
    $uStmt = $db->prepare($updateQuery);
    $jsonFiles = json_encode($newFiles);
    $uStmt->bindParam(':files', $jsonFiles);
    $uStmt->bindParam(':id', $id);
    
    if ($uStmt->execute()) {
        getSubtitleById($db, $id);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to upload files']);
    }
}

function deleteSubtitleFile($db, $id, $fileId) {
    authenticate();
    
    $query = "SELECT files FROM subtitles WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$row) {
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
        return;
    }
    
    $files = $row['files'] ? json_decode($row['files'], true) : [];
    $newFiles = [];
    foreach ($files as $f) {
         if ((isset($f['_id']) && $f['_id'] == $fileId) || (isset($f['id']) && $f['id'] == $fileId)) {
             // found, skip to delete
         } else {
             $newFiles[] = $f;
         }
    }
    
    $updateQuery = "UPDATE subtitles SET files = :files WHERE id = :id";
    $uStmt = $db->prepare($updateQuery);
    $jsonFiles = json_encode($newFiles);
    $uStmt->bindParam(':files', $jsonFiles);
    $uStmt->bindParam(':id', $id);
    
    if ($uStmt->execute()) {
        getSubtitleById($db, $id);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to delete file']);
    }
}

function deleteSubtitleFileLegacy($db, $id) {
    authenticate();
    $filename = isset($_GET['filename']) ? $_GET['filename'] : null;
    $url = isset($_GET['url']) ? $_GET['url'] : null;
    $customName = isset($_GET['customName']) ? $_GET['customName'] : null;
    $label = isset($_GET['label']) ? $_GET['label'] : null;
    
    if (!$filename && !$url && !$customName && !$label) {
        http_response_code(400);
        echo json_encode(['error' => 'filename, url, customName or label required']);
        return;
    }

    $query = "SELECT files FROM subtitles WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$row) {
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
        return;
    }
    
    $files = $row['files'] ? json_decode($row['files'], true) : [];
    $newFiles = [];
    
    foreach ($files as $f) {
        $match = false;
        if ($filename && isset($f['filename']) && $f['filename'] == $filename) $match = true;
        if ($url && isset($f['url']) && $f['url'] == $url) $match = true;
        if ($customName && isset($f['customName']) && $f['customName'] == $customName) $match = true;
        if ($label && isset($f['label']) && $f['label'] == $label) $match = true;
        
        if (!$match) {
            $newFiles[] = $f;
        }
    }
    
    $updateQuery = "UPDATE subtitles SET files = :files WHERE id = :id";
    $uStmt = $db->prepare($updateQuery);
    $jsonFiles = json_encode($newFiles);
    $uStmt->bindParam(':files', $jsonFiles);
    $uStmt->bindParam(':id', $id);
    
    if ($uStmt->execute()) {
        getSubtitleById($db, $id);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to delete file']);
    }
}

function uploadQuestionFiles($db, $id, $qIdx) {
    authenticate();
    
    $query = "SELECT questions FROM subtitles WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
        return;
    }
    
    $questions = $row['questions'] ? json_decode($row['questions'], true) : [];
    
    if (!isset($questions[$qIdx])) {
        http_response_code(400);
        echo json_encode(['error' => 'Question index not found']);
        return;
    }
    
    $uploadedFiles = [];
    if (isset($_FILES['files'])) {
        $uploadDir = '../uploads/';
        $count = is_array($_FILES['files']['name']) ? count($_FILES['files']['name']) : 0;
        
        for ($i = 0; $i < $count; $i++) {
            if ($_FILES['files']['error'][$i] == 0) {
                $filename = time() . '-' . rand(1000,9999) . '-' . basename($_FILES['files']['name'][$i]);
                $targetFile = $uploadDir . $filename;
                if (move_uploaded_file($_FILES['files']['tmp_name'][$i], $targetFile)) {
                    $uploadedFiles[] = [
                        '_id' => uniqid(),
                        'filename' => $filename,
                        'url' => '/uploads/' . $filename,
                        'mimetype' => $_FILES['files']['type'][$i],
                        'size' => $_FILES['files']['size'][$i]
                    ];
                }
            }
        }
    }
    
    if (!isset($questions[$qIdx]['files'])) {
        $questions[$qIdx]['files'] = [];
    }
    
    $questions[$qIdx]['files'] = array_merge($questions[$qIdx]['files'], $uploadedFiles);
    
    $updateQuery = "UPDATE subtitles SET questions = :questions WHERE id = :id";
    $uStmt = $db->prepare($updateQuery);
    $jsonQuestions = json_encode($questions);
    $uStmt->bindParam(':questions', $jsonQuestions);
    $uStmt->bindParam(':id', $id);
    
    if ($uStmt->execute()) {
        getSubtitleById($db, $id);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to upload question files']);
    }
}

function deleteQuestionFile($db, $id, $qIdx, $fileId) {
    authenticate();
    
    $query = "SELECT questions FROM subtitles WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$row) {
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
        return;
    }
    
    $questions = $row['questions'] ? json_decode($row['questions'], true) : [];
    
    if (!isset($questions[$qIdx]) || !isset($questions[$qIdx]['files'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Question or files not found']);
        return;
    }
    
    $files = $questions[$qIdx]['files'];
    $newFiles = [];
    foreach ($files as $f) {
        if ((isset($f['_id']) && $f['_id'] == $fileId) || (isset($f['id']) && $f['id'] == $fileId)) {
            // delete
        } else {
            $newFiles[] = $f;
        }
    }
    
    $questions[$qIdx]['files'] = $newFiles;
    
    $updateQuery = "UPDATE subtitles SET questions = :questions WHERE id = :id";
    $uStmt = $db->prepare($updateQuery);
    $jsonQuestions = json_encode($questions);
    $uStmt->bindParam(':questions', $jsonQuestions);
    $uStmt->bindParam(':id', $id);
    
    if ($uStmt->execute()) {
        getSubtitleById($db, $id);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to delete file']);
    }
}
?>
