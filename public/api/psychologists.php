<?php

require __DIR__ . '/../../api/helpers.php';

const MODALITIES = ['Online', 'Presencial', 'Online y presencial'];

$archivoNuevos = __DIR__ . '/../../api/data/psychologists.json';

function obtenerTodos(string $archivoNuevos): array
{
    $iniciales = require __DIR__ . '/../../api/data/psychologists.php';
    return array_merge($iniciales, leerArchivoJson($archivoNuevos));
}
function texto($valor): string
{
    return is_string($valor) ? trim($valor) : '';
}

function validar(array $datos): array
{
    $errores = [];

    $name = texto($datos['name'] ?? null);
    if ($name === '') {
        $errores['name'] = 'El nombre es obligatorio.';
    } elseif (mb_strlen($name) < 3) {
        $errores['name'] = 'El nombre debe tener al menos 3 caracteres.';
    }

    if (texto($datos['specialty'] ?? null) === '') {
        $errores['specialty'] = 'La especialidad es obligatoria.';
    }

    if (!in_array($datos['modality'] ?? '', MODALITIES, true)) {
        $errores['modality'] = 'La modalidad debe ser Online, Presencial u Online y presencial.';
    }

    if (texto($datos['city'] ?? null) === '') {
        $errores['city'] = 'La ciudad es obligatoria.';
    }

    $price = $datos['price'] ?? null;
    if (!is_numeric($price) || $price <= 0) {
        $errores['price'] = 'El precio debe ser un número mayor a 0.';
    }

    return $errores;
}

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    $psicologos = obtenerTodos($archivoNuevos);

    if (!isset($_GET['id'])) {
        responder(200, $psicologos);
    }

    $id = (int) $_GET['id'];
    foreach ($psicologos as $psicologo) {
        if ($psicologo['id'] === $id) {
            responder(200, $psicologo);
        }
    }

    responder(404, ['error' => "No existe un psicólogo con id $id."]);
}

if ($metodo === 'POST') {
    $datos = leerJson();
    if ($datos === null) {
        responder(422, ['error' => 'El cuerpo de la petición debe ser un JSON válido.']);
    }

    $errores = validar($datos);
    if (count($errores) > 0) {
        responder(422, ['error' => 'Los datos no son válidos.', 'fields' => $errores]);
    }
    $ids = array_column(obtenerTodos($archivoNuevos), 'id');
    $nuevo = [
        'id' => max($ids) + 1,
        'name' => texto($datos['name']),
        'specialty' => texto($datos['specialty']),
        'modality' => $datos['modality'],
        'city' => texto($datos['city']),
        'price' => $datos['price'] + 0,
    ];

    $nuevos = leerArchivoJson($archivoNuevos);
    $nuevos[] = $nuevo;

    if (!guardarArchivoJson($archivoNuevos, $nuevos)) {
        responder(500, ['error' => 'No se pudo guardar el psicólogo.']);
    }

    responder(201, $nuevo);
}

header('Allow: GET, POST');
responder(405, ['error' => "Método $metodo no permitido."]);
