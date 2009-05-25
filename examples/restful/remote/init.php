<?php
    session_start();

    // base framework
    require(dirname(__FILE__).'/lib/session_db.php');
    require(dirname(__FILE__).'/lib/application_controller.php');
    require(dirname(__FILE__).'/lib/model.php');
    require(dirname(__FILE__).'/lib/request.php');
    require(dirname(__FILE__).'/lib/response.php');

    // require /models
    require(dirname(__FILE__).'/app/models/user.php');

    // Fake a database connection using _SESSION
    $dbh = new DB();

?>
