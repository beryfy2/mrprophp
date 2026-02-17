<?php
include_once __DIR__ . '/config/db.php';
include_once __DIR__ . '/lib/env_loader.php';

loadEnv(__DIR__ . '/.env');

$database = new Database();
$conn = $database->getConnection();

if ($conn) {
    echo "✓ Database connection successful!\n";
    
    // Test a simple query
    $result = $conn->query("SELECT DATABASE() as current_db");
    if ($result) {
        $row = $result->fetch();
        echo "✓ Connected to database: " . $row['current_db'] . "\n";
    }
} else {
    echo "✗ Connection failed\n";
}
?>
