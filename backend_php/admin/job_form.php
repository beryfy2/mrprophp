<?php
include_once 'includes/db.php';
requireLogin();

$db = getDB();

$id = isset($_GET['id']) ? $_GET['id'] : null;
$item = null;
$error = '';

if ($id) {
    $stmt = $db->prepare("SELECT * FROM jobs WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$item) {
        header('Location: jobs.php');
        exit();
    }
}

// Prepare data for form
$responsibilities_text = '';
$qualifications_text = '';

if ($item) {
    $resp = json_decode($item['responsibilities'], true);
    if (is_array($resp)) {
        $responsibilities_text = implode("\n", $resp);
    }
    
    $qual = json_decode($item['qualifications'], true);
    if (is_array($qual)) {
        $qualifications_text = implode("\n", $qual);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $description = $_POST['description'];
    $type = $_POST['type'];
    $experience = $_POST['experience'];
    $experience_level = $_POST['experience_level'];
    $location = $_POST['location'];
    $urgent = isset($_POST['urgent']) ? 1 : 0;
    
    // Process list items
    $resp_array = array_filter(array_map('trim', explode("\n", $_POST['responsibilities'])));
    $responsibilities = json_encode(array_values($resp_array));
    
    $qual_array = array_filter(array_map('trim', explode("\n", $_POST['qualifications'])));
    $qualifications = json_encode(array_values($qual_array));
    
    if ($id) {
        // Update
        $query = "UPDATE jobs SET title = :title, description = :description, type = :type, experience = :experience, urgent = :urgent, experience_level = :experience_level, location = :location, responsibilities = :responsibilities, qualifications = :qualifications WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
    } else {
        // Insert
        $query = "INSERT INTO jobs (title, description, type, experience, urgent, experience_level, location, responsibilities, qualifications) VALUES (:title, :description, :type, :experience, :urgent, :experience_level, :location, :responsibilities, :qualifications)";
        $stmt = $db->prepare($query);
    }

    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':type', $type);
    $stmt->bindParam(':experience', $experience);
    $stmt->bindParam(':urgent', $urgent);
    $stmt->bindParam(':experience_level', $experience_level);
    $stmt->bindParam(':location', $location);
    $stmt->bindParam(':responsibilities', $responsibilities);
    $stmt->bindParam(':qualifications', $qualifications);

    if ($stmt->execute()) {
        header('Location: jobs.php');
        exit();
    } else {
        $error = "Database error";
    }
}

$pageTitle = $id ? 'Edit Job' : 'Add New Job';
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
                    <a href="jobs.php" class="btn btn-secondary">Back</a>
                </div>
                
                <div class="card">
                    <?php if ($error): ?>
                        <div class="alert alert-danger"><?php echo $error; ?></div>
                    <?php endif; ?>
                    
                    <form method="POST">
                        <div class="row">
                            <div class="col-md-6" style="width: 48%; display: inline-block; vertical-align: top;">
                                <div class="form-group">
                                    <label>Job Title</label>
                                    <input type="text" name="title" class="form-control" value="<?php echo $item ? htmlspecialchars($item['title']) : ''; ?>" required>
                                </div>
                            </div>
                            <div class="col-md-6" style="width: 48%; display: inline-block; vertical-align: top; margin-left: 2%;">
                                <div class="form-group">
                                    <label>Location</label>
                                    <input type="text" name="location" class="form-control" value="<?php echo $item ? htmlspecialchars($item['location']) : ''; ?>" required>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-4" style="width: 31%; display: inline-block; vertical-align: top;">
                                <div class="form-group">
                                    <label>Type</label>
                                    <select name="type" class="form-control">
                                        <option value="Full Time" <?php echo ($item && $item['type'] == 'Full Time') ? 'selected' : ''; ?>>Full Time</option>
                                        <option value="Part Time" <?php echo ($item && $item['type'] == 'Part Time') ? 'selected' : ''; ?>>Part Time</option>
                                        <option value="Contract" <?php echo ($item && $item['type'] == 'Contract') ? 'selected' : ''; ?>>Contract</option>
                                        <option value="Internship" <?php echo ($item && $item['type'] == 'Internship') ? 'selected' : ''; ?>>Internship</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-4" style="width: 31%; display: inline-block; vertical-align: top; margin-left: 2%;">
                                <div class="form-group">
                                    <label>Experience Level</label>
                                    <select name="experience_level" class="form-control">
                                        <option value="Entry Level" <?php echo ($item && $item['experience_level'] == 'Entry Level') ? 'selected' : ''; ?>>Entry Level</option>
                                        <option value="Mid Level" <?php echo ($item && $item['experience_level'] == 'Mid Level') ? 'selected' : ''; ?>>Mid Level</option>
                                        <option value="Senior Level" <?php echo ($item && $item['experience_level'] == 'Senior Level') ? 'selected' : ''; ?>>Senior Level</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-4" style="width: 31%; display: inline-block; vertical-align: top; margin-left: 2%;">
                                <div class="form-group">
                                    <label>Experience Required</label>
                                    <input type="text" name="experience" class="form-control" value="<?php echo $item ? htmlspecialchars($item['experience']) : ''; ?>" placeholder="e.g. 2-5 years">
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Description</label>
                            <textarea name="description" class="form-control" rows="4" required><?php echo $item ? htmlspecialchars($item['description']) : ''; ?></textarea>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6" style="width: 48%; display: inline-block; vertical-align: top;">
                                <div class="form-group">
                                    <label>Responsibilities (One per line)</label>
                                    <textarea name="responsibilities" class="form-control" rows="6"><?php echo htmlspecialchars($responsibilities_text); ?></textarea>
                                </div>
                            </div>
                            <div class="col-md-6" style="width: 48%; display: inline-block; vertical-align: top; margin-left: 2%;">
                                <div class="form-group">
                                    <label>Qualifications (One per line)</label>
                                    <textarea name="qualifications" class="form-control" rows="6"><?php echo htmlspecialchars($qualifications_text); ?></textarea>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label style="display: flex; align-items: center; cursor: pointer;">
                                <input type="checkbox" name="urgent" <?php echo ($item && $item['urgent']) ? 'checked' : ''; ?> style="width: auto; margin-right: 10px;">
                                Mark as Urgent Hiring
                            </label>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">Save Job</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
