# programacion-web-2026-uabcs

## Estructura

```
api/                     # privado: no se puede abrir desde el navegador
  config.example.php     # plantilla de credenciales (sí va a Git)
  config.php             # credenciales reales (NO va a Git)
  db.php                 # conectar(): conexión PDO a MySQL
  helpers.php            # responder() y leerJson()
database/
  mente.sql              # crea la base "mente", la tabla y los datos iniciales
public/                  # raíz del servidor web
  index.html
  pages/ scripts/ styles/ assets/
  vendor/sweetalert2/    # copia del build ESM de SweetAlert2
  api/
    psychologists.php    # endpoint CRUD de la API
pruebas.http             # pruebas de cada endpoint (extensión REST Client)
```

## API de psicólogos (CRUD)

| Método | URL | Acción | Respuesta |
|---|---|---|---|
| GET | `api/psychologists.php` | Listar | 200 con la lista |
| GET | `api/psychologists.php?search=texto` | Buscar por nombre o especialidad | 200 con la lista filtrada |
| GET | `api/psychologists.php?id=N` | Ver uno | 200, o 404 si no existe |
| POST | `api/psychologists.php` | Crear (`INSERT`) | 201 con el psicólogo creado, o 422 |
| PUT | `api/psychologists.php?id=N` | Actualizar (`UPDATE`) | 200 con los datos nuevos, 404 o 422 |
| DELETE | `api/psychologists.php?id=N` | Eliminar (`DELETE`) | 204 sin cuerpo, o 404 |
| Otro | | | 405 |

- Campos (JSON en el cuerpo de POST y PUT): `name` (3 a 100 caracteres), `specialty`, `modality` (`Online`, `Presencial` u `Online y presencial`), `city` y `price` (número mayor a 0). El `id` lo asigna MySQL.
- Un `id` que no sea un entero positivo responde 400.
- Si falla la base de datos responde 500 con un mensaje genérico; el detalle queda en el log del servidor.
- Todas las consultas usan `prepare` + `execute` para evitar inyección SQL.

## Cómo correrlo con XAMPP

> En este equipo el MySQL de XAMPP usa el puerto **3307**, porque el 3306 lo ocupa el servicio MySQL80.
> Se cambió `port=3307` en `C:\xampp\mysql\bin\my.ini` y en `C:\xampp\phpMyAdmin\config.inc.php`.

1. Iniciar **MySQL** desde el panel de XAMPP.
2. Importar la base, en phpMyAdmin (http://localhost/phpmyadmin, pestaña Importar, archivo `database/mente.sql`) o en la terminal:
   ```
   C:\xampp\mysql\bin\mysql.exe -u root -P 3307 --default-character-set=utf8mb4 < database\mente.sql
   ```
3. Copiar `api/config.example.php` como `api/config.php` (si no existe) y ajustar los datos.
4. Levantar el servidor desde la raíz del proyecto:
   ```
   C:\xampp\php\php.exe -S localhost:8000 -t public
   ```
5. Abrir http://localhost:8000/ o probar la API con `pruebas.http`.

Con Apache también funciona: crear un enlace en `htdocs` que apunte a `public/` (en cmd, una sola vez) y abrir http://localhost/mente/

```
mklink /J C:\xampp\htdocs\mente "<ruta del proyecto>\public"
```
