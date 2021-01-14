<?php

Namespace Magebit\Modules\Router\Controller;

Use Magebit\Modules\Home\Controller\HomeController;
Use Magebit\Modules\Subscribe\Controller\SubscribeController;

class RouterController {
    public function __construct(){
        $this->redirect();
    }

    protected function redirect() {
        $request = $_SERVER['REQUEST_URI'];
        $requestParams = '';
        // if (strpos($request, '/subscribe/post') === 0) {
        //     $request = '/subscribe/post';
        // }
        $request = (strpos($request, '/subscribe/post') === 0) ? '/subscribe/post' : $request;
        $request = (strpos($request, '/subscribe?') === 0) ? '/subscribe' : $request;
        
        switch ($request) {
            // case '/':
            //     $home  = new HomeController();
            //     $home->loadView();
            //     break;
            // case '' :
            //     $home  = new HomeController();
            //     $home->loadView();
            //     break;
            case '/subscribed':
                $subscribe = new SubscribeController();
                $subscribe->loadSuccessView();
                break;

            case '/subscribe':
                $subscribe = new SubscribeController();
                $subscribe->loadSubscribeView();
                break;

            case '/subscribe/post':
                $subscribe = new SubscribeController();
                $response = $subscribe->insertSubscription();
                if ($response === true) {
                    header('Location: ' . $_SERVER['HTTP_ORIGIN'] . '/subscribed');
                    break;
                }

                header('Location: ' . $_SERVER['HTTP_ORIGIN'] . '/subscribe?error=' . urlencode($response));
                break;

            case '/subscriptions':
                $subscribe = new SubscribeController();
                $subscribe->loadResultsView();
                break;
                
            case '/subscriptions/getall':
                $subscribe = new SubscribeController();
                return $subscribe->getAll();
                break;

            case '/subscription/delete':
                $subscribe = new SubscribeController();
                $subscribe->delete();

            default:
                break;
        }
    }
}