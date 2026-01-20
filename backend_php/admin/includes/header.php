<header class="topbar">
    <div class="page-title"><?php echo htmlspecialchars(isset($pageTitle) ? $pageTitle : 'Admin Panel'); ?></div>
    <div class="user-menu">
        <span><?php echo htmlspecialchars(isset($_SESSION['admin_email']) ? $_SESSION['admin_email'] : 'Admin'); ?></span>
    </div>
</header>
