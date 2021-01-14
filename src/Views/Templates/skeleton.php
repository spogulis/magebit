<!DOCTYPE HTML>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo $params['title']; ?></title>
    <link href="css/main.css" type="text/css" rel="stylesheet" />
</head>
    <body>
        <div class="page-wrapper">
            <header>
                <img id="logo-navbar" src="<?php echo $params['logo'];?>" alt="Logo">
                <img id="logo-navbar-text" src="<?php echo $params['logoText'];?>" alt="Pineapple">
                <nav>
                    <ul class="navbar">
                        <a href="#"><li><span>About</span></li></a>
                        <a href="#"><li><span>How it works</span></li></a>
                        <a href="#"><li><span>Contact</span></li></a>
                    </ul>
                </nav>
            </header>
            <img 
                src="<?php echo $params['bgImageMobilePath'];?>" 
                alt="Background image"
                id="bg-image-mobile">
                <img 
                src="<?php echo $params['bgImageDesktopPath'];?>" 
                alt="Background image"
                id="bg-image-desktop">
            <div id="template">
                <?php echo $template; ?>
            </div>
            <footer>

            </footer>
        </div>
    </body>
</html>

<script src="js/vendor/jquery.min.js" deferred></script>
<script src="js/vendor/axios.min.js" deferred></script>
<script src="js/main.js" deferred></script>