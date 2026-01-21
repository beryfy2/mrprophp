<?php
include_once __DIR__ . '/../lib/auth_middleware.php';

function getJobs($db) {
    $query = "SELECT * FROM jobs ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $list = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Decode JSON fields
    foreach ($list as &$item) {
        $item['_id'] = $item['id'];
        if ($item['responsibilities']) $item['responsibilities'] = json_decode($item['responsibilities'], true);
        if ($item['qualifications']) $item['qualifications'] = json_decode($item['qualifications'], true);
    }
    
    echo json_encode($list);
}

function createJob($db) {
    authenticate();
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) $data = $_POST;

    $title = isset($data['title']) ? $data['title'] : '';
    $description = isset($data['description']) ? $data['description'] : '';
    $type = isset($data['type']) ? $data['type'] : '';
    $experience = isset($data['experience']) ? $data['experience'] : '';
    $urgent = isset($data['urgent']) && $data['urgent'] ? 1 : 0;
    $experienceLevel = isset($data['experienceLevel']) ? $data['experienceLevel'] : '';
    $location = isset($data['location']) ? $data['location'] : '';
    
    $responsibilities = isset($data['responsibilities']) ? json_encode($data['responsibilities']) : null;
    $qualifications = isset($data['qualifications']) ? json_encode($data['qualifications']) : null;

    $query = "INSERT INTO jobs (title, description, type, experience, urgent, experience_level, location, responsibilities, qualifications) VALUES (:title, :description, :type, :experience, :urgent, :experienceLevel, :location, :responsibilities, :qualifications)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':type', $type);
    $stmt->bindParam(':experience', $experience);
    $stmt->bindParam(':urgent', $urgent);
    $stmt->bindParam(':experienceLevel', $experienceLevel);
    $stmt->bindParam(':location', $location);
    $stmt->bindParam(':responsibilities', $responsibilities);
    $stmt->bindParam(':qualifications', $qualifications);

    if ($stmt->execute()) {
        $id = $db->lastInsertId();
        $q = "SELECT * FROM jobs WHERE id = :id";
        $s = $db->prepare($q);
        $s->bindParam(':id', $id);
        $s->execute();
        $job = $s->fetch(PDO::FETCH_ASSOC);
        if ($job['responsibilities']) $job['responsibilities'] = json_decode($job['responsibilities'], true);
        if ($job['qualifications']) $job['qualifications'] = json_decode($job['qualifications'], true);
        echo json_encode($job);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to create job']);
    }
}

function updateJob($db, $id) {
    authenticate();
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) $data = $_POST;

    $fields = [];
    if (isset($data['title'])) $fields[] = 'title = :title';
    if (isset($data['description'])) $fields[] = 'description = :description';
    if (isset($data['type'])) $fields[] = 'type = :type';
    if (isset($data['experience'])) $fields[] = 'experience = :experience';
    if (isset($data['urgent'])) $fields[] = 'urgent = :urgent';
    if (isset($data['experienceLevel'])) $fields[] = 'experience_level = :experienceLevel';
    if (isset($data['location'])) $fields[] = 'location = :location';
    if (isset($data['responsibilities'])) $fields[] = 'responsibilities = :responsibilities';
    if (isset($data['qualifications'])) $fields[] = 'qualifications = :qualifications';

    if (empty($fields)) {
         // Return current
         $q = "SELECT * FROM jobs WHERE id = :id";
         $s = $db->prepare($q);
         $s->bindParam(':id', $id);
         $s->execute();
         $job = $s->fetch(PDO::FETCH_ASSOC);
         if ($job) {
             if ($job['responsibilities']) $job['responsibilities'] = json_decode($job['responsibilities'], true);
             if ($job['qualifications']) $job['qualifications'] = json_decode($job['qualifications'], true);
             echo json_encode($job);
         } else {
             http_response_code(404);
             echo json_encode(['error' => 'Not found']);
         }
         return;
    }

    $query = "UPDATE jobs SET " . implode(', ', $fields) . " WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);

    if (isset($data['title'])) $stmt->bindParam(':title', $data['title']);
    if (isset($data['description'])) $stmt->bindParam(':description', $data['description']);
    if (isset($data['type'])) $stmt->bindParam(':type', $data['type']);
    if (isset($data['experience'])) $stmt->bindParam(':experience', $data['experience']);
    if (isset($data['urgent'])) {
        $urgent = $data['urgent'] ? 1 : 0;
        $stmt->bindParam(':urgent', $urgent);
    }
    if (isset($data['experienceLevel'])) $stmt->bindParam(':experienceLevel', $data['experienceLevel']);
    if (isset($data['location'])) $stmt->bindParam(':location', $data['location']);
    if (isset($data['responsibilities'])) {
        $resp = json_encode($data['responsibilities']);
        $stmt->bindParam(':responsibilities', $resp);
    }
    if (isset($data['qualifications'])) {
        $qual = json_encode($data['qualifications']);
        $stmt->bindParam(':qualifications', $qual);
    }

    if ($stmt->execute()) {
        $q = "SELECT * FROM jobs WHERE id = :id";
        $s = $db->prepare($q);
        $s->bindParam(':id', $id);
        $s->execute();
        $job = $s->fetch(PDO::FETCH_ASSOC);
        if ($job['responsibilities']) $job['responsibilities'] = json_decode($job['responsibilities'], true);
        if ($job['qualifications']) $job['qualifications'] = json_decode($job['qualifications'], true);
        echo json_encode($job);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to update job']);
    }
}

function deleteJob($db, $id) {
    authenticate();
    $query = "DELETE FROM jobs WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    if ($stmt->execute()) {
        echo json_encode(['ok' => true]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to delete job']);
    }
}
?>
