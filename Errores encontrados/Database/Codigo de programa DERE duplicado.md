# Codigo de programa DERE duplicado

## Area del error
Database

## Archivos
`database/programs.json`

## Diagnostico
Los programas "Derecho" y "Derecho (jornada nocturna)" tenian el mismo `code: "DERE"`, pero el esquema define `code` como `unique`. `npm run db:import` fallaba con `E11000 duplicate key error ... code_1 dup key: { code: "DERE" }` y dejaba la importacion a medias (sin programas, estudiantes, materias, docentes ni usuarios).

## Plan implementado de solucion
Se asigno un codigo propio al programa nocturno: `DERN` (no estaba en uso). Las relaciones usan `_id` y no el codigo, asi que no se rompe ninguna referencia.

## Verificacion
`npm run db:import` importa las 13 colecciones sin errores.
