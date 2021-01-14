<?php

Namespace Magebit\Model;

Use Magebit\Model\Database;

class Subscription {
    private $db;
    private $email;
    private $subscriptionModel;
    private $emptyError = 'Email address is required';
    private $invalidError = 'Please provide a valid e-mail address';
    private $inUseError = 'Email already used';
    private $blacklistedError = 'We are not accepting subscriptions from Colombia
    emails';

    public function __construct() {
        $this->db = new Database();
    }

    public function validateEmail($email) {
        $isEmpty = strlen($email) < 1;
        $isDomainBlacklisted = $this->endsWith($email, '.co') ? true : false;
        $isFormatValid = filter_var($email, FILTER_VALIDATE_EMAIL) !== false;

        if ($isEmpty) {
            return $this->emptyError;
        };

        if ($isDomainBlacklisted) {
            return $this->blacklistedError;
        };

        if (!$isFormatValid) {
            return $this->invalidError;
        };

        return true;
    }

    public function getAllSubscriptions() {
        $conn = $this->db->OpenConnection();
        $stmt = $conn->prepare('SELECT * FROM `subscriptions`');
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            return $stmt->fetchAll();
        }
        $this->db->CloseConnection($conn);

        return false;
    }

    public function insertSubscription($subscription) {
        return $this->CheckSubscriptionExists($subscription) ? 'Email in use' : $this->AddSubscription($subscription);
    }
    
    public function addSubscription($subscription) {
        $conn = $this->db->OpenConnection();
        $stmt = $conn->prepare('INSERT INTO `subscriptions` (`email`, `date_registered`) VALUES (?, ?);');
        $currentDate = $date = date('Y-m-d H:i:s', time());
        $result = $stmt->execute([$subscription, $currentDate]);
        $this->db->CloseConnection($conn);
        
        return true;
    }
    
    public function checkSubscriptionExists($subscription) {
        $conn = $this->db->OpenConnection();
        $stmt = $conn->prepare('SELECT * FROM `subscriptions` WHERE `email` = ?');
        $stmt->execute([$subscription]);
        if ($stmt->rowCount() > 0) {
            return true;
        }
        $this->db->CloseConnection($conn);
        
        return false;
    }
    
    public function delete($id) {
        $conn = $this->db->OpenConnection();
        $stmt = $conn->prepare('DELETE FROM `subscriptions` WHERE `id` = ?');
        $result = $stmt->execute([$id]);
        $this->db->CloseConnection($conn);

        return $result ? true : false;
    }

    private function endsWith( $haystack, $needle ) {
        $length = strlen( $needle );
        if( !$length ) {
            return true;
        }
        return substr( $haystack, -$length ) === $needle;
    }
}