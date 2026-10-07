<?php
require_once __DIR__ . '/form_helpers.php';
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    show_result('Invalid request', 'Please submit the registration form using POST.', false, 'reg.html');
    exit;
}

$fullName = clean_input((string) ($_POST['full_name'] ?? ''));
$username = clean_input((string) ($_POST['username'] ?? ''));
$email = clean_input((string) ($_POST['email'] ?? ''));
$phone = clean_input((string) ($_POST['phone'] ?? ''));
$course = clean_input((string) ($_POST['course'] ?? ''));
$year = clean_input((string) ($_POST['year'] ?? ''));
$gender = clean_input((string) ($_POST['gender'] ?? ''));
$password = (string) ($_POST['password'] ?? '');
$confirmPassword = (string) ($_POST['confirm_password'] ?? '');
$termsAccepted = isset($_POST['terms']) && $_POST['terms'] === 'accepted';

if (!preg_match('/^[A-Za-z ]{2,80}$/', $fullName)) {
    show_result('Registration failed', 'Name must contain 2 to 80 letters and spaces only.', false, 'reg.html');
    exit;
}

if (!preg_match('/^[A-Za-z0-9_]{3,20}$/', $username)) {
    show_result('Registration failed', 'Username must be 3 to 20 characters and contain only letters, numbers, or underscores.', false, 'reg.html');
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    show_result('Registration failed', 'Please enter a valid email address.', false, 'reg.html');
    exit;
}

if (!preg_match('/^\d{10}$/', $phone)) {
    show_result('Registration failed', 'Mobile number must contain exactly 10 digits.', false, 'reg.html');
    exit;
}

if (!in_array($course, ['B.Tech Computer Science', 'B.Tech Information Technology', 'B.Tech Data Science', 'B.Tech Cyber Security'], true)) {
    show_result('Registration failed', 'Please select a valid course.', false, 'reg.html');
    exit;
}

if (!in_array($year, ['1', '2', '3', '4'], true) || !in_array($gender, ['Male', 'Female', 'Other'], true)) {
    show_result('Registration failed', 'Please select a valid year and gender.', false, 'reg.html');
    exit;
}

if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/', $password)) {
    show_result('Registration failed', 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.', false, 'reg.html');
    exit;
}

if ($password !== $confirmPassword) {
    show_result('Registration failed', 'Passwords do not match.', false, 'reg.html');
    exit;
}

if (!$termsAccepted) {
    show_result('Registration failed', 'You must accept the terms and conditions.', false, 'reg.html');
    exit;
}

$file = storage_file('registrations.json');
$records = read_records($file);
foreach ($records as $record) {
    if (($record['username'] ?? '') === $username || ($record['email'] ?? '') === $email) {
        show_result('Registration failed', 'That username or email is already registered.', false, 'reg.html');
        exit;
    }
}

$record = [
    'full_name' => $fullName,
    'username' => $username,
    'email' => $email,
    'phone' => $phone,
    'course' => $course,
    'year' => $year,
    'gender' => $gender,
    'password' => password_hash($password, PASSWORD_DEFAULT),
    'created_at' => date('c')
];

$passwordHash = $record['password'];
$studentStatement = $connection->prepare('INSERT INTO students (full_name, username, email, phone, course, year, gender, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
$studentStatement->bind_param('sssssiss', $fullName, $username, $email, $phone, $course, $year, $gender, $passwordHash);

if (!$studentStatement->execute()) {
    show_result('Registration failed', 'The account could not be saved in the database. Please try again.', false, 'reg.html');
    exit;
}
$studentStatement->close();

if (!save_record($file, $record)) {
    show_result('Registration failed', 'The record could not be saved. Please try again.', false, 'reg.html');
    exit;
}

show_result('Registration successful', 'Your account details were saved successfully. Use the link below to open your dashboard.', true, 'dash.html');
?>
