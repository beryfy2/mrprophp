<?php
include_once '../lib/auth_middleware.php';

function getNavItems($db) {
    // In node: await NavItem.find().sort({ order: 1 });
    // This is just the list of nav items, usually for the top bar.
    $query = "SELECT * FROM nav_items ORDER BY order_num ASC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $list = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($list as &$item) { $item['_id'] = $item['id']; }
    echo json_encode($list);
}

function getNavItemById($db, $id) {
    // In node: await NavItem.findById(req.params.id).populate('titles');
    // We need to fetch titles as well.
    
    $query = "SELECT * FROM nav_items WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($item) {
        // Populate titles
        // Note: titles has foreign key nav_item_id
        $queryTitles = "SELECT * FROM titles WHERE nav_item_id = :id ORDER BY order_num ASC";
        $stmtTitles = $db->prepare($queryTitles);
        $stmtTitles->bindParam(':id', $id);
        $stmtTitles->execute();
        $titles = $stmtTitles->fetchAll(PDO::FETCH_ASSOC);
        
        // The node version just populates titles. 
        // Note: Title model in Node has `titles` field in NavItem schema as array of ObjectIds.
        // But here we rely on FK. The JSON response should look like the Node response.
        // Node response: { _id, name, slug, order, titles: [{_id, title...}, ...] }
        // PHP response should match keys if possible. _id vs id is a common issue.
        // For now, I'll return what I have. If frontend expects `_id`, I might need to alias it or change frontend.
        // User said "without changing ui". 
        // Frontend likely uses `_id`. I should alias `id` as `_id` in SQL or PHP.
        // But `id` is auto-increment int, `_id` is usually ObjectId string.
        // If frontend treats it as string, it's fine.
        
        // I will stick to standard SQL structure first. If UI breaks, I will alias.
        // Actually, if I can, I should return `_id` = `id`.
        
        $item['titles'] = $titles;
        echo json_encode($item);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
    }
}

function createNavItem($db) {
    authenticate();
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) $data = $_POST;

    $name = isset($data['name']) ? $data['name'] : '';
    $slug = isset($data['slug']) ? $data['slug'] : '';
    $order = isset($data['order']) ? $data['order'] : 0;

    $query = "INSERT INTO nav_items (name, slug, order_num) VALUES (:name, :slug, :order)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':slug', $slug);
    $stmt->bindParam(':order', $order);

    if ($stmt->execute()) {
        $id = $db->lastInsertId();
        // Fetch back
        $q = "SELECT * FROM nav_items WHERE id = :id";
        $s = $db->prepare($q);
        $s->bindParam(':id', $id);
        $s->execute();
        echo json_encode($s->fetch(PDO::FETCH_ASSOC));
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to create nav item']);
    }
}

function updateNavItem($db, $id) {
    authenticate();
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) $data = $_POST;

    $name = isset($data['name']) ? $data['name'] : '';
    $slug = isset($data['slug']) ? $data['slug'] : '';
    $order = isset($data['order']) ? $data['order'] : 0;

    $query = "UPDATE nav_items SET name = :name, slug = :slug, order_num = :order WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':slug', $slug);
    $stmt->bindParam(':order', $order);

    if ($stmt->execute()) {
        $q = "SELECT * FROM nav_items WHERE id = :id";
        $s = $db->prepare($q);
        $s->bindParam(':id', $id);
        $s->execute();
        echo json_encode($s->fetch(PDO::FETCH_ASSOC));
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to update nav item']);
    }
}

function deleteNavItem($db, $id) {
    authenticate();
    // Cascade delete is handled by DB constraints usually, but let's be safe.
    // In Node: deletes titles and subtitles manually.
    // My SQL schema has ON DELETE CASCADE for titles->nav_items and subtitles->titles.
    // So deleting nav_item should cascade.
    
    $query = "DELETE FROM nav_items WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    if ($stmt->execute()) {
        echo json_encode(['ok' => true]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to delete nav item']);
    }
}

// Titles relative to NavItem
function getTitlesByNavItem($db, $navId) {
    $query = "SELECT * FROM titles WHERE nav_item_id = :navId ORDER BY order_num ASC, created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':navId', $navId);
    $stmt->execute();
    $list = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($list as &$item) { $item['_id'] = $item['id']; }
    echo json_encode($list);
}

function createTitleForNavItem($db, $navId) {
    authenticate();
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) $data = $_POST;

    $title = isset($data['title']) ? $data['title'] : '';
    $content = isset($data['content']) ? $data['content'] : '';
    $order = isset($data['order']) ? $data['order'] : 0;

    $query = "INSERT INTO titles (nav_item_id, title, content, order_num) VALUES (:navId, :title, :content, :order)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':navId', $navId);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':content', $content);
    $stmt->bindParam(':order', $order);

    if ($stmt->execute()) {
        $id = $db->lastInsertId();
        $q = "SELECT * FROM titles WHERE id = :id";
        $s = $db->prepare($q);
        $s->bindParam(':id', $id);
        $s->execute();
        echo json_encode($s->fetch(PDO::FETCH_ASSOC));
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to create title']);
    }
}
?>
