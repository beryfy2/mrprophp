<?php
include_once 'includes/db.php';
requireLogin();

$db = getDB();


// Handle Delete
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_id'])) {

    $id = $_POST['delete_id'];

    // Delete photo file
    $stmt = $db->prepare("SELECT photo_url FROM employees WHERE id = :id");

    $stmt->bindParam(':id', $id);

    $stmt->execute();

    $emp = $stmt->fetch(PDO::FETCH_ASSOC);


    if ($emp && $emp['photo_url']) {

        $filePath = __DIR__ . '/../' . $emp['photo_url'];

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



// Fetch All Employees (Removed ORDER BY order_num)

$stmt = $db->query("SELECT * FROM employees ORDER BY id DESC");

$employees = $stmt->fetchAll(PDO::FETCH_ASSOC);


$pageTitle = 'Employees';

?>


<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Employees - Admin Panel</title>

<link rel="stylesheet" href="css/style.css">

</head>



<body>



<div class="admin-layout">



<?php include 'includes/sidebar.php'; ?>



<div class="admin-main">



<?php include 'includes/header.php'; ?>



<div class="admin-content">



<!-- PAGE HEADER -->

<div class="page-header">


<h1 class="page-title">

Employees

</h1>



<a href="employee_form.php"

class="btn btn-add">


Add New Employee


</a>


</div>




<!-- TABLE -->



<div class="table-container">



<table class="table">




<thead>



<tr>


<th>Photo</th>


<th>Name</th>


<th>Designation</th>


<th>Actions</th>



</tr>



</thead>





<tbody>




<?php if($employees): ?>



<?php foreach ($employees as $emp): ?>




<tr>




<td>




<?php if (!empty($emp['photo_url'])): ?>



<img src="../<?php echo htmlspecialchars($emp['photo_url']); ?>"

style="width:40px;height:40px;border-radius:50%;object-fit:cover;">



<?php else: ?>


No Photo


<?php endif; ?>




</td>




<td>

<?php echo htmlspecialchars($emp['name']); ?>

</td>




<td>

<?php echo htmlspecialchars($emp['designation']); ?>

</td>




<td>




<a href="employee_form.php?id=<?php echo $emp['id']; ?>"

class="action-btn btn-edit">


Edit


</a>





<form method="POST"

style="display:inline;"

onsubmit="return confirm('Delete this employee?');">



<input type="hidden"

name="delete_id"

value="<?php echo $emp['id']; ?>">



<button type="submit"

class="action-btn btn-delete">


Delete


</button>



</form>




</td>




</tr>




<?php endforeach; ?>



<?php else: ?>



<tr>

<td colspan="4"

style="text-align:center">


No Employees Found


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
