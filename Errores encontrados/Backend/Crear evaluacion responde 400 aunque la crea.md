# Crear evaluacion responde 400 aunque la crea

## Area del error
Backend

## Archivos
`src/evaluations/evaluations.controller.ts`

## Diagnostico
`POST /evaluations` tenia `@HttpCode(HttpStatus.BAD_REQUEST)`: se creaba pero el docente veia un error.

## Plan implementado de solucion
Se quito el decorador (y los imports que quedaron sin uso).

## Verificacion
Revisado; `tsc` sin errores.
