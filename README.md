# programacion-web-2026-uabcs

## Estructura

```
api/                     # privado: no se puede abrir desde el navegador
  helpers.php            # responder() y funciones para leer/guardar JSON
  data/
    psychologists.php    # arreglo inicial de psicólogos
    psychologists.json   # psicólogos registrados desde el formulario
public/                  # raíz del servidor web
  index.html
  pages/ scripts/ styles/ assets/
  vendor/sweetalert2/    # copia del build ESM de SweetAlert2
  api/
    psychologists.php    # endpoint de la API
```

## API de psicólogos

| Método | URL | Respuesta |
|---|---|---|
| GET | `api/psychologists.php` | 200 con la lista completa |
| GET | `api/psychologists.php?id=N` | 200 con un psicólogo, o 404 si no existe |
| POST | `api/psychologists.php` | 201 con el psicólogo creado, o 422 si los datos son inválidos |
| Otro | | 405 |

Campos: `name` (mínimo 3 caracteres), `specialty`, `modality` (`Online`, `Presencial` u `Online y presencial`), `city` y `price` (número mayor a 0). El `id` lo asigna el servidor.

## Cómo correrlo con XAMPP

1. Crear un enlace en `htdocs` que apunte a `public/` (en cmd, una sola vez):
   ```
   mklink /J C:\xampp\htdocs\mente "<ruta del proyecto>\public"
   ```
2. Iniciar Apache desde el panel de XAMPP.
3. Abrir http://localhost/mente/

Sin Apache también funciona el servidor integrado de PHP:

```
C:\xampp\php\php.exe -S localhost:8000 -t public
```
