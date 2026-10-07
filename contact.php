<?php
require_once __DIR__ . '/form_helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    show_result('Invalid request', 'Please submit the contact form using POST.', false, 'contact.html');
    exit;
}

$name = clean_input((string) ($_POST['name'] ?? ''));
$email = clean_input((string) ($_POST['email'] ?? ''));
$message = clean_input((string) ($_POST['message'] ?? ''));

if ($name === '' || strlen($name) > 80) {
    show_result('Message not sent', 'Please enter a name up to 80 characters.', false, 'contact.html');
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    show_result('Message not sent', 'Please enter a valid email address.', false, 'contact.html');
    exit;
}

if ($message === '' || strlen($message) > 1000) {
    show_result('Message not sent', 'Please enter a message up to 1000 characters.', false, 'contact.html');
    exit;
}

$record = [
    'name' => $name,
    'email' => $email,
    'message' => $message,
    'submitted_at' => date('c')
];

if (!save_record(storage_file('contacts.json'), $record)) {
    show_result('Message not sent', 'The message could not be saved. Please try again.', false, 'contact.html');
    exit;
}

show_result('Message sent', 'Thank you. Your message has been saved successfully.', true, 'contact.html');
?>
