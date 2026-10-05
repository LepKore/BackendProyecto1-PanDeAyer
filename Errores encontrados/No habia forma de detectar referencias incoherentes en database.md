# No habia forma de detectar referencias incoherentes en database/

## Area del error
Database

## Archivos
`scripts/db-validate.js` (nuevo), `scripts/db-rules.js` (nuevo), `package.json`

## Diagnostico
Las relaciones entre documentos de `database/*.json` son referencias por `ObjectId` que el codigo escribe a mano. MongoDB no las valida: `ref` en Mongoose es solo-documentacion, no una restriccion. Si una referencia apunta a un `_id` que no existe, el documento se inserta sin problema y el fallo aparece mucho despues, como un `null` en una pantalla o un `404` en un endpoint que busca la entidad relacionada.

No habia ninguna forma de comprobarlo: no existia ningun script de validacion. Los errores de este tipo solo se detectaban a mano o cuando un usuario veia algo roto. De hecho, `database/enrollments.json` tenia una matricula duplicada y dos matriculas con materia y periodo incorrectos que nadie podia ver.

Ademas, la validacion existente en los indices unicos solo la hacia el propio MongoDB al insertar, es decir tarde y con el coste de haber borrado la coleccion.

## Plan implementado de solucion
Se creo `scripts/db-rules.js`, un modulo con las reglas de integridad de cada coleccion, derivado de los esquemas de Mongoose en `src/`:

- **`unique`**: los indices unicos de cada coleccion (`users.email`, `programs.code`, `enrollments.student+group`, `grades.enrollment+evaluation`, etc.).
- **`refs`**: que campo apunta a que coleccion (`students.program` -> `programs`, `teachers.faculty` -> `faculties`, `grades.evaluation` -> `evaluations`, etc.).
- **`nested`**: referencias dentro de subdocumentos, como `groups.schedule.classroom` -> `classrooms`.
- **Reglas cruzadas**: la matricula debe apuntar a la misma materia y al mismo periodo que su grupo.

Y `scripts/db-validate.js`, un comando que las revisa sin tocar la base:

```
npm run db:validate
```

Devuelve codigo `0` si todo esta correcto y `1` con la lista de problemas si algo esta mal, de modo que se pueda usar en un paso previo a la importacion.

`db-import.js` usa este mismo modulo, asi que la validacion que se ejecuta antes de importar es exactamente la misma que se puede revisar a mano.

## Verificacion
- `npm run db:validate` sobre los datos del repositorio -> `Integridad correcta`.
- Las pruebas de `scripts/db-rules.spec.ts` comprueban que el validador detecta cada tipo de problema (referencia huerfana, indice unico repetido, materia o periodo incorrecto, aula inexistente, prerrequisito inexistente, `_id` repetido entre colecciones) y que **no** marca falso positivo cuando los datos si son coherentes.
- `db:validate` esta registrado en `package.json` y corre antes de `db:import`.