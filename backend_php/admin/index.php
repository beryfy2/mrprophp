<?php
include_once 'includes/db.php';
requireLogin();

$db = getDB();

// Fetch counts
$counts = [];
$tables = ['employees', 'media', 'achievements', 'works', 'enquiries', 'jobs', 'payments'];
foreach ($tables as $table) {
    $stmt = $db->query("SELECT COUNT(*) FROM $table");
    $counts[$table] = $stmt->fetchColumn();
}

$pageTitle = 'Dashboard';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle; ?> - Admin Panel</title>
    <link rel="stylesheet" href="/admin/css/style.css">
</head>
<body>
    <div class="admin-layout">
        <?php include 'includes/sidebar.php'; ?>
        
        <div class="admin-main">
            <?php include 'includes/header.php'; ?>
            
            <div class="admin-content">
                <div class="kpi-grid">
                    <div class="kpi-card">
                        <div class="kpi-label">Total Employees</div>
                        <div class="kpi-value"><?php echo $counts['employees']; ?></div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Media Items</div>
                        <div class="kpi-value"><?php echo $counts['media']; ?></div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Achievements</div>
                        <div class="kpi-value"><?php echo $counts['achievements']; ?></div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Works</div>
                        <div class="kpi-value"><?php echo $counts['works']; ?></div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Jobs</div>
                        <div class="kpi-value"><?php echo $counts['jobs']; ?></div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Enquiries</div>
                        <div class="kpi-value"><?php echo $counts['enquiries']; ?></div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Payments</div>
                        <div class="kpi-value"><?php echo $counts['payments']; ?></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
