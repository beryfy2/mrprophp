<?php
include_once __DIR__ . '/config/db.php';
include_once __DIR__ . '/lib/env_loader.php';

loadEnv(__DIR__ . '/.env');

$mysqli = new mysqli("localhost", "root", "", "mrpro");

if ($mysqli->connect_error) {
    echo "✗ Connection failed: " . $mysqli->connect_error . "\n";
    exit(1);
}

// Check if order_num column exists
$result = $mysqli->query("SHOW COLUMNS FROM employees LIKE 'order_num'");

if ($result->num_rows === 0) {
    // Column doesn't exist, add it
    if ($mysqli->query("ALTER TABLE employees ADD COLUMN order_num INT DEFAULT 0 AFTER is_advisor")) {
        echo "✓ Added 'order_num' column to employees table\n";
    } else {
        echo "✗ Error adding column: " . $mysqli->error . "\n";
        exit(1);
    }
} else {
    echo "✓ 'order_num' column already exists\n";
}

$mysqli->close();
echo "✓ Migration complete!\n";
?>
