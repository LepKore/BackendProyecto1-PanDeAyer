# Matricula duplicada que viola el indice unico student+group

## Area del error
Database

## Archivos
`database/enrollments.json`

## Diagnostico
El archivo tenia 110 matriculas, pero dos de ellas correspondian al mismo estudiante en el mismo grupo:

- `_id` `6abf0b8bfead57fb41c12dfb` (estudiante `6abf0b8bfead57fb41c12b9c`, grupo `6abf0b8bfead57fb41c12c3e`)
- `_id` `6ac057b232f78f9b9e14f3c2` (estudiante `6abf0b8bfead57fb41c12b9c`, grupo `6abf0b8bfead57fb41c12c3e`)

El esquema define `EnrollmentSchema.index({ student: 1, group: 1 }, { unique: true })`, asi que un estudiante no puede estar matriculado dos veces en el mismo grupo. `npm run db:import` fallaba con:

```
E11000 duplicate key error collection: universidad.enrollments
index: student_1_group_1 dup key: { student: ObjectId('6abf0b8bfead57fb41c12b9c'),
group: ObjectId('6abf0b8bfead57fb41c12c3e') }
```

El documento `6ac057b232f78f9b9e14f3c2` es un agregadoManual: no lo produce `scripts/db-seed.js` (todos los ObjectId del generador son consecutivos) y sus datos si son coherentes con su grupo, mientras que el documento original no. Se elimino el agregado y se conservo la matricula original.

## Plan implementado de solucion
Se elimino de `database/enrollments.json` el documento duplicado, dejando las 109 matriculas validas. La correccion se aplico sobre el JSON versionado, no sobre la base, para que `npm run db:export` no vuelva a introducir el duplicado.

## Verificacion
- `npm run db:validate` -> `Integridad correcta`, sin indice unico repetido.
- `npm run db:import` -> importa las 13 colecciones sin `E11000`.
- `universidad.enrollments` queda con 109 documentos.