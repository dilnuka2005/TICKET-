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

$code = $data['code'];

// Check if code exists and is not used
$stmt = $conn->prepare("SELECT * FROM tickets WHERE code = ? AND used = FALSE");
$stmt->bind_param("s", $code);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $ticket = $result->fetch_assoc();
    $name = $ticket['name'];

    // Mark ticket as used
    $stmt = $conn->prepare("UPDATE tickets SET used = TRUE WHERE code = ?");
    $stmt->bind_param("s", $code);
    $stmt->execute();

    echo json_encode([
        'success' => true,
        'message' => 'Ticket validated successfully.',
        'name' => $name
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid or already used ticket code.'
    ]);
}

$stmt->close();
$conn->close();
?>