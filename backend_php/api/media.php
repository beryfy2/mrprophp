<?php
include_once '../lib/auth_middleware.php';

function getMedia($db) {
    authenticate(); // Admin only
    $query = "SELECT * FROM media ORDER BY date DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $list = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($list);
}

function getPublicMedia($db) {
    // Public endpoint
    $query = "SELECT * FROM media ORDER BY date DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $list = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($list);
}

function getMediaById($db, $id) {
    $query = "SELECT * FROM media WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($item) {
        echo json_encode($item);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
    }
}

function createMedia($db) {
    authenticate();
    
    $publication = isset($_POST['publication']) ? $_POST['publication'] : '';
    $title = isset($_POST['title']) ? $_POST['title'] : '';
    $content = isset($_POST['content']) ? $_POST['content'] : '';
    $link = isset($_POST['link']) ? $_POST['link'] : '';
    $date = isset($_POST['date']) ? $_POST['date'] : date('Y-m-d H:i:s');
    
    $photoUrl = '';
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] == 0) {
        $uploadDir = '../uploads/';
        $filename = time() . '-' . basename($_FILES['photo']['name']);
        $targetFile = $uploadDir . $filename;
        if (move_uploaded_file($_FILES['photo']['tmp_name'], $targetFile)) {
            $photoUrl = '/uploads/' . $filename;
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Photo/Logo is required']);
        exit();
    }

    $query = "INSERT INTO media (publication, title, content, link, photo, date) VALUES (:publication, :title, :content, :link, :photo, :date)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':publication', $publication);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':content', $content);
    $stmt->bindParam(':link', $link);
    $stmt->bindParam(':photo', $photoUrl);
    $stmt->bindParam(':date', $date);

    if ($stmt->execute()) {
        $id = $db->lastInsertId();
        getMediaById($db, $id);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to create media item']);
    }
}

function updateMedia($db, $id) {
    authenticate();
    
    $data = $_POST;
    if (empty($data) && empty($_FILES)) {
        $input = json_decode(file_get_contents("php://input"), true);
        if ($input) $data = $input;
    }

    $query = "UPDATE media SET publication = :publication, title = :title, content = :content, link = :link, date = :date";
    
    $photoUrl = null;
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] == 0) {
        $uploadDir = '../uploads/';
        $filename = time() . '-' . basename($_FILES['photo']['name']);
        $targetFile = $uploadDir . $filename;
        if (move_uploaded_file($_FILES['photo']['tmp_name'], $targetFile)) {
            $photoUrl = '/uploads/' . $filename;
            $query .= ", photo = :photo";
        }
    }

    $query .= " WHERE id = :id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':publication', $data['publication']);
    $stmt->bindParam(':title', $data['title']);
    $stmt->bindParam(':content', $data['content']);
    $stmt->bindParam(':link', $data['link']);
    $stmt->bindParam(':date', $data['date']);
    
    if ($photoUrl) {
        $stmt->bindParam(':photo', $photoUrl);
    }

    if ($stmt->execute()) {
        getMediaById($db, $id);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to update media item']);
    }
}

function deleteMedia($db, $id) {
    authenticate();
    $query = "DELETE FROM media WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    if ($stmt->execute()) {
        echo json_encode(['ok' => true]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to delete media item']);
    }
}
?>
