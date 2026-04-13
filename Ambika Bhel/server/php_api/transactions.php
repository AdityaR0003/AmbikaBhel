<?php
require_once 'config.php';

header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

try {
    switch ($method) {
        case 'GET':
            $stmt = $pdo->query('SELECT * FROM transactions ORDER BY date DESC');
            echo json_encode($stmt->fetchAll());
            break;

        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare('INSERT INTO transactions (type, amount, description, mode) VALUES (?, ?, ?, ?)');
            $stmt->execute([
                $input['type'], 
                $input['amount'], 
                $input['description'], 
                $input['mode'] ?? 'Cash'
            ]);
            
            $newId = $pdo->lastInsertId();
            $stmt = $pdo->prepare('SELECT * FROM transactions WHERE id = ?');
            $stmt->execute([$newId]);
            echo json_encode($stmt->fetch());
            break;

        case 'PUT':
            if ($id) {
                $input = json_decode(file_get_contents('php://input'), true);
                $stmt = $pdo->prepare('UPDATE transactions SET type = ?, amount = ?, description = ?, mode = ? WHERE id = ?');
                $stmt->execute([
                    $input['type'], 
                    $input['amount'], 
                    $input['description'], 
                    $input['mode'], 
                    $id
                ]);
                echo json_encode(["success" => true]);
            } else {
                http_response_code(400);
                echo json_encode(["error" => "Missing ID"]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
