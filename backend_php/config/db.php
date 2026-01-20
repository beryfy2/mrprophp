<?php

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct() {
        $this->host = isset($_ENV['DB_HOST']) ? $_ENV['DB_HOST'] : 'localhost';
        $this->db_name = isset($_ENV['DB_NAME']) ? $_ENV['DB_NAME'] : 'mrpro';
        $this->username = isset($_ENV['DB_USER']) ? $_ENV['DB_USER'] : 'root';
        $this->password = isset($_ENV['DB_PASS']) ? $_ENV['DB_PASS'] : '';
    }

    public function getConnection() {
        $this->conn = null;

        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4";
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?>
