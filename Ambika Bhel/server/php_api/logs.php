<?php
require_once 'config.php';

header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

try {
    switch ($method) {
        case 'GET':
            $stmt = $pdo->query('SELECT * FROM logs ORDER BY date DESC');
            echo json_encode($stmt->fetchAll());
            break;

        case 'PUT':
            if ($id) {
                $input = json_decode(file_get_contents('php://input'), true);
                if (!isset($input['quantityUsed'])) {
                    http_response_code(400);
                    echo json_encode(["error" => "quantityUsed is missing"]);
                    exit;
                }
                
                $quantityUsed = floatval($input['quantityUsed']);

                $pdo->beginTransaction();
                
                // Get current log
                $stmt = $pdo->prepare('SELECT * FROM logs WHERE id = ? FOR UPDATE');
                $stmt->execute([$id]);
                $log = $stmt->fetch();
                
                if (!$log) {
                    $pdo->rollBack();
                    http_response_code(404);
                    echo json_encode(["error" => "Log not found"]);
                    exit;
                }
                
                $diff = $quantityUsed - floatval($log['quantityUsed']);
                
                // Get item
                $stmt = $pdo->prepare('SELECT * FROM items WHERE name = ? FOR UPDATE');
                $stmt->execute([$log['itemName']]);
                $item = $stmt->fetch();
                
                if ($item) {
                    if (floatval($item['quantity']) - $diff < 0) {
                        $pdo->rollBack();
                        http_response_code(400);
                        echo json_encode(["error" => "Not enough stock to update this usage"]);
                        exit;
                    }
                    $stmt = $pdo->prepare('UPDATE items SET quantity = quantity - ? WHERE id = ?');
                    $stmt->execute([$diff, $item['id']]);
                }
                
                $stmt = $pdo->prepare('UPDATE logs SET quantityUsed = ? WHERE id = ?');
                $stmt->execute([$quantityUsed, $id]);
                
                $pdo->commit();
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
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
