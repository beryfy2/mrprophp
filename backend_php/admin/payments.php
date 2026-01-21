<?php
session_start();
include_once 'includes/db.php';
requireLogin();

$db = getDB();

// Handle Status Filter
$statusFilter = isset($_GET['status']) ? $_GET['status'] : '';
$whereClause = "";
$params = [];

if ($statusFilter) {
    $whereClause = "WHERE status = :status";
    $params[':status'] = $statusFilter;
}

// Fetch payments
$query = "SELECT * FROM payments $whereClause ORDER BY created_at DESC";
$stmt = $db->prepare($query);
$stmt->execute($params);
$payments = $stmt->fetchAll(PDO::FETCH_ASSOC);

include 'includes/header.php';
?>

<div class="main-content">
    <div class="page-header">
        <h1>Payments</h1>
        <div class="header-actions">
            <select onchange="window.location.href='?status='+this.value" class="form-control" style="width: auto; display: inline-block;">
                <option value="">All Statuses</option>
                <option value="SUCCESS" <?php echo $statusFilter === 'SUCCESS' ? 'selected' : ''; ?>>Success</option>
                <option value="FAILED" <?php echo $statusFilter === 'FAILED' ? 'selected' : ''; ?>>Failed</option>
                <option value="PENDING" <?php echo $statusFilter === 'PENDING' ? 'selected' : ''; ?>>Pending</option>
                <option value="INITIATED" <?php echo $statusFilter === 'INITIATED' ? 'selected' : ''; ?>>Initiated</option>
            </select>
        </div>
    </div>

    <div class="card">
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Transaction ID</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (count($payments) > 0): ?>
                        <?php foreach ($payments as $payment): ?>
                            <tr>
                                <td><?php echo date('M d, Y H:i', strtotime($payment['created_at'])); ?></td>
                                <td><?php echo htmlspecialchars($payment['transaction_id']); ?></td>
                                <td>
                                    <?php echo htmlspecialchars($payment['name']); ?><br>
                                    <small class="text-muted"><?php echo htmlspecialchars($payment['email']); ?></small>
                                </td>
                                <td>₹<?php echo number_format($payment['amount'], 2); ?></td>
                                <td>
                                    <span class="badge badge-<?php 
                                        $statusColors = ['SUCCESS' => 'success', 'FAILED' => 'danger', 'PENDING' => 'warning'];
                                        echo isset($statusColors[$payment['status']]) ? $statusColors[$payment['status']] : 'secondary';
                                    ?>">
                                        <?php echo htmlspecialchars($payment['status']); ?>
                                    </span>
                                </td>
                                <td>
                                    <a href="payment_detail.php?id=<?php echo $payment['id']; ?>" class="action-btn btn-view">View</a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="6" class="text-center">No payments found.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>
</body>
</html>
