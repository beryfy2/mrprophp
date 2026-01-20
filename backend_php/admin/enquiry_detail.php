<?php
include_once 'includes/db.php';
requireLogin();

$db = getDB();

$id = isset($_GET['id']) ? $_GET['id'] : null;

if (!$id) {
    header('Location: enquiries.php');
    exit();
}

// Mark as read
$update = $db->prepare("UPDATE enquiries SET is_read = 1 WHERE id = :id");
$update->bindParam(':id', $id);
$update->execute();

$stmt = $db->prepare("SELECT * FROM enquiries WHERE id = :id");
$stmt->bindParam(':id', $id);
$stmt->execute();
$item = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$item) {
    header('Location: enquiries.php');
    exit();
}

$pageTitle = 'Enquiry Details';
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
                    <a href="enquiries.php" class="btn btn-secondary">Back</a>
                </div>
                
                <div class="card">
                    <div class="row">
                        <div class="col-md-6" style="width: 48%; display: inline-block; vertical-align: top;">
                            <h3>Contact Info</h3>
                            <p><strong>Company:</strong> <?php echo htmlspecialchars($item['company_name']); ?></p>
                            <p><strong>Contact Person:</strong> <?php echo htmlspecialchars($item['contact_person']); ?></p>
                            <p><strong>Email:</strong> <a href="mailto:<?php echo htmlspecialchars($item['email']); ?>"><?php echo htmlspecialchars($item['email']); ?></a></p>
                            <p><strong>Date:</strong> <?php echo date('F j, Y, g:i a', strtotime($item['date'])); ?></p>
                        </div>
                        <div class="col-md-6" style="width: 48%; display: inline-block; vertical-align: top; margin-left: 2%;">
                            <h3>Payment Info</h3>
                            <?php if ($item['transaction_id']): ?>
                                <p><strong>Transaction ID:</strong> <?php echo htmlspecialchars($item['transaction_id']); ?></p>
                                <p><strong>Status:</strong> 
                                    <span class="badge badge-<?php echo $item['payment_status'] == 'SUCCESS' ? 'success' : 'warning'; ?>">
                                        <?php echo htmlspecialchars($item['payment_status']); ?>
                                    </span>
                                </p>
                                <p><strong>Amount:</strong> <?php echo htmlspecialchars($item['amount']); ?></p>
                            <?php else: ?>
                                <p>No payment information associated with this enquiry.</p>
                            <?php endif; ?>
                        </div>
                    </div>
                    
                    <hr>
                    
                    <div class="form-group">
                        <label><strong>Subject</strong></label>
                        <p><?php echo htmlspecialchars($item['subject']); ?></p>
                    </div>
                    
                    <div class="form-group">
                        <label><strong>Message</strong></label>
                        <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; white-space: pre-wrap;"><?php echo htmlspecialchars($item['message']); ?></div>
                    </div>
                    
                    <?php if ($item['file']): ?>
                    <div class="form-group">
                        <label><strong>Attachment</strong></label>
                        <p>
                            <a href="<?php echo htmlspecialchars('../../' . $item['file']); ?>" target="_blank" class="btn btn-primary">Download Attachment</a>
                        </p>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
