# El validador no revisaba las referencias dentro de los horarios

## Area del error
Database

## Archivos
`scripts/db-rules.js`

## Diagnostico
Al escribir el validador de integridad, la comprobacion de referencias anidadas leia el campo como si fuera un subdocumento simple:

```js
function readNested(doc, dotted) {
  return dotted.split('.').reduce((acc, part) => (acc == null ? acc : acc[part]), doc);
}
```

Pero `groups.schedule` no es un objeto, es un **arreglo** de franjas horarias. En el esquema:

```ts
@Prop({ type: [ScheduleSlotSchema], default: [] }) schedule: ScheduleSlot[];
```

Con esa funcion, `doc.schedule.classroom` es `undefined` (no hay una propiedad `classroom` en el arreglo), asi que el recorrido terminaba en `undefined` y la comprobacion se aplicaba sobre `[]`. En la practica, **ninguna referencia a salones se validaba nunca**: un grupo podia apuntar a un salon inexistente y el validador lo daba por bueno.

Esto no lo detecte la primera vez porque los datos del repositorio si son correctos en esa parte, asi que el validador pasaba igual. Lo destapo la prueba que verifica precisamente este caso.

## Plan implementado de solucion
`readNested` ahora atraviesa los arreglos: cuando un nivel intermedio es una lista, aplica el siguiente segmento a cada elemento y devuelve otra lista.

```js
function readNested(doc, dotted) {
  return dotted.split('.').reduce((acc, part) => {
    if (acc == null) return acc;
    if (Array.isArray(acc)) return acc.map((item) => (item == null ? item : item[part]));
    return acc[part];
  }, doc);
}
```

Y el recorrido de `rule.nested` acepta tanto un valor simple como una lista de referencias.

## Verificacion
- La prueba "detecta un aula inexistente dentro del horario de un grupo" en `scripts/db-rules.spec.ts` fallaba antes del arreglo (`Received array: []` de problemas del aula) y pasa ahora.
- `npm run db:validate` sobre los 1541 documentos del repositorio sigue dando `Integridad correcta`, lo que confirma que los horarios si apuntan a salones existentes.