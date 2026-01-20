<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

include_once __DIR__ . '/../../config/db.php';
include_once __DIR__ . '/../../lib/env_loader.php';

// Load env if not already loaded (e.g. if accessed directly)
if (!isset($_ENV['DB_HOST'])) {
    loadEnv(__DIR__ . '/../../.env');
}

function getDB() {
    static $db = null;
    if ($db === null) {
        $database = new Database();
        $db = $database->getConnection();
    }
    return $db;
}

function isLoggedIn() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit();
    }
}
?>
