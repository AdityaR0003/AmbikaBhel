<?php
require_once 'config.php';

header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];

// Parse URL path to get the ID if it exists
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

try {
    switch ($method) {
        case 'GET':
            $stmt = $pdo->query('SELECT * FROM items ORDER BY id ASC');
            echo json_encode($stmt->fetchAll());
            break;

        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            $name = $input['name'];
            $unit = $input['unit'];

            $stmt = $pdo->prepare('INSERT INTO items (name, quantity, unit) VALUES (?, 0, ?)');
            $stmt->execute([$name, $unit]);
            
            $newId = $pdo->lastInsertId();
            $stmt = $pdo->prepare('SELECT * FROM items WHERE id = ?');
            $stmt->execute([$newId]);
            echo json_encode($stmt->fetch());
            break;

        case 'PUT':
            if ($id) {
                $input = json_decode(file_get_contents('php://input'), true);
                if(isset($input['quantity'])) {
                    $quantity = $input['quantity'];
                    $stmt = $pdo->prepare('UPDATE items SET quantity = ? WHERE id = ?');
                    $stmt->execute([$quantity, $id]);
                    echo json_encode(["success" => true]);
                } else {
                    http_response_code(400);
                    echo json_encode(["error" => "Missing quantity"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(["error" => "Missing ID"]);
            }
            break;

        case 'DELETE':
            if ($id) {
                $stmt = $pdo->prepare('DELETE FROM items WHERE id = ?');
                $stmt->execute([$id]);
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
