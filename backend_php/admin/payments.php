<?php
session_start();
include_once 'includes/db.php';
requireLogin();

$db = getDB();

$statusFilter = isset($_GET['status']) ? $_GET['status'] : '';
$whereClause = "";
$params = [];

if ($statusFilter) {
    $whereClause = "WHERE status = :status";
    $params[':status'] = $statusFilter;
}

$query = "SELECT * FROM payments $whereClause ORDER BY created_at DESC";
$stmt = $db->prepare($query);
$stmt->execute($params);
$payments = $stmt->fetchAll(PDO::FETCH_ASSOC);

$successCount = 0;
$pendingCount = 0;
$failedCount = 0;

foreach ($payments as $p) {
    if (isset($p['status'])) {
        if ($p['status'] === 'SUCCESS') {
            $successCount++;
        } elseif ($p['status'] === 'PENDING') {
            $pendingCount++;
        } elseif ($p['status'] === 'FAILED') {
            $failedCount++;
        }
    }
}

include 'includes/header.php';
?>

<div class="main-content-wrapper">
    <div class="main-content-inner">

        <!-- HEADER -->
      <div class="page-top">

    <div>
        <h1 class="page-title">Payments Management</h1>
        <p class="page-subtitle">Track and manage all transactions</p>
    </div>

    <div class="header-actions">

        <!-- STATUS FILTER -->
        <form method="GET">
            <select name="status" class="status-filter" onchange="this.form.submit()">
                <option value="">All Status</option>
                <option value="SUCCESS" <?= $statusFilter === 'SUCCESS' ? 'selected' : '' ?>>Success</option>
                <option value="FAILED" <?= $statusFilter === 'FAILED' ? 'selected' : '' ?>>Failed</option>
                <option value="PENDING" <?= $statusFilter === 'PENDING' ? 'selected' : '' ?>>Pending</option>
                <option value="INITIATED" <?= $statusFilter === 'INITIATED' ? 'selected' : '' ?>>Initiated</option>
            </select>
        </form>

        <!-- BACK BUTTON -->
        <a href="index.php" class="back-btn">
            ← Back
        </a>

    </div>

</div>



        <!-- STATS -->
        <div class="stats-grid">
            <div class="stat-card">
                <span>Total Payments</span>
                <h2><?= count($payments) ?></h2>
            </div>

            <div class="stat-card success">
                <span>Successful</span>
                <h2><?= $successCount ?></h2>
            </div>

            <div class="stat-card warning">
                <span>Pending</span>
                <h2><?= $pendingCount ?></h2>
            </div>

            <div class="stat-card danger">
                <span>Failed</span>
                <h2><?= $failedCount ?></h2>
            </div>
        </div>

        <!-- TABLE -->
        <div class="card-box">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Transaction ID</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (count($payments) > 0): ?>
                        <?php foreach ($payments as $payment): ?>
                            <tr>
                                <td><?= date('M d, Y H:i', strtotime($payment['created_at'])) ?></td>
                                <td><?= htmlspecialchars($payment['transaction_id']) ?></td>
                                <td>
                                    <?= htmlspecialchars($payment['name']) ?><br>
                                    <small><?= htmlspecialchars($payment['email']) ?></small>
                                </td>
                                <td>₹<?= number_format($payment['amount'], 2) ?></td>
                                <td>
                                    <?php
                                    $statusClass = array(
                                        'SUCCESS'   => 'badge-success',
                                        'FAILED'    => 'badge-danger',
                                        'PENDING'   => 'badge-warning',
                                        'INITIATED' => 'badge-secondary'
                                    );
                                    $badgeClass = isset($statusClass[$payment['status']])
                                        ? $statusClass[$payment['status']]
                                        : 'badge-secondary';
                                    ?>
                                    <span class="badge <?= $badgeClass ?>">
                                        <?= htmlspecialchars($payment['status']) ?>
                                    </span>
                                </td>
                                <td>
                                    <a href="payment_detail.php?id=<?= $payment['id'] ?>" class="btn-view">
                                        View
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="6" class="no-data">No payments found.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

    </div>
</div>

<style>

/* PAGE WRAPPER */
.main-content-wrapper {
    padding: 30px;
    background: #f4f6f9;
    min-height: 100vh;
}

.main-content-inner {
    max-width: 1400px;
    margin: auto;
}


/* HEADER */
.page-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 35px;
}

.page-title {
    font-size: 32px;
    font-weight: 700;
    color: #0A2540;
    margin: 0;
}

.page-subtitle {
    margin-top: 6px;
    font-size: 14px;
    color: #7a8599;
}

/* FILTER BUTTON */
.status-filter {
    padding: 10px 18px;
    border-radius: 25px;
    border: none;
    background: #0A2540;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    outline: none;
    appearance: none;
}

.status-filter:hover {
    background: #021350;
}


/* STATS */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 25px;
    margin-bottom: 35px;
}

.stat-card {
    background: #ffffff;
    padding: 25px;
    border-radius: 16px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.06);
}

.stat-card span {
    font-size: 13px;
    color: #6c757d;
}

.stat-card h2 {
    font-size: 30px;
    margin-top: 12px;
    font-weight: 700;
}

.success h2 { color: #28a745; }
.warning h2 { color: #f0ad4e; }
.danger  h2 { color: #dc3545; }

/* TABLE */
.card-box {
    background: #ffffff;
    padding: 25px;
    border-radius: 16px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.06);
}

.data-table {
    width: 100%;
    border-collapse: collapse;
}

.data-table thead {
    background: #f1f3f7;
}

.data-table th {
    text-align: left;
    padding: 15px;
    font-size: 14px;
    font-weight: 600;
    color: #0A2540;
}

.data-table td {
    padding: 15px;
    border-top: 1px solid #f0f2f5;
    font-size: 14px;
}

.data-table tbody tr:hover {
    background: #f9fbff;
}

.badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
}

.badge-success { background: #e6f4ea; color: #28a745; }
.badge-danger  { background: #fdecea; color: #dc3545; }
.badge-warning { background: #fff3cd; color: #f0ad4e; }
.badge-secondary { background: #e2e3e5; color: #6c757d; }

.btn-view {
    background: #0A2540;
    color: #fff;
    padding: 7px 14px;
    border-radius: 8px;
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
}

.btn-view:hover {
    background: #1f4fff;
}

.no-data {
    text-align: center;
    padding: 25px;
    color: #888;
}

</style>

<?php include 'includes/footer.php'; ?>
