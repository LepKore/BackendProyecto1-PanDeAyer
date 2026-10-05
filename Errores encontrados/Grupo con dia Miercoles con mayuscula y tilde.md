# Grupo con dia Miercoles con mayuscula y tilde

## Area del error
Database

## Archivos
`database/groups.json` (y la coleccion `groups`)

## Diagnostico
El horario del grupo `6abf0b8bfead57fb41c12c3a` tenia `day: "Miércoles"` en vez de `miercoles`. Esa clase no aparecia en ningun dia del horario del docente ni de sus estudiantes.

## Plan implementado de solucion
Se cambio a `miercoles`.

## Verificacion
Con Playwright: el horario de Laura Lopez muestra Calculo 1 el miercoles.
