<?php $data = isset($params['data']) ? $params['data'] : []; ?>
<main class="main">
    <div class="form-wrapper">
        <span class="subscribe-title"><?php echo $params['title']?></span>
        <div class="subscription-results-wrapper">
            <div class="email-search">
                <input id="email-search" type="text" placeholder="Search email">
            </div>
            <div class="email-filters">
                
            </div>
            <table id="data">
                <thead>
                    <throw>
                        <th id="email-th">Email
                        <span class="material-icons d-none">
                                keyboard_arrow_down
                            </span>
                            <span class="material-icons d-none">
                                keyboard_arrow_up
                            </span>
                        </th>
                        <th id="date-registered-th" class="ascending">Date registered
                            <span class="material-icons">
                                keyboard_arrow_down
                            </span>
                            <span class="material-icons d-none">
                                keyboard_arrow_up
                            </span>
                        </th>
                        
                    </throw>
                </thead>
                <?php 
                    foreach($data as $subscription) {
                        echo '<tr class="filtered">
                                <td>' . $subscription['email'] . '</td>
                                <td>' . $subscription['date_registered'] . '</td>
                                <td>
                                    <button type="button" subid="' . $subscription['id'] . '" onclick="deleteSubscription(this)">Delete</button>
                                </td>
                            </tr>';
                    };
                ?>
            </table>
        </div>
    </div>
</main>