<?php
include_once __DIR__ . '/../lib/auth_middleware.php';

function getWorks($db) {
    $query = "SELECT * FROM works ORDER BY date DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $list = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Determine base URL
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
    $baseUrl = $protocol . $_SERVER['HTTP_HOST'];

    // Map id to _id and normalize photo URL
    $mappedList = array_map(function($item) use ($baseUrl) {
        $item['_id'] = $item['id'];

        if (!empty($item['photo']) && strpos($item['photo'], 'http') !== 0) {
            $photoPath = $item['photo'];

            // If path contains "uploads", keep from there
            $uploadsPos = strpos($photoPath, 'uploads/');
            if ($uploadsPos !== false) {
                $photoPath = substr($photoPath, $uploadsPos);
            }

            if (strpos($photoPath, '/') !== 0) {
                $photoPath = '/' . $photoPath;
            }

            $item['photo'] = $baseUrl . $photoPath;
        }

        return $item;
    }, $list);
    
    echo json_encode($mappedList);
}

function getWorkById($db, $id) {
    $query = "SELECT * FROM works WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($item) {
        $item['_id'] = $item['id'];

        // Normalize Photo URL
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        $baseUrl = $protocol . $_SERVER['HTTP_HOST'];
        
        if (!empty($item['photo']) && strpos($item['photo'], 'http') !== 0) {
            $photoPath = $item['photo'];

            $uploadsPos = strpos($photoPath, 'uploads/');
            if ($uploadsPos !== false) {
                $photoPath = substr($photoPath, $uploadsPos);
            }

            if (strpos($photoPath, '/') !== 0) {
                $photoPath = '/' . $photoPath;
            }

            $item['photo'] = $baseUrl . $photoPath;
        }

        echo json_encode($item);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
    }
}

function createWork($db) {
    authenticate();
    
    $title = isset($_POST['title']) ? $_POST['title'] : '';
    $content = isset($_POST['content']) ? $_POST['content'] : '';
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
        echo json_encode(['error' => 'Photo is required']);
        exit();
    }

    $query = "INSERT INTO works (title, content, photo, date) VALUES (:title, :content, :photo, :date)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':content', $content);
    $stmt->bindParam(':photo', $photoUrl);
    $stmt->bindParam(':date', $date);

    if ($stmt->execute()) {
        $id = $db->lastInsertId();
        getWorkById($db, $id);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to create work']);
    }
}

function updateWork($db, $id) {
    authenticate();
    $data = $_POST;
    if (empty($data) && empty($_FILES)) {
        $input = json_decode(file_get_contents("php://input"), true);
        if ($input) $data = $input;
    }

    $query = "UPDATE works SET title = :title, content = :content, date = :date";
    
    $photoUrl = null;
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] == 0) {
        $uploadDir = '../uploads/';
        $filename = time() . '-' . preg_replace('/[^a-zA-Z0-9._-]/', '_', basename($_FILES['photo']['name']));
        $targetFile = $uploadDir . $filename;
        if (move_uploaded_file($_FILES['photo']['tmp_name'], $targetFile)) {
            $photoUrl = '/uploads/' . $filename;
            $query .= ", photo = :photo";
        }
    }

    $query .= " WHERE id = :id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':title', $data['title']);
    $stmt->bindParam(':content', $data['content']);
    $stmt->bindParam(':date', $data['date']);
    
    if ($photoUrl) {
        $stmt->bindParam(':photo', $photoUrl);
    }

    if ($stmt->execute()) {
        getWorkById($db, $id);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to update']);
    }
}

function deleteWork($db, $id) {
    authenticate();
    $query = "DELETE FROM works WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    if ($stmt->execute()) {
        echo json_encode(['ok' => true]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to delete']);
    }
}
?>
