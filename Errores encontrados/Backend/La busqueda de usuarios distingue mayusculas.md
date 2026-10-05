# La busqueda de usuarios distingue mayusculas

## Area del error
Backend

## Archivos
`src/users/users.service.ts`

## Diagnostico
`findAll` armaba la busqueda con `new RegExp(texto)` sin la opcion `i`: buscar "HERRERA" no encontraba a "Juliana Herrera". Las demas busquedas (estudiantes, docentes, materias, programas) no distinguen mayusculas.

## Plan implementado de solucion
Se agrega la opcion `'i'`.

## Verificacion
`GET /users?q=HERRERA` devuelve lo mismo que `q=herrera`.
