<?php 
    $error = isset($params['error']) ? $params['error'] : '';
?>

<main class="main">
    <div class="form-wrapper">
        <span class="subscribe-title"><?php echo $params['title']?></span>
        <span class="subscribe-subtitle"><?php echo $params['subtitle'];?></span>
        <form id="subscription-form" method="POST" action="/subscribe/post" class="subscribe-form">
            <div class="email-wrapper">
                <input 
                    name="email" 
                    id="email" 
                    placeholder="Type your email address here..."
                    autofocus
                    >
                <button type="submit" id="submit-btn">
                    <i id="submit-btn-icon" class="email-next-arrow las la-long-arrow-alt-right"></i>
                </button>
            </div>
            <div class="error-wrapper">
                <?php if (strlen($error) > 0) {
                    echo '<span class="error-msg">' . $error . '</span>';
                }
                ?>

            </div>
            <div class="tos-wrapper">
            <label class="checkbox-container">
                <span class="tos-desc">I agree to <a href="#">terms of service</a></span>
                <input id="tos-checkbox" type="checkbox" required>
                <span class="checkmark"></span>
            </label>
            </div>
            <div class="social-wrapper">
                <i class="lab la-facebook-f"></i>
                <i class="lab la-instagram"></i>
                <i class="lab la-twitter"></i>
                <i class="lab la-youtube"></i>
            </div>
        </form>
    </div>
</main>