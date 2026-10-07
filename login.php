<?php
require_once __DIR__ . '/form_helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    show_result('Invalid request', 'Please submit the login form using POST.', false, 'login.html');
    exit;
}

$username = clean_input((string) ($_POST['username'] ?? ''));
$password = (string) ($_POST['password'] ?? '');

if (!preg_match('/^[A-Za-z0-9_]{3,20}$/', $username) || $password === '') {
    show_result('Login failed', 'Enter a valid username and password.', false, 'login.html');
    exit;
}

$records = read_records(storage_file('registrations.json'));
$authenticatedUser = null;
foreach ($records as $record) {
    if (($record['username'] ?? '') === $username && password_verify($password, (string) ($record['password'] ?? ''))) {
        $authenticatedUser = $record;
        break;
    }
}

if ($authenticatedUser === null) {
    show_result('Login failed', 'Username or password is incorrect.', false, 'login.html');
    exit;
}

$remember = isset($_POST['remember']) && $_POST['remember'] === '1';
if ($remember) {
    session_set_cookie_params([
        'lifetime' => 60 * 60 * 24 * 30,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
}
session_start();
$_SESSION['username'] = $authenticatedUser['username'];
$_SESSION['full_name'] = $authenticatedUser['full_name'] ?? $authenticatedUser['username'];
$_SESSION['logged_in'] = true;
header('Location: dash.html');
exit;
?>
