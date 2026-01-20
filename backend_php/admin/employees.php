<?php
include_once 'includes/db.php';
requireLogin();

$db = getDB();

// Handle Delete
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_id'])) {
    $id = $_POST['delete_id'];
    // Delete photo file if exists (optional but good practice)
    $stmt = $db->prepare("SELECT photo FROM employees WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $emp = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($emp && $emp['photo']) {
        $filePath = __DIR__ . '/../' . $emp['photo'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    $stmt = $db->prepare("DELETE FROM employees WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    
    header('Location: employees.php');
    exit();
}

// Fetch All
$stmt = $db->query("SELECT * FROM employees ORDER BY order_num ASC");
$employees = $stmt->fetchAll(PDO::FETCH_ASSOC);

$pageTitle = 'Employees';
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
                    <h1 class="page-title">Employees</h1>
                    <a href="employee_form.php" class="btn btn-add">Add New Employee</a>
                </div>

                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Name</th>
                                <th>Designation</th>
                                <th>Order</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($employees as $emp): ?>
                            <tr>
                                <td>
                                    <?php if ($emp['photo']): ?>
                                        <img src="../<?php echo htmlspecialchars($emp['photo']); ?>" alt="Photo" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                                    <?php else: ?>
                                        <span>No Photo</span>
                                    <?php endif; ?>
                                </td>
                                <td><?php echo htmlspecialchars($emp['name']); ?></td>
                                <td><?php echo htmlspecialchars($emp['designation']); ?></td>
                                <td><?php echo htmlspecialchars($emp['order_num']); ?></td>
                                <td>
                                    <a href="employee_form.php?id=<?php echo $emp['id']; ?>" class="action-btn btn-edit">Edit</a>
                                    <form method="POST" style="display:inline;" onsubmit="return confirm('Are you sure?');">
                                        <input type="hidden" name="delete_id" value="<?php echo $emp['id']; ?>">
                                        <button type="submit" class="action-btn btn-delete">Delete</button>
                                    </form>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
