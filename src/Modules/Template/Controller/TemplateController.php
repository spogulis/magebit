<?php

Namespace Magebit\Modules\Template\Controller;

class TemplateController {
    public function loadTemplate($params) {
        $templatePath = constant('PROJECTROOT') . '/Views/Templates';

        ob_start();
        include_once($templatePath . '/' . $params['template'] . '.php');
        $template = ob_get_clean();
        
        include_once($templatePath . '/skeleton.php');
    }
}