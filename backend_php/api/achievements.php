<?php
include_once __DIR__ . '/../lib/auth_middleware.php';

function getAchievements($db) {
    // Public? Node server: app.get('/api/achievements', ...) is public?
    // Snippet showed it under ADMIN comment but didn't have `auth` middleware on GET.
    // Assuming public GET, auth POST/PUT/DELETE.
    
    $query = "SELECT * FROM achievements ORDER BY date DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $list = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Determine base URL
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
    $baseUrl = $protocol . $_SERVER['HTTP_HOST'];

    $mappedList = array_map(function($item) use ($baseUrl) {
         $item['_id'] = $item['id'];
         if (!empty($item['photo']) && strpos($item['photo'], 'http') !== 0) {
             $photoPath = $item['photo'];
             if (strpos($photoPath, '/') !== 0) {
                 $photoPath = '/' . $photoPath;
             }
             $item['photo'] = $baseUrl . $photoPath;
         }
         return $item;
     }, $list);

    echo json_encode($mappedList);
}

function getAchievementById($db, $id) {
    $query = "SELECT * FROM achievements WHERE id = :id";
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

function createAchievement($db) {
    authenticate();
    
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
        echo json_encode(['error' => 'Photo is required']);
        exit();
    }

    $query = "INSERT INTO achievements (title, content, link, photo, date) VALUES (:title, :content, :link, :photo, :date)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':content', $content);
    $stmt->bindParam(':link', $link);
    $stmt->bindParam(':photo', $photoUrl);
    $stmt->bindParam(':date', $date);

    if ($stmt->execute()) {
        $id = $db->lastInsertId();
        getAchievementById($db, $id);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to create achievement']);
    }
}

function updateAchievement($db, $id) {
    authenticate();
    $data = $_POST;
    if (empty($data) && empty($_FILES)) {
        $input = json_decode(file_get_contents("php://input"), true);
        if ($input) $data = $input;
    }

    $query = "UPDATE achievements SET title = :title, content = :content, link = :link, date = :date";
    
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
    $stmt->bindParam(':title', $data['title']);
    $stmt->bindParam(':content', $data['content']);
    $stmt->bindParam(':link', $data['link']);
    $stmt->bindParam(':date', $data['date']);
    
    if ($photoUrl) {
        $stmt->bindParam(':photo', $photoUrl);
    }

    if ($stmt->execute()) {
        getAchievementById($db, $id);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to update']);
    }
}

function deleteAchievement($db, $id) {
    authenticate();
    $query = "DELETE FROM achievements WHERE id = :id";
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
