# Docente de prueba Laura Lopez no puede ingresar

## Area del error
Database

## Archivos
`database/users.json`

## Diagnostico
El usuario de la docente de prueba del README tenia tres errores: `email: "Laura.Lopez89@universidad.edu"` con mayusculas (la API busca el correo en minusculas), `role: "Docente"` (no coincide con el enum `docente` y rompe permisos y menus) y `active: false`. Resultado: `401 Credenciales invalidas`.

## Plan implementado de solucion
Se dejo el `email` en minusculas, `role: "docente"` y `active: true`.

## Verificacion
`laura.lopez89@universidad.edu` / `Secret123!` obtiene token con rol `docente`.
