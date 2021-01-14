<?php

Namespace Magebit\Modules\Subscribe\Controller;

Use Magebit\Modules\Template\Controller\TemplateController;
Use Magebit\Model\Subscription;
Use Magebit\Model\Database;

class SubscribeController {
    private $subsription;
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

    public function insertSubscription() {
        $this->subscription = new Subscription();
        $emailParam = isset($_REQUEST['email']);
        $email = isset($_REQUEST['email']) == true ? $_REQUEST['email'] : '';
        
        $emailValid = $this->subscription->validateEmail($email);
        if ($emailValid === true) {
            $insertSuccess = $this->subscription->insertSubscription($email);

            if ($insertSuccess === true) {
                return true;
            }
            
            return $insertSuccess;
        }

        return $emailValid;
    }

    public function LoadSubscribeView() {
        $template = new TemplateController();
        $error = isset($_REQUEST['error']) ? $_REQUEST['error'] : '';
        $params = [
            'title' => 'Subscribe', 
            'template' => 'SubscribeTemplate',
            'bgImageMobilePath' => 'images/image_summer.png',
            'bgImageDesktopPath' => 'images/image_summer_large.png',
            'logo' => 'images/logo_pineapple.svg',
            'logoText' => 'images/pineapple..png',
            'title' => 'Subscribe to newsletter',
            'subtitle' => 'Subscribe to our newsletter and get 10% discount on pineapple glasses.',
            'error' => $error
        ];
        $template->loadTemplate($params);
    }

    public function loadSuccessView() {
        $template = new TemplateController();
        $params = [
            'title' => 'Thanks for subscribing!', 
            'template' => 'SubscribeSuccessTemplate',
            'bgImageMobilePath' => 'images/image_summer.png',
            'bgImageDesktopPath' => 'images/image_summer_large.png',
            'logo' => 'images/logo_pineapple.svg',
            'logoText' => 'images/pineapple..png',
            'subtitle' => 'You have successfully subscribed to our email listing. Check your email for the discount code.',
            'subscribeSuccessImg' => 'images/union.png'
        ];
        $template->LoadTemplate($params);
    }

    public function loadResultsView() {
        $template = new TemplateController();
        $this->subscription = new Subscription();
        $data = $this->subscription->getAllSubscriptions();
        
        $params = [
            'title' => 'List of subscriptions', 
            'logo' => 'images/logo_pineapple.svg',
            'logoText' => 'images/pineapple..png',
            'template' => 'SubscribeResultsTemplate',
            'bgImageMobilePath' => 'images/image_summer.png',
            'bgImageDesktopPath' => 'images/image_summer_large.png',
            'data' => $data ? $data : []
        ];
        $template->loadTemplate($params);
    }
    
    public function delete() {
        $data = json_decode(file_get_contents("php://input"), true);
        $this->subscription = new Subscription();
        $this->subscription->delete($data['id']);
    }

    public function getAll() {
        $this->subscription = new Subscription();
        echo json_encode($this->subscription->getAllSubscriptions());
    }

    
}
