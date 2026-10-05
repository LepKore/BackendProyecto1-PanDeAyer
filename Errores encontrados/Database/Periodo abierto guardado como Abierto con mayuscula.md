# Periodo abierto guardado como Abierto con mayuscula

## Area del error
Database

## Archivos
`database/periods.json` (y la coleccion `periods`)

## Diagnostico
El periodo 2026-2 tenia `status: "Abierto"`, pero el enum es `abierto`. `/periods/current` respondia "No hay un periodo abierto": no se podia matricular, ni ver horarios, ni el panel del periodo.

## Plan implementado de solucion
Se cambio a `abierto` en la semilla y en la base local.

## Verificacion
`/estudiante/matricula` y los horarios muestran el periodo 2026-2.
