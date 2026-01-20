<?php
// Main Router for PHP Built-in Server
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

// 1. Serve static files and existing scripts directly
// This allows serving /admin/index.php, /admin/css/style.css, /uploads/image.png
// We check if the file exists relative to the project root (backend_php)
$file = __DIR__ . $path;

if (file_exists($file) && !is_dir($file)) {
    // Let PHP built-in server handle it (return false)
    // Note: PHP built-in server executes .php files automatically if we return false.
    return false; 
}

// 2. Route /api requests to api/index.php
if (strpos($path, '/api') === 0) {
    // We need to set $_SERVER vars correctly if needed, but usually OK.
    include __DIR__ . '/api/index.php';
    return;
}

// 3. Route /admin requests to /admin/index.php if it's a directory or clean URL
if (strpos($path, '/admin') === 0) {
    // If it's just /admin or /admin/, serve index.php
    if ($path === '/admin' || $path === '/admin/') {
        include __DIR__ . '/admin/index.php';
        return;
    }
    // If it's /admin/something and file doesn't exist (checked above), maybe it's a clean URL?
    // But we are using .php extensions in our links (employees.php), so file check above should have caught it.
    // If we are here, it means file not found in admin.
}

// 4. Serve React App (SPA) for any other route
$indexFile = __DIR__ . '/index.html';
if (file_exists($indexFile)) {
    // Reset HTTP response code to 200 just in case
    http_response_code(200);
    include $indexFile;
    return;
}

// 5. 404 Not Found
http_response_code(404);
echo "404 Not Found - " . htmlspecialchars($path);
?>
