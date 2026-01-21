<?php
session_start();
require_once 'includes/db.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

$id = isset($_GET['id']) ? $_GET['id'] : 0;
$stmt = $db->prepare("SELECT * FROM payments WHERE id = :id");
$stmt->bindParam(':id', $id);
$stmt->execute();
$payment = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$payment) {
    header('Location: payments.php');
    exit;
}

include 'includes/header.php';
?>

<div class="main-content">
    <div class="page-header">
        <h1>Payment Details</h1>
        <a href="payments.php" class="btn btn-secondary">Back to List</a>
    </div>

    <div class="card">
        <div class="detail-grid">
            <div class="detail-item">
                <label>Transaction ID</label>
                <div><?php echo htmlspecialchars($payment['transaction_id']); ?></div>
            </div>
            <div class="detail-item">
                <label>Date</label>
                <div><?php echo date('F j, Y, g:i a', strtotime($payment['created_at'])); ?></div>
            </div>
            <div class="detail-item">
                <label>Status</label>
                <div>
                    <span class="badge badge-<?php 
                        $statusColors = ['SUCCESS' => 'success', 'FAILED' => 'danger', 'PENDING' => 'warning'];
                        echo isset($statusColors[$payment['status']]) ? $statusColors[$payment['status']] : 'secondary';
                    ?>">
                        <?php echo htmlspecialchars($payment['status']); ?>
                    </span>
                </div>
            </div>
            <div class="detail-item">
                <label>Amount</label>
                <div>₹<?php echo number_format($payment['amount'], 2); ?></div>
            </div>
            <div class="detail-item">
                <label>Name</label>
                <div><?php echo htmlspecialchars($payment['name']); ?></div>
            </div>
            <div class="detail-item">
                <label>Email</label>
                <div><?php echo htmlspecialchars($payment['email']); ?></div>
            </div>
            <div class="detail-item">
                <label>Phone</label>
                <div><?php echo htmlspecialchars($payment['phone']); ?></div>
            </div>
            <div class="detail-item">
                <label>Address</label>
                <div><?php echo nl2br(htmlspecialchars($payment['address'])); ?></div>
            </div>
        </div>

        <?php if (!empty($payment['phonepe_response'])): ?>
        <div class="mt-4">
            <h3>Provider Response</h3>
            <pre style="background: #f4f4f4; padding: 15px; border-radius: 4px; overflow-x: auto;"><?php 
                $json = json_decode($payment['phonepe_response'], true);
                echo htmlspecialchars(json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)); 
            ?></pre>
        </div>
        <?php endif; ?>
    </div>
</div>

<style>
.detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}
.detail-item label {
    font-weight: bold;
    color: #666;
    font-size: 0.9em;
    display: block;
    margin-bottom: 5px;
}
.mt-4 { margin-top: 1.5rem; }
</style>

<?php include 'includes/footer.php'; ?>
