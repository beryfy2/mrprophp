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



$successCount=0;
$pendingCount=0;
$failedCount=0;

foreach($payments as $p){

if($p['status']=="SUCCESS") $successCount++;

elseif($p['status']=="PENDING") $pendingCount++;

elseif($p['status']=="FAILED") $failedCount++;

}



$pageTitle="Payments";

?>


<!DOCTYPE html>
<html lang="en">


<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Payments - Admin</title>

<link rel="stylesheet" href="css/style.css">

</head>



<body>


<div class="admin-layout">


<?php include 'includes/sidebar.php'; ?>



<div class="admin-main">


<?php include 'includes/header.php'; ?>




<div class="admin-content">




<!-- HEADER -->


<div class="page-header">


<h1 class="page-title">

Payments

</h1>




<div style="display:flex; gap:10px;">


<form method="GET">


<select name="status"

class="btn"

onchange="this.form.submit()">


<option value="">

All Status

</option>


<option value="SUCCESS"

<?= $statusFilter=='SUCCESS'?'selected':'' ?>

>

Success

</option>



<option value="FAILED"

<?= $statusFilter=='FAILED'?'selected':'' ?>

>

Failed

</option>



<option value="PENDING"

<?= $statusFilter=='PENDING'?'selected':'' ?>

>

Pending

</option>



<option value="INITIATED"

<?= $statusFilter=='INITIATED'?'selected':'' ?>

>

Initiated

</option>


</select>


</form>



<a href="index.php"

class="btn btn-add">

← Back

</a>


</div>


</div>




<!-- STATS -->


<div class="table-container">




<div style="display:grid;

grid-template-columns:repeat(4,1fr);

gap:20px;">



<div class="stat-card">

<span>Total</span>

<h2><?=count($payments)?></h2>

</div>



<div class="stat-card success">

<span>Success</span>

<h2><?=$successCount?></h2>

</div>




<div class="stat-card warning">

<span>Pending</span>

<h2><?=$pendingCount?></h2>

</div>




<div class="stat-card danger">

<span>Failed</span>

<h2><?=$failedCount?></h2>

</div>




</div>


</div>




<!-- TABLE -->




<div class="table-container">




<table class="table">



<thead>


<tr>

<th>Date</th>

<th>Transaction</th>

<th>Name</th>

<th>Amount</th>

<th>Status</th>

<th>Action</th>

</tr>


</thead>




<tbody>



<?php if($payments): ?>



<?php foreach($payments as $payment): ?>




<tr>



<td>

<?=date('d M Y',

strtotime($payment['created_at']))?>

</td>




<td>

<?=htmlspecialchars($payment['transaction_id'])?>

</td>




<td>


<?=htmlspecialchars($payment['name'])?>

<br>


<small>

<?=htmlspecialchars($payment['email'])?>

</small>



</td>




<td>

₹<?=number_format($payment['amount'],2)?>

</td>




<td>


<?php


$badge=[

'SUCCESS'=>'badge-success',

'FAILED'=>'badge-danger',

'PENDING'=>'badge-warning',

'INITIATED'=>'badge-secondary'

];

?>




<span class="badge <?=$badge[$payment['status']]?>">


<?=$payment['status']?>


</span>



</td>




<td>


<a href="payment_detail.php?id=<?=$payment['id']?>"

class="action-btn btn-edit">


View


</a>



</td>



</tr>



<?php endforeach;?>


<?php else:?>




<tr>


<td colspan="6"

style="text-align:center">


No Payments Found


</td>



</tr>




<?php endif;?>


</tbody>



</table>




</div>




</div>



</div>



</div>



</body>



</html>
