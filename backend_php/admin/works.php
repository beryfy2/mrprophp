<?php 
include_once 'includes/db.php';
requireLogin();

$db = getDB();


// Handle Delete

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_id'])) {

    $id = $_POST['delete_id'];

    $stmt = $db->prepare("SELECT photo FROM works WHERE id = :id");

    $stmt->bindParam(':id', $id);

    $stmt->execute();

    $item = $stmt->fetch(PDO::FETCH_ASSOC);
    

    if ($item) {

        // Delete photo file if exists

        if ($item['photo'] && file_exists(__DIR__ . '/../../' . $item['photo'])) {

            unlink(__DIR__ . '/../../' . $item['photo']);

        }

        

        $deleteStmt = $db->prepare("DELETE FROM works WHERE id = :id");

        $deleteStmt->bindParam(':id', $id);

        $deleteStmt->execute();

    }
    

    header('Location: works.php');

    exit();

}



// Fetch Items

$query = "SELECT * FROM works ORDER BY date DESC";

$stmt = $db->query($query);

$items = $stmt->fetchAll(PDO::FETCH_ASSOC);

$pageTitle = 'Works Management';

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



<!-- SAME HEADER STYLE AS EMPLOYEES -->

<div class="page-header">

<h1 class="page-title">Works Management</h1>

<a href="work_form.php" class="btn btn-add">

Add New Work

</a>

</div>




<!-- SAME TABLE STYLE AS EMPLOYEES -->

<div class="table-container">

<table class="table">




<thead>

<tr>

<th>Photo</th>

<th>Title</th>

<th>Date</th>

<th>Actions</th>

</tr>

</thead>




<tbody>



<?php foreach ($items as $item): ?>


<tr>




<td>


<?php if ($item['photo']): ?>


<img src="<?php echo htmlspecialchars('../../' . $item['photo']); ?>"

style="width:40px;height:40px;border-radius:50%;object-fit:cover;">


<?php else: ?>


<span>No Photo</span>


<?php endif; ?>


</td>




<td>

<?php echo htmlspecialchars($item['title']); ?>

</td>




<td>

<?php echo date('Y-m-d', strtotime($item['date'])); ?>

</td>




<td>



<a href="work_form.php?id=<?php echo $item['id']; ?>"

class="action-btn btn-edit">

Edit

</a>




<form method="POST"

style="display:inline;"

onsubmit="return confirm('Delete this item?');">



<input type="hidden"

name="delete_id"

value="<?php echo $item['id']; ?>">



<button type="submit"

class="action-btn btn-delete">

Delete

</button>



</form>




</td>



</tr>



<?php endforeach; ?>



<?php if (empty($items)): ?>


<tr>

<td colspan="4" style="text-align:center;">

No works found.

</td>

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
