<?php
// Create database if it doesn't exist using MySQLi
$mysqli = new mysqli("localhost", "root", "", "");

if ($mysqli->connect_error) {
    echo "✗ Connection failed: " . $mysqli->connect_error . "\n";
    exit(1);
}

// Create database
if (!$mysqli->query("CREATE DATABASE IF NOT EXISTS mrpro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")) {
    echo "✗ Error creating database: " . $mysqli->error . "\n";
    exit(1);
}

echo "✓ Database 'mrpro' created successfully (or already exists)\n";

// Select the database
$mysqli->select_db("mrpro");

// Read and execute database.sql
$sql = file_get_contents(__DIR__ . '/database.sql');

// Split by semicolons and execute each statement
$statements = array_filter(
    array_map('trim', explode(';', $sql)),
    fn($stmt) => !empty($stmt) && !preg_match('/^--/', trim($stmt))
);

foreach ($statements as $statement) {
    if (!empty($statement)) {
        if (!$mysqli->query($statement)) {
            echo "✗ Error executing query: " . $mysqli->error . "\n";
            echo "Query: " . substr($statement, 0, 100) . "...\n";
        }
    }
}

echo "✓ Database tables created successfully\n";
echo "✓ Connection test successful!\n";
$mysqli->close();
?>
