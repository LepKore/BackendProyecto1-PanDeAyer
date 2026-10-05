# Cancelar matricula responde 201 Created

## Area del error
Backend

## Archivos
`src/enrollments/enrollments.controller.ts`

## Diagnostico
`POST /enrollments/:id/cancel` no tenia `@HttpCode(200)`, por lo que Nest respondia 201 Created aunque no crea nada. Las demas acciones por POST (`/periods/:id/close`, `/groups/:id/finalize`, `/grades/finalize/:id`) responden 200, y asi lo documenta Swagger.

## Plan implementado de solucion
Se agrego `@HttpCode(200)`.

## Verificacion
Swagger y la respuesta real muestran 200.
