<?php
include_once 'includes/db.php';
requireLogin();

$db = getDB();

$id = isset($_GET['id']) ? $_GET['id'] : null;

$employee = [
    'name' => '',
    'designation' => '',
    'bio' => '',
    'photo_url' => ''
];

$error = '';



/* ================= EDIT ================= */

if ($id) {

    $stmt = $db->prepare("SELECT * FROM employees WHERE id = :id");

    $stmt->bindParam(':id', $id);

    $stmt->execute();

    $fetched = $stmt->fetch(PDO::FETCH_ASSOC);


    if ($fetched) {

        $employee = $fetched;

    }

    else {

        header('Location: employees.php');

        exit();

    }

}




/* ================= SAVE ================= */

if ($_SERVER['REQUEST_METHOD'] === 'POST') {


    $name = $_POST['name'] ?? '';

    $designation = $_POST['designation'] ?? '';

    $bio = $_POST['bio'] ?? '';



    /* ================= PHOTO UPLOAD ================= */

    $photoPath = $employee['photo_url'] ?? '';


    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {


        $uploadDir = '../uploads/';


        if (!is_dir($uploadDir)) {

            mkdir($uploadDir, 0777, true);

        }



        $filename = time() . '-' .

        preg_replace('/[^a-zA-Z0-9._-]/','_',$_FILES['photo']['name']);


        $targetFile = $uploadDir . $filename;



        if (move_uploaded_file($_FILES['photo']['tmp_name'], $targetFile)) {


            if ($photoPath && file_exists('../'.$photoPath)) {

                unlink('../'.$photoPath);

            }


            $photoPath = 'uploads/'.$filename;

        }

    }



    /* ================= UPDATE ================= */

    if ($id) {


        $query = "UPDATE employees SET

        name = :name,

        designation = :designation,

        bio = :bio,

        photo_url = :photo

        WHERE id = :id";


        $stmt = $db->prepare($query);

        $stmt->bindParam(':id',$id);

    }


    /* ================= INSERT ================= */

    else {


        $query = "INSERT INTO employees

        (name,designation,bio,photo_url)

        VALUES

        (:name,:designation,:bio,:photo)";


        $stmt = $db->prepare($query);

    }




    $stmt->bindParam(':name',$name);

    $stmt->bindParam(':designation',$designation);

    $stmt->bindParam(':bio',$bio);

    $stmt->bindParam(':photo',$photoPath);




    if ($stmt->execute()) {

        header('Location: employees.php');

        exit();

    }

    else {

        $error="Database Error";

    }

}



$pageTitle = $id ? "Edit Employee" : "Add Employee";

?>



<!DOCTYPE html>

<html lang="en">


<head>


<meta charset="UTF-8">

<meta name="viewport"

content="width=device-width, initial-scale=1.0">


<title>

<?php echo $pageTitle; ?>

</title>


<link rel="stylesheet"

href="css/style.css">


</head>



<body>




<div class="admin-layout">



<?php include 'includes/sidebar.php'; ?>




<div class="admin-main">




<?php include 'includes/header.php'; ?>




<div class="admin-content">




<div class="page-header">




<h1 class="page-title">

<?php echo $pageTitle; ?>

</h1>




<a href="employees.php"

class="btn"

style="background:#e2e8f0;">


Back


</a>




</div>




<?php if($error): ?>


<div class="alert alert-danger">


<?php echo $error; ?>


</div>



<?php endif; ?>




<div class="login-card"

style="max-width:800px;">




<form method="POST"

enctype="multipart/form-data">





<div class="form-group">


<label>Name</label>


<input type="text"

name="name"

class="form-control"

required

value="<?php echo htmlspecialchars($employee['name']); ?>">


</div>





<div class="form-group">


<label>Designation</label>


<input type="text"

name="designation"

class="form-control"

required

value="<?php echo htmlspecialchars($employee['designation']); ?>">


</div>





<div class="form-group">


<label>Bio</label>


<textarea

name="bio"

class="form-control"

rows="4">


<?php echo htmlspecialchars($employee['bio']); ?>


</textarea>


</div>





<div class="form-group">


<label>Photo</label>




<?php if(!empty($employee['photo_url'])): ?>


<img src="../<?php echo $employee['photo_url']; ?>"

style="width:100px;

border-radius:8px;

margin-bottom:10px;">


<?php endif; ?>





<input type="file"

name="photo"

class="form-control">


</div>





<button type="submit"

class="btn btn-primary">


Save Employee


</button>




</form>




</div>




</div>




</div>




</div>




</body>



</html>
