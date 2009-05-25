<?php
    require('remote/init.php');
    require('remote/app/controllers/users.php');

    // Get Request
    $request = new Request(array('restful' => true));

    // Get Controller
    $controller = new Users();

    // Dispatch request
    echo $controller->dispatch($request);

?>