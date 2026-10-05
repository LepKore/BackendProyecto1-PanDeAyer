# GET groups mine declarado despues de groups id

## Area del error
Backend

## Archivos
`src/groups/groups.controller.ts`

## Diagnostico
`/groups/mine` caia en `@Get(':id')` y respondia "ID invalido"; la pagina "Mis grupos" del docente fallaba con error 500.

## Plan implementado de solucion
Se movio `@Get('mine')` antes de `@Get(':id')`.

## Verificacion
Con Playwright: `/docente/grupos` carga.
