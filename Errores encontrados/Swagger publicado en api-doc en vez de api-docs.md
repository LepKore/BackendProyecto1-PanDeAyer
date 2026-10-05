# Swagger publicado en api-doc en vez de api-docs

## Area del error
Backend

## Archivos
`src/main.ts`

## Diagnostico
Swagger se montaba con `SwaggerModule.setup('api/doc', ...)`, pero el README documenta la URL `http://localhost:3000/api/docs`. La documentacion no se encontraba en la ruta indicada.

## Plan implementado de solucion
Se cambio la ruta a `api/docs`.

## Verificacion
`GET http://localhost:3000/api/docs` responde 200.
