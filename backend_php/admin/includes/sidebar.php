<?php
$currentPage = basename($_SERVER['PHP_SELF']);
?>
<aside class="sidebar">
    <div class="sidebar-header">
        <a href="index.php" class="sidebar-logo">Admin Panel</a>
    </div>
    <nav class="sidebar-nav">
        <div class="sidebar-group">
            <div class="sidebar-title">Main</div>
            <a href="index.php" class="sidebar-link <?php echo $currentPage == 'index.php' ? 'active' : ''; ?>">
                Dashboard
            </a>
        </div>

        <div class="sidebar-group">
            <div class="sidebar-title">Content</div>
            <a href="employees.php" class="sidebar-link <?php echo $currentPage == 'employees.php' ? 'active' : ''; ?>">
                Employees
            </a>
            <a href="media.php" class="sidebar-link <?php echo $currentPage == 'media.php' ? 'active' : ''; ?>">
                Media
            </a>
            <a href="achievements.php" class="sidebar-link <?php echo $currentPage == 'achievements.php' ? 'active' : ''; ?>">
                Achievements
            </a>
            <a href="works.php" class="sidebar-link <?php echo $currentPage == 'works.php' ? 'active' : ''; ?>">
                Works
            </a>
            <a href="jobs.php" class="sidebar-link <?php echo $currentPage == 'jobs.php' ? 'active' : ''; ?>">
                Jobs / Careers
            </a>
        </div>

        <div class="sidebar-group">
            <div class="sidebar-title">Navigation</div>
            <a href="nav_items.php" class="sidebar-link <?php echo $currentPage == 'nav_items.php' ? 'active' : ''; ?>">
                Nav Items
            </a>
        </div>

        <div class="sidebar-group">
            <div class="sidebar-title">Communication</div>
            <a href="enquiries.php" class="sidebar-link <?php echo $currentPage == 'enquiries.php' ? 'active' : ''; ?>">
                Enquiries
            </a>
            <a href="payments.php" class="sidebar-link <?php echo $currentPage == 'payments.php' ? 'active' : ''; ?>">
                Payments
            </a>
        </div>

        <div class="sidebar-group">
            <div class="sidebar-title">System</div>
            <a href="settings.php" class="sidebar-link <?php echo $currentPage == 'settings.php' ? 'active' : ''; ?>">
                Settings
            </a>
            <a href="logout.php" class="sidebar-link">
                Logout
            </a>
        </div>
    </nav>
</aside>
