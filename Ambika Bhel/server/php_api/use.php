<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['itemId']) || !isset($input['quantity'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing itemId or quantity"]);
    exit;
}

$itemId = intval($input['itemId']);
$quantity = floatval($input['quantity']);

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare('SELECT * FROM items WHERE id = ? FOR UPDATE');
    $stmt->execute([$itemId]);
    $item = $stmt->fetch();

    if (!$item || floatval($item['quantity']) < $quantity) {
        $pdo->rollBack();
        http_response_code(400);
        echo json_encode(["error" => "Not enough stock"]);
        exit;
    }

    $stmt = $pdo->prepare('UPDATE items SET quantity = quantity - ? WHERE id = ?');
    $stmt->execute([$quantity, $itemId]);

    $stmt = $pdo->prepare('INSERT INTO logs (itemName, quantityUsed) VALUES (?, ?)');
    $stmt->execute([$item['name'], $quantity]);

    $pdo->commit();
    echo json_encode(["success" => true]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
