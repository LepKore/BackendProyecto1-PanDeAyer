# Swagger agrupa los borrados bajo el tag deletions21312

## Area del error
Backend

## Archivos
`src/deletions/deletions.controller.ts`

## Diagnostico
`@ApiTags('deletions21312')`: en la documentacion todos los DELETE aparecian en una seccion con un nombre basura.

## Plan implementado de solucion
`@ApiTags('deletions')`.

## Verificacion
`/api/docs-json` ya no tiene ese tag.
