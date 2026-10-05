# Se puede editar o borrar evaluaciones de un periodo cerrado

## Area del error
Backend

## Archivos
`src/evaluations/evaluations.service.ts`, `src/deletions/deletions.service.ts`

## Diagnostico
Crear una evaluacion en un periodo cerrado se rechaza ("no se puede modificar el plan de evaluacion"), pero editarla (`PATCH /evaluations/:id`) y eliminarla (`DELETE /evaluations/:id`) no tenian esa regla.

## Plan implementado de solucion
Se agrego `assertPeriodNotClosed` y se usa al crear y editar; el borrado aplica la misma regla.

## Verificacion
Periodo 2026-1 (cerrado): PATCH -> 400 y DELETE -> 409. En el periodo abierto editar sigue respondiendo 200.
