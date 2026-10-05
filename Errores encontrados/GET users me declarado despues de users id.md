# GET users me declarado despues de users id

## Area del error
Backend

## Archivos
`src/users/users.controller.ts`

## Diagnostico
`@Get(':id')` estaba antes de `@Get('me')`, asi que `/users/me` entraba como ID y respondia 400 "ID invalido". El layout del frontend pide `/users/me`, por lo que ninguna pagina de ningun rol cargaba.

## Plan implementado de solucion
Se movio `@Get('me')` antes de `@Get(':id')`.

## Verificacion
`GET /api/users/me` devuelve el perfil; con Playwright todas las pantallas de los tres roles cargan.
