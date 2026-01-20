<?php
include_once 'includes/db.php';
requireLogin();

$db = getDB();

// Handle Delete
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_id'])) {
    $id = $_POST['delete_id'];
    $stmt = $db->prepare("DELETE FROM jobs WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    
    header('Location: jobs.php');
    exit();
}

// Fetch Items
$query = "SELECT * FROM jobs ORDER BY created_at DESC";
$stmt = $db->query($query);
$items = $stmt->fetchAll(PDO::FETCH_ASSOC);

$pageTitle = 'Jobs Management';
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
                    <a href="job_form.php" class="btn btn-primary">Add New Job</a>
                </div>
                
                <div class="card">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Location</th>
                                <th>Exp. Level</th>
                                <th>Urgent</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($items as $item): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($item['title']); ?></td>
                                <td><?php echo htmlspecialchars($item['type']); ?></td>
                                <td><?php echo htmlspecialchars($item['location']); ?></td>
                                <td><?php echo htmlspecialchars($item['experience_level']); ?></td>
                                <td>
                                    <?php if ($item['urgent']): ?>
                                        <span class="badge badge-danger">Urgent</span>
                                    <?php else: ?>
                                        <span class="badge badge-secondary">Normal</span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <a href="job_form.php?id=<?php echo $item['id']; ?>" class="action-btn btn-edit">Edit</a>
                                    <form method="POST" style="display:inline;" onsubmit="return confirm('Delete this job?');">
                                        <input type="hidden" name="delete_id" value="<?php echo $item['id']; ?>">
                                        <button type="submit" class="action-btn btn-delete">Delete</button>
                                    </form>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                            
                            <?php if (empty($items)): ?>
                            <tr>
                                <td colspan="6" style="text-align:center;">No jobs found.</td>
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
