<?php
    // from the form
    //$email = trim(strip_tags($_POST['email']));
    //$message = htmlentities($_POST['message']);

    $email = 'jacksong18@gmail.com';
    $message = 'txt';

    // set here
    $subject = "From php";
    $to = $email;

    $body = <<<HTML
$message
HTML;

    $headers = "From: japanchinaplanco@gmail.com\r\n";
    $headers .= "Content-type: text/html\r\n";

    // send the email
    mail($to, $subject, $body, $headers);

    // redirect afterwords, if needed
    header('Location: thanks.html');
?>