<?php
include_once __DIR__ . '/../lib/auth_middleware.php';

function getEmployees($db) {
     $query = "SELECT * FROM employees ORDER BY order_num ASC";
     $stmt = $db->prepare($query);
     $stmt->execute();
     $list = $stmt->fetchAll(PDO::FETCH_ASSOC);
     
     // Determine base URL
     $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
     $baseUrl = $protocol . $_SERVER['HTTP_HOST'];

     foreach ($list as &$item) { 
          $item['_id'] = $item['id']; 
          // Map photo_url to photo and ensure it is a full URL
          $photoPath = !empty($item['photo_url']) ? $item['photo_url'] : '';
          if (!empty($photoPath) && strpos($photoPath, 'http') !== 0) {
              if (strpos($photoPath, '/') !== 0) {
                  $photoPath = '/' . $photoPath;
              }
              $photoPath = $baseUrl . $photoPath;
          }
          $item['photo'] = $photoPath;
          $item['photo_url'] = $photoPath; // Update original field too just in case
      }
     echo json_encode($list);
 }

function getEmployeeById($db, $id) {
    $query = "SELECT * FROM employees WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($item) {
        $item['_id'] = $item['id'];
        $item['photo'] = $item['photo_url']; // Map photo_url to photo for frontend compatibility
        echo json_encode($item);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Employee not found']);
    }
}

function createEmployee($db) {
    authenticate();
    
    $name = isset($_POST['name']) ? $_POST['name'] : '';
    $email = isset($_POST['email']) ? $_POST['email'] : '';
    $position = isset($_POST['position']) ? $_POST['position'] : '';
    $department = isset($_POST['department']) ? $_POST['department'] : '';
    
    $photoUrl = null;
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] == 0) {
        $uploadDir = '../uploads/';
        $filename = time() . '-' . basename($_FILES['photo']['name']);
        $targetFile = $uploadDir . $filename;
        if (move_uploaded_file($_FILES['photo']['tmp_name'], $targetFile)) {
            $photoUrl = '/uploads/' . $filename;
        }
    }

    $query = "INSERT INTO employees (name, email, position, designation, department, phone, photo_url, address, bio, dob, join_date, manager, salary, is_advisor) VALUES (:name, :email, :position, :designation, :department, :phone, :photo_url, :address, :bio, :dob, :join_date, :manager, :salary, :is_advisor)";
    
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':position', $position);
    $designation = isset($_POST['designation']) ? $_POST['designation'] : '';
    $stmt->bindParam(':designation', $designation);
    $stmt->bindParam(':department', $department);
    $phone = isset($_POST['phone']) ? $_POST['phone'] : '';
    $stmt->bindParam(':phone', $phone);
    $stmt->bindParam(':photo_url', $photoUrl);
    $address = isset($_POST['address']) ? $_POST['address'] : '';
    $stmt->bindParam(':address', $address);
    $bio = isset($_POST['bio']) ? $_POST['bio'] : '';
    $stmt->bindParam(':bio', $bio);
    $dob = isset($_POST['dob']) ? $_POST['dob'] : null;
    $stmt->bindParam(':dob', $dob);
    $joinDate = isset($_POST['joinDate']) ? $_POST['joinDate'] : null;
    $stmt->bindParam(':join_date', $joinDate); 
    $manager = isset($_POST['manager']) ? $_POST['manager'] : '';
    $stmt->bindParam(':manager', $manager);
    $salary = isset($_POST['salary']) ? $_POST['salary'] : 0;
    $stmt->bindParam(':salary', $salary);
    
    $isAdvisor = isset($_POST['isAdvisor']) && ($_POST['isAdvisor'] === 'true' || $_POST['isAdvisor'] === '1') ? 1 : 0;
    $stmt->bindParam(':is_advisor', $isAdvisor);

    if ($stmt->execute()) {
        $id = $db->lastInsertId();
        getEmployeeById($db, $id);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to create employee']);
    }
}

function updateEmployee($db, $id) {
    authenticate();
    
    // We can use $_POST and $_FILES because we use POST with _method=PUT hack
    // Or if it was JSON, we parse input.
    
    $data = $_POST;
    if (empty($data) && empty($_FILES)) {
        // Maybe it's JSON?
        $input = json_decode(file_get_contents("php://input"), true);
        if ($input) $data = $input;
    }
    
    $query = "UPDATE employees SET 
        name = :name, 
        email = :email, 
        position = :position, 
        designation = :designation, 
        department = :department, 
        phone = :phone, 
        address = :address, 
        bio = :bio, 
        dob = :dob, 
        join_date = :join_date, 
        manager = :manager, 
        salary = :salary, 
        is_advisor = :is_advisor";
        
    // Handle photo update only if new photo is uploaded
    $photoUrl = null;
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] == 0) {
        $uploadDir = '../uploads/';
        $filename = time() . '-' . basename($_FILES['photo']['name']);
        $targetFile = $uploadDir . $filename;
        if (move_uploaded_file($_FILES['photo']['tmp_name'], $targetFile)) {
            $photoUrl = '/uploads/' . $filename;
            $query .= ", photo_url = :photo_url";
        }
    }
    
    $query .= " WHERE id = :id";
    
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':name', $data['name']);
    $stmt->bindParam(':email', $data['email']);
    $stmt->bindParam(':position', $data['position']);
    $stmt->bindParam(':designation', $data['designation']);
    $stmt->bindParam(':department', $data['department']);
    $stmt->bindParam(':phone', $data['phone']);
    $stmt->bindParam(':address', $data['address']);
    $stmt->bindParam(':bio', $data['bio']);
    $stmt->bindParam(':dob', $data['dob']);
    $stmt->bindParam(':join_date', $data['joinDate']);
    $stmt->bindParam(':manager', $data['manager']);
    $stmt->bindParam(':salary', $data['salary']);
    
    $isAdvisor = isset($data['isAdvisor']) && ($data['isAdvisor'] === 'true' || $data['isAdvisor'] === '1' || $data['isAdvisor'] === true) ? 1 : 0;
    $stmt->bindParam(':is_advisor', $isAdvisor);
    
    if ($photoUrl) {
        $stmt->bindParam(':photo_url', $photoUrl);
    }
    
    if ($stmt->execute()) {
        getEmployeeById($db, $id);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to update employee']);
    }
}

function deleteEmployee($db, $id) {
    authenticate();
    $query = "DELETE FROM employees WHERE id = :id";
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
