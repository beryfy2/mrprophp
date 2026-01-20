<?php
include_once '../lib/auth_middleware.php';

function getTitleById($db, $id) {
    $query = "SELECT * FROM titles WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($item) {
        $item['_id'] = $item['id'];
        echo json_encode($item);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
    }
}

function updateTitle($db, $id) {
    authenticate();
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) $data = $_POST;

    $title = isset($data['title']) ? $data['title'] : '';
    $content = isset($data['content']) ? $data['content'] : '';
    $order = isset($data['order']) ? $data['order'] : 0;
    // nav_item_id usually not changed here, but could be.

    $query = "UPDATE titles SET title = :title, content = :content, order_num = :order WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':content', $content);
    $stmt->bindParam(':order', $order);

    if ($stmt->execute()) {
        $q = "SELECT * FROM titles WHERE id = :id";
        $s = $db->prepare($q);
        $s->bindParam(':id', $id);
        $s->execute();
        echo json_encode($s->fetch(PDO::FETCH_ASSOC));
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to update title']);
    }
}

function deleteTitle($db, $id) {
    authenticate();
    $query = "DELETE FROM titles WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    if ($stmt->execute()) {
        echo json_encode(['ok' => true]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to delete title']);
    }
}

// Subtitles relative to Title
function getSubtitlesByTitle($db, $titleId) {
    $query = "SELECT * FROM subtitles WHERE parent_title_id = :titleId ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':titleId', $titleId);
    $stmt->execute();
    $list = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Parse JSON fields
    foreach ($list as &$item) {
        if ($item['files']) $item['files'] = json_decode($item['files'], true);
        if ($item['questions']) $item['questions'] = json_decode($item['questions'], true);
        if ($item['faqs']) $item['faqs'] = json_decode($item['faqs'], true);
    }
    
    echo json_encode($list);
}

function createSubtitleForTitle($db, $titleId) {
    authenticate();
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) $data = $_POST;

    $title = isset($data['title']) ? $data['title'] : '';
    $content = isset($data['content']) ? $data['content'] : '';
    $price = isset($data['price']) ? $data['price'] : '';
    // files, questions, faqs are JSON
    $files = isset($data['files']) ? json_encode($data['files']) : null;
    $questions = isset($data['questions']) ? json_encode($data['questions']) : null;
    $faqs = isset($data['faqs']) ? json_encode($data['faqs']) : null;

    $query = "INSERT INTO subtitles (parent_title_id, title, content, price, files, questions, faqs) VALUES (:titleId, :title, :content, :price, :files, :questions, :faqs)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':titleId', $titleId);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':content', $content);
    $stmt->bindParam(':price', $price);
    $stmt->bindParam(':files', $files);
    $stmt->bindParam(':questions', $questions);
    $stmt->bindParam(':faqs', $faqs);

    if ($stmt->execute()) {
        $id = $db->lastInsertId();
        $q = "SELECT * FROM subtitles WHERE id = :id";
        $s = $db->prepare($q);
        $s->bindParam(':id', $id);
        $s->execute();
        $sub = $s->fetch(PDO::FETCH_ASSOC);
        // Decode for response
        if ($sub['files']) $sub['files'] = json_decode($sub['files'], true);
        if ($sub['questions']) $sub['questions'] = json_decode($sub['questions'], true);
        if ($sub['faqs']) $sub['faqs'] = json_decode($sub['faqs'], true);
        
        echo json_encode($sub);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to create subtitle']);
    }
}
?>
