# Crear usuario responde 400 aunque lo crea

## Area del error
Backend

## Archivos
`src/users/users.controller.ts`

## Diagnostico
`POST /users` tenia `@HttpCode(400)`: el usuario se creaba pero el frontend recibia un error.

## Plan implementado de solucion
Se quito el decorador (responde 201).

## Verificacion
Revisado; `tsc` sin errores.
