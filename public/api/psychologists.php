<?php

// API REST del recurso "psicólogos" (CRUD con PDO y MySQL).
//
// GET    psychologists.php             lista (200)
// GET    psychologists.php?search=ana  lista filtrada por nombre o especialidad (200)
// GET    psychologists.php?id=3        uno (200 / 404)
// POST   psychologists.php             crear (201 / 422)
// PUT    psychologists.php?id=3        actualizar (200 / 404 / 422)
// DELETE psychologists.php?id=3        eliminar (204 / 404)

require __DIR__ . '/../../api/helpers.php';
require __DIR__ . '/../../api/db.php';

const MODALITIES = ['Online', 'Presencial', 'Online y presencial'];
const COLUMNS = 'id, name, specialty, modality, city, price';

function texto($valor): string
{
    return is_string($valor) ? trim($valor) : '';
}

// DECIMAL llega de MySQL como texto ("650.00"): lo convertimos a número.
function formatear(array $fila): array
{
    $fila['id'] = (int) $fila['id'];
    $fila['price'] = (float) $fila['price'];
    return $fila;
}

// Regresa [datos limpios, errores]. El front ya valida, pero se puede saltar.
function validar(?array $datos): array
{
    if ($datos === null) {
        responder(422, ['error' => 'El cuerpo de la petición debe ser un JSON válido.']);
    }

    $limpios = [
        'name' => texto($datos['name'] ?? null),
        'specialty' => texto($datos['specialty'] ?? null),
        'modality' => texto($datos['modality'] ?? null),
        'city' => texto($datos['city'] ?? null),
        'price' => $datos['price'] ?? null,
    ];

    $errores = [];

    if ($limpios['name'] === '') {
        $errores['name'] = 'El nombre es obligatorio.';
    } elseif (mb_strlen($limpios['name']) < 3) {
        $errores['name'] = 'El nombre debe tener al menos 3 caracteres.';
    } elseif (mb_strlen($limpios['name']) > 100) {
        $errores['name'] = 'El nombre no puede tener más de 100 caracteres.';
    }

    if ($limpios['specialty'] === '') {
        $errores['specialty'] = 'La especialidad es obligatoria.';
    } elseif (mb_strlen($limpios['specialty']) > 100) {
        $errores['specialty'] = 'La especialidad no puede tener más de 100 caracteres.';
    }

    if (!in_array($limpios['modality'], MODALITIES, true)) {
        $errores['modality'] = 'La modalidad debe ser Online, Presencial u Online y presencial.';
    }

    if ($limpios['city'] === '') {
        $errores['city'] = 'La ciudad es obligatoria.';
    } elseif (mb_strlen($limpios['city']) > 100) {
        $errores['city'] = 'La ciudad no puede tener más de 100 caracteres.';
    }

    if (!is_numeric($limpios['price']) || $limpios['price'] <= 0 || $limpios['price'] >= 1000000) {
        $errores['price'] = 'El precio debe ser un número mayor a 0 y menor a 1,000,000.';
    } else {
        $limpios['price'] = (float) $limpios['price'];
    }

    if (count($errores) > 0) {
        responder(422, ['error' => 'Los datos no son válidos.', 'fields' => $errores]);
    }

    return $limpios;
}

// Todo lo que llega por la URL es texto: lo convertimos a entero.
function idDeLaUrl(): int
{
    $id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);

    if ($id === false || $id === null) {
        responder(400, ['error' => 'Falta un id válido en la URL, por ejemplo ?id=3.']);
    }

    return $id;
}

function buscarPorId(PDO $pdo, int $id): ?array
{
    $stmt = $pdo->prepare('SELECT ' . COLUMNS . ' FROM psychologists WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $fila = $stmt->fetch();

    return $fila ? formatear($fila) : null;
}

$metodo = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = conectar();

    switch ($metodo) {
        case 'GET':
            // Uno
            if (isset($_GET['id'])) {
                $id = idDeLaUrl();
                $psicologo = buscarPorId($pdo, $id);

                if ($psicologo === null) {
                    responder(404, ['error' => "No existe un psicólogo con id $id."]);
                }

                responder(200, $psicologo);
            }

            // Lista, opcionalmente filtrada
            $buscar = texto($_GET['search'] ?? null);

            if ($buscar !== '') {
                $stmt = $pdo->prepare(
                    'SELECT ' . COLUMNS . ' FROM psychologists
                     WHERE name LIKE :nombre OR specialty LIKE :especialidad
                     ORDER BY id'
                );
                $stmt->execute(['nombre' => "%$buscar%", 'especialidad' => "%$buscar%"]);
            } else {
                $stmt = $pdo->prepare('SELECT ' . COLUMNS . ' FROM psychologists ORDER BY id');
                $stmt->execute();
            }

            responder(200, array_map('formatear', $stmt->fetchAll()));

        case 'POST':
            $datos = validar(leerJson());

            $stmt = $pdo->prepare(
                'INSERT INTO psychologists (name, specialty, modality, city, price)
                 VALUES (:name, :specialty, :modality, :city, :price)'
            );
            $stmt->execute($datos);

            // lastInsertId() es el id que generó AUTO_INCREMENT
            responder(201, ['id' => (int) $pdo->lastInsertId()] + $datos);

        case 'PUT':
            $id = idDeLaUrl();

            // rowCount() vale 0 también si se guardan los mismos valores,
            // por eso revisamos antes que exista.
            if (buscarPorId($pdo, $id) === null) {
                responder(404, ['error' => "No existe un psicólogo con id $id."]);
            }

            $datos = validar(leerJson());

            $stmt = $pdo->prepare(
                'UPDATE psychologists
                 SET name = :name, specialty = :specialty, modality = :modality,
                     city = :city, price = :price
                 WHERE id = :id'
            );
            $stmt->execute($datos + ['id' => $id]);

            responder(200, ['id' => $id] + $datos);

        case 'DELETE':
            $id = idDeLaUrl();

            $stmt = $pdo->prepare('DELETE FROM psychologists WHERE id = :id');
            $stmt->execute(['id' => $id]);

            if ($stmt->rowCount() === 0) {
                responder(404, ['error' => "No existe un psicólogo con id $id."]);
            }

            // 204: eliminado, sin cuerpo en la respuesta
            http_response_code(204);
            exit;

        default:
            header('Allow: GET, POST, PUT, DELETE');
            responder(405, ['error' => "Método $metodo no permitido."]);
    }
} catch (PDOException $e) {
    // El detalle técnico se queda en el log del servidor, nunca se le muestra al cliente.
    error_log($e->getMessage());
    responder(500, ['error' => 'Error interno del servidor.']);
}
