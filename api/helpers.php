<?php

function responder(int $status, $data): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// PHP no llena $_POST con JSON (ni con PUT o DELETE): el cuerpo se lee de php://input.
function leerJson(): ?array
{
    $datos = json_decode(file_get_contents('php://input'), true);
    return is_array($datos) ? $datos : null;
}
