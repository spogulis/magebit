<?php
    $subscribeSuccessImg = isset($params['subscribeSuccessImg']) ? $params['subscribeSuccessImg'] : '';
?>

<main class="main">
    <div class="form-wrapper">
        <img id="subscribe-sucess-img" src="<?php echo $subscribeSuccessImg;?>" alt="Subscribe success image">
        <span class="subscribe-title"><?php echo $params['title']?></span>
        <span class="subscribe-subtitle subscribed-subtitle"><?php echo $params['subtitle'];?></span>
        <div class="social-wrapper">
            <i class="lab la-facebook-f"></i>
            <i class="lab la-instagram"></i>
            <i class="lab la-twitter"></i>
            <i class="lab la-youtube"></i>
        </div>
    </div>
</main>