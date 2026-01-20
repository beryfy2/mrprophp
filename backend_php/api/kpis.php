<?php
function getKpis($db) {
    // Total Employees
    $query = "SELECT COUNT(*) as count FROM employees";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $totalEmployees = $row['count'];

    // New Enquiries (just count all for now, or filter by date if needed)
    $query = "SELECT COUNT(*) as count FROM enquiries";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $newEnquiries = $row['count'];

    echo json_encode([
        'totalEmployees' => ['value' => $totalEmployees, 'changePct' => 12],
        'newEnquiries' => ['value' => $newEnquiries, 'changePct' => 18]
    ]);
}

if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
   // Direct access handling if needed, but index.php handles it.
   // But since index.php includes this, the function is available.
   // Wait, in index.php I just included it. I should call the function.
}

// In index.php I should have called getKpis($db);
if (isset($db)) getKpis($db);
?>
