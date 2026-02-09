<?php
include_once __DIR__ . '/../config/cors.php';
include_once __DIR__ . '/../lib/env_loader.php';
// Load env
loadEnv(__DIR__ . '/../.env');

include_once __DIR__ . '/../config/db.php';

// Helper function to send JSON response
function sendResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit();
}

// Get the request URI
$request_uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Handle _method override
if (isset($_GET['_method'])) {
    $method = strtoupper($_GET['_method']);
}

// Remove query string
$uri_parts = explode('?', $request_uri);
$path = $uri_parts[0];

// Serve static files (uploads) directly if they exist
// This is for PHP built-in server. Apache/Nginx handle this via config/htaccess.
if (php_sapi_name() === 'cli-server') {
    $file = __DIR__ . '/..' . $path;
    if (is_file($file)) {
        return false;
    }
}

// Normalize path to remove /backend_php/api or similar prefixes if necessary
// Assuming the server root points to the project root, and requests come to /api/...
// But for now, let's just match the end of the string.

// Database connection
$database = new Database();
$db = $database->getConnection();

// Router
if (preg_match('#/api/kpis$#', $path)) {
    include __DIR__ . '/kpis.php';
} elseif (preg_match('#/api/auth/login$#', $path)) {
    include __DIR__ . '/auth.php';
    login($db);
} elseif (preg_match('#/api/auth/forgot$#', $path)) {
    include __DIR__ . '/auth.php';
    forgotPassword($db);
} elseif (preg_match('#/api/auth/reset$#', $path)) {
    include __DIR__ . '/auth.php';
    resetPassword($db);
} elseif (preg_match('#/api/employees$#', $path)) {
    include __DIR__ . '/employees.php';
    if ($method == 'GET') getEmployees($db);
    elseif ($method == 'POST') createEmployee($db);
} elseif (preg_match('#/api/employees/(\d+)$#', $path, $matches)) {
    include __DIR__ . '/employees.php';
    $id = $matches[1];
    if ($method == 'GET') getEmployeeById($db, $id);
    elseif ($method == 'PUT') updateEmployee($db, $id);
    elseif ($method == 'DELETE') deleteEmployee($db, $id);
} elseif (preg_match('#/api/media$#', $path)) {
    include __DIR__ . '/media.php';
    if ($method == 'GET') getMedia($db);
    elseif ($method == 'POST') createMedia($db);
} elseif (preg_match('#/api/media/(\d+)$#', $path, $matches)) {
    include __DIR__ . '/media.php';
    $id = $matches[1];
    if ($method == 'GET') getMediaById($db, $id);
    elseif ($method == 'PUT') updateMedia($db, $id);
    elseif ($method == 'DELETE') deleteMedia($db, $id);
} elseif (preg_match('#/api/public/media$#', $path)) {
    include __DIR__ . '/media.php';
    getPublicMedia($db);
} elseif (preg_match('#/api/enquiries$#', $path)) {
    include __DIR__ . '/enquiries.php';
    if ($method == 'GET') getEnquiries($db);
    elseif ($method == 'POST') createEnquiry($db);
} elseif (preg_match('#/api/enquiries/(\d+)$#', $path, $matches)) {
    include __DIR__ . '/enquiries.php';
    $id = $matches[1];
    if ($method == 'DELETE') deleteEnquiry($db, $id);
} elseif (preg_match('#/api/achievements$#', $path)) {
    include __DIR__ . '/achievements.php';
    if ($method == 'GET') getAchievements($db);
    elseif ($method == 'POST') createAchievement($db);
} elseif (preg_match('#/api/public/achievements$#', $path)) {
    include __DIR__ . '/achievements.php';
    getAchievements($db);
} elseif (preg_match('#/api/achievements/(\d+)$#', $path, $matches)) {
    include __DIR__ . '/achievements.php';
    $id = $matches[1];
    if ($method == 'GET') getAchievementById($db, $id);
    elseif ($method == 'PUT') updateAchievement($db, $id);
    elseif ($method == 'DELETE') deleteAchievement($db, $id);
} elseif (preg_match('#/api/works$#', $path)) {
    include __DIR__ . '/works.php';
    if ($method == 'GET') getWorks($db);
    elseif ($method == 'POST') createWork($db);
} elseif (preg_match('#/api/public/works$#', $path)) {
    include __DIR__ . '/works.php';
    getWorks($db);
} elseif (preg_match('#/api/public/works/(\d+)$#', $path, $matches)) {
    include __DIR__ . '/works.php';
    $id = $matches[1];
    getWorkById($db, $id);
} elseif (preg_match('#/api/works/(\d+)$#', $path, $matches)) {
    include __DIR__ . '/works.php';
    $id = $matches[1];
    if ($method == 'GET') getWorkById($db, $id);
    elseif ($method == 'PUT') updateWork($db, $id);
    elseif ($method == 'DELETE') deleteWork($db, $id);
} elseif (preg_match('#/api/enquiries/unread-count$#', $path)) {
    include __DIR__ . '/enquiries.php';
    if ($method == 'GET') getUnreadCount($db);
} elseif (preg_match('#/api/enquiries/(\d+)/read$#', $path, $matches)) {
    include __DIR__ . '/enquiries.php';
    $id = $matches[1];
    if ($method == 'PUT') markEnquiryRead($db, $id);
} elseif (preg_match('#/api/phonepe/pay$#', $path)) {
    include __DIR__ . '/phonepe.php';
    if ($method == 'POST') initiatePayment($db);
} elseif (preg_match('#/api/phonepe/status/([^/]+)$#', $path, $matches)) {
    include __DIR__ . '/phonepe.php';
    $txnId = $matches[1];
    if ($method == 'GET') checkPaymentStatus($db, $txnId);
} elseif (preg_match('#/api/phonepe/callback$#', $path)) {
    include __DIR__ . '/phonepe.php';
    if ($method == 'POST') handleCallback($db);
} elseif (preg_match('#/api/nav[-_]items$#', $path)) {
    include __DIR__ . '/nav_items.php';
    if ($method == 'GET') getNavItems($db);
    elseif ($method == 'POST') createNavItem($db);
} elseif (preg_match('#/api/nav[-_]items/(\d+)$#', $path, $matches)) {
    include __DIR__ . '/nav_items.php';
    $id = $matches[1];
    if ($method == 'GET') getNavItemById($db, $id);
    elseif ($method == 'PUT') updateNavItem($db, $id);
    elseif ($method == 'DELETE') deleteNavItem($db, $id);
} elseif (preg_match('#/api/nav[-_]items/(\d+)/titles$#', $path, $matches)) {
    include __DIR__ . '/nav_items.php';
    $id = $matches[1];
    if ($method == 'GET') getTitlesByNavItem($db, $id);
    elseif ($method == 'POST') createTitleForNavItem($db, $id);
} elseif (preg_match('#/api/titles/(\d+)$#', $path, $matches)) {
    include __DIR__ . '/titles.php';
    $id = $matches[1];
    if ($method == 'GET') getTitleById($db, $id);
    elseif ($method == 'PUT') updateTitle($db, $id);
    elseif ($method == 'DELETE') deleteTitle($db, $id);
} elseif (preg_match('#/api/titles/(\d+)/subtitles$#', $path, $matches)) {
    include __DIR__ . '/titles.php';
    $id = $matches[1];
    if ($method == 'GET') getSubtitlesByTitle($db, $id);
    elseif ($method == 'POST') createSubtitleForTitle($db, $id);
} elseif (preg_match('#/api/subtitles/(\d+)$#', $path, $matches)) {
    include __DIR__ . '/subtitles.php';
    $id = $matches[1];
    if ($method == 'GET') getSubtitleById($db, $id);
    elseif ($method == 'PUT') updateSubtitle($db, $id);
    elseif ($method == 'DELETE') deleteSubtitle($db, $id);
} elseif (preg_match('#/api/subtitles/(\d+)/files$#', $path, $matches)) {
    include __DIR__ . '/subtitles.php';
    $id = $matches[1];
    if ($method == 'POST') uploadSubtitleFiles($db, $id);
    elseif ($method == 'DELETE') deleteSubtitleFileLegacy($db, $id);
} elseif (preg_match('#/api/subtitles/(\d+)/files/([^/]+)$#', $path, $matches)) {
    include __DIR__ . '/subtitles.php';
    $id = $matches[1];
    $fileId = $matches[2];
    if ($method == 'DELETE') deleteSubtitleFile($db, $id, $fileId);
} elseif (preg_match('#/api/subtitles/(\d+)/questions/(\d+)/files$#', $path, $matches)) {
    include __DIR__ . '/subtitles.php';
    $id = $matches[1];
    $qIdx = $matches[2];
    if ($method == 'POST') uploadQuestionFiles($db, $id, $qIdx);
} elseif (preg_match('#/api/subtitles/(\d+)/questions/(\d+)/files/([^/]+)$#', $path, $matches)) {
    include __DIR__ . '/subtitles.php';
    $id = $matches[1];
    $qIdx = $matches[2];
    $fileId = $matches[3];
    if ($method == 'DELETE') deleteQuestionFile($db, $id, $qIdx, $fileId);
} elseif (preg_match('#/api/subtitles/by-slug/([^/]+)$#', $path, $matches)) {
    include __DIR__ . '/subtitles.php';
    $slug = $matches[1];
    if ($method == 'GET') getSubtitleBySlug($db, $slug);
} elseif (preg_match('#/api/public/subtitles/([^/]+)$#', $path, $matches)) {
    include __DIR__ . '/subtitles.php';
    $slug = $matches[1];
    if ($method == 'GET') getSubtitleBySlug($db, $slug);
} elseif (preg_match('#/api/jobs$#', $path)) {
    include __DIR__ . '/jobs.php';
    if ($method == 'GET') getJobs($db);
    elseif ($method == 'POST') createJob($db);
} elseif (preg_match('#/api/jobs/(\d+)$#', $path, $matches)) {
    include __DIR__ . '/jobs.php';
    $id = $matches[1];
    if ($method == 'PUT') updateJob($db, $id);
    elseif ($method == 'DELETE') deleteJob($db, $id);
}
// ... Add other routes here ...
else {
    sendResponse(['error' => 'Not Found'], 404);
}
?>
