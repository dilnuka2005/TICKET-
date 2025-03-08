<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "event_ticketing";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);

$name = $data['name'];
$nic = $data['nic'];
$phone = $data['phone'];
$email = $data['email'];

// Check if NIC or Name already exists
$stmt = $conn->prepare("SELECT * FROM tickets WHERE nic = ? OR name = ?");
$stmt->bind_param("ss", $nic, $name);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'You have already generated a ticket.']);
    exit;
}

// Generate unique code
$code = substr(str_shuffle("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"), 0, 6);

// Insert into database
$stmt = $conn->prepare("INSERT INTO tickets (name, nic, phone, email, code) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $name, $nic, $phone, $email, $code);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'code' => $code]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error generating ticket.']);
}

$stmt->close();
$conn->close();
?>