<?php

function responder(int $status, $data): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function leerJson(): ?array
{
    $datos = json_decode(file_get_contents('php://input'), true);
    return is_array($datos) ? $datos : null;
}

function leerArchivoJson(string $ruta): array
{
    if (!file_exists($ruta)) {
        return [];
    }

    $datos = json_decode(file_get_contents($ruta), true);
    return is_array($datos) ? $datos : [];
}

function guardarArchivoJson(string $ruta, array $datos): bool
{
    $json = json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    return file_put_contents($ruta, $json, LOCK_EX) !== false;
}
