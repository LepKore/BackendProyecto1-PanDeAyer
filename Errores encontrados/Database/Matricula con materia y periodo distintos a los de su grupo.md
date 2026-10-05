# Matricula con materia y periodo distintos a los de su grupo

## Area del error
Database

## Archivos
`database/enrollments.json`

## Diagnostico
Dos matriculas apuntaban a una `subject` o a un `period` que no corresponden a los de su grupo:

| Matricula | Grupo | Problema |
|---|---|---|
| `6abf0b8bfead57fb41c12dfb` | `6abf0b8bfead57fb41c12c3e` (materia `6abf0b8bfead57fb41c1299d` = ODON105) | la matricula declaraba la materia `6abf0b8bfead57fb41c129c0` = ARQU181 |
| `6abf0b8bfead57fb41c12e1a` | `6abf0b8bfead57fb41c12c73` (periodo `6abf0b8bfead57fb41c12a35` = 2026-2) | la matricula declaraba el periodo `6abf0b8bfead57fb41c12a34` = 2026-1 |

MongoDB no detecta esto: no hay indice que lo impida, porque `subject` y `period` de la matricula son campos libres. Pero si rompe la coherencia academica que espera el resto del codigo:

- Las notas se consultan a traves de `grades.enrollment` y se validan contra `enrollments.subject`, asi que una matricula con ARQU181 mostraría notas de ODON105.
- Los reportes de historial agrupan por matricula y periodo, y darian al estudiante un periodo distinto del real.
- `enrollments.period` se usa para saber si el periodo esta abierto o cerrado al calificar.

`scripts/db-seed.js` siempre genera `subject` y `period` tomandolos del grupo, asi que ninguna de las 2 matriculas puede haber salido del generador.

## Plan implementado de solucion
Se alinearon ambas matriculas con su grupo, tomando el valor del grupo como fuente de verdad:

- `6abf0b8bfead57fb41c12dfb` -> `subject` = `6abf0b8bfead57fb41c1299d` (ODON105)
- `6abf0b8bfead57fb41c12e1a` -> `period` = `6abf0b8bfead57fb41c12a35` (2026-2)

Ademas se agrego esta regla al validador (ver "No habia forma de detectar referencias incoherentes"), para que no vuelva a colarse ningun caso parecido.

## Verificacion
`npm run db:validate` no reporta matriculas cuya materia o periodo difieran de los de su grupo. Revision manual: las 109 matriculas de `enrollments.json` coinciden con su grupo.