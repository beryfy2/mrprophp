<?php
require __DIR__ . '/config/db.php';

$database = new Database();
$db = $database->getConnection();

$stmt = $db->query("SELECT id, title, photo FROM works ORDER BY id DESC LIMIT 5");
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

var_export($rows);
echo PHP_EOL;
