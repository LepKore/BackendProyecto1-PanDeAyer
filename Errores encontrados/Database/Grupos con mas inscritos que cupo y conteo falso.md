# Grupos con mas inscritos que cupo y conteo falso

## Area del error
Database

## Archivos
`database/groups.json` (y la coleccion `groups`)

## Diagnostico
Dos grupos del periodo abierto guardaban `enrolled` mayor que `capacity` y distinto de sus matriculas reales: `6abf0b8bfead57fb41c12c3a` (MAT101 G1) con 35 inscritos sobre 32 cupos y 9 matriculas reales, y `6abf0b8bfead57fb41c12c3e` (ODON105 G1) con 42 sobre 39 y 10 reales. El administrador no podia editarlos ("El cupo no puede ser menor a los 35 estudiantes matriculados") y el panel mostraba una ocupacion inflada (107 cupos ocupados).

## Plan implementado de solucion
`enrolled` pasa al conteo real de matriculas no canceladas: 9 y 10, en la semilla y en la base local. Los otros 98 grupos ya coincidian.

## Verificacion
Los 100 grupos tienen `enrolled` igual a sus matriculas reales; los 21 del periodo abierto se editan; el panel muestra 49 de 688 cupos.
