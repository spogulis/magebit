<?php

Namespace Magebit\Model;

class Database {
    private $conn;

    public function openConnection() {
        // TODO: Move sensitive data to an .ini file that's not included in the source control
        $host = "127.0.0.1";
        $db = "magebit";
        $user = "magebit";
        $pass = "magebit";
        $charset = 'utf8mb4';
        $dsn = "mysql:host=$host;dbname=$db;charset=$charset";

        try {
            $this->conn = new \PDO($dsn, $user, $pass);
       } catch (\PDOException $e) {
            throw new \PDOException($e->getMessage(), (int)$e->getCode());
       }

        // $conn = new \PDO($dbhost, $dbuser, $dbpass, $db) or die("Connect failed: %s\n". $conn -> error);
        
        return $this->conn;
    }

    public function closeConnection($conn) {

        return $conn = null;
    }
}
