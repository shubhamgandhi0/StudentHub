<?php
session_start();

header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    'logged_in' => !empty($_SESSION['logged_in']),
    'full_name' => $_SESSION['full_name'] ?? ''
]);
?>
