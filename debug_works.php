<?php
include 'backend_php/config/db.php';
$database = new Database();
$db = $database->getConnection();
$stmt = $db->query("SELECT id, photo FROM works");
$works = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($works, JSON_PRETTY_PRINT);
?>