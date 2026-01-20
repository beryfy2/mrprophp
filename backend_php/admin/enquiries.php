<?php
include_once 'includes/db.php';
requireLogin();

$db = getDB();

// Handle Delete
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_id'])) {
    $id = $_POST['delete_id'];
    
    // Delete associated file if exists
    $stmt = $db->prepare("SELECT file FROM enquiries WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($item && $item['file'] && file_exists(__DIR__ . '/../../' . $item['file'])) {
        unlink(__DIR__ . '/../../' . $item['file']);
    }
    
    $deleteStmt = $db->prepare("DELETE FROM enquiries WHERE id = :id");
    $deleteStmt->bindParam(':id', $id);
    $deleteStmt->execute();
    
    header('Location: enquiries.php');
    exit();
}

// Fetch Items
$query = "SELECT * FROM enquiries ORDER BY date DESC";
$stmt = $db->query($query);
$items = $stmt->fetchAll(PDO::FETCH_ASSOC);

$pageTitle = 'Enquiries';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle; ?> - Admin Panel</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="admin-layout">
        <?php include 'includes/sidebar.php'; ?>
        
        <div class="admin-main">
            <?php include 'includes/header.php'; ?>
            
            <div class="admin-content">
                <div class="page-header">
                    <h1 class="page-title"><?php echo $pageTitle; ?></h1>
                </div>
                
                <div class="card">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Company</th>
                                <th>Contact Person</th>
                                <th>Subject</th>
                                <th>Payment</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($items as $item): ?>
                            <tr class="<?php echo $item['is_read'] ? '' : 'font-weight-bold'; ?>">
                                <td><?php echo date('Y-m-d', strtotime($item['date'])); ?></td>
                                <td><?php echo htmlspecialchars($item['company_name']); ?></td>
                                <td><?php echo htmlspecialchars($item['contact_person']); ?></td>
                                <td><?php echo htmlspecialchars($item['subject']); ?></td>
                                <td>
                                    <?php if ($item['payment_status']): ?>
                                        <span class="badge badge-<?php echo $item['payment_status'] == 'SUCCESS' ? 'success' : 'warning'; ?>">
                                            <?php echo htmlspecialchars($item['payment_status']); ?>
                                        </span>
                                    <?php else: ?>
                                        -
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <a href="enquiry_detail.php?id=<?php echo $item['id']; ?>" class="action-btn btn-edit">View</a>
                                    <form method="POST" style="display:inline;" onsubmit="return confirm('Delete this enquiry?');">
                                        <input type="hidden" name="delete_id" value="<?php echo $item['id']; ?>">
                                        <button type="submit" class="action-btn btn-delete">Delete</button>
                                    </form>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                            
                            <?php if (empty($items)): ?>
                            <tr>
                                <td colspan="6" style="text-align:center;">No enquiries found.</td>
                            </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
