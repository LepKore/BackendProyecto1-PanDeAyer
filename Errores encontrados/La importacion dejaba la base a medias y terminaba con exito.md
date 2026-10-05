# La importacion dejaba la base a medias y terminaba con exito

## Area del error
Backend

## Archivos
`scripts/db-import.js`

## Diagnostico
El importador hacia `deleteMany({})` de cada coleccion y despues `insertMany`. Eso tiene dos problemas:

**1. Perdia datos sin avisar.** Con `ordered: false` (o ante cualquier error de un documento), los documentos invalidos se omitian en silencio y la consola mostraba solo un `console.log` informativo:

```
enrollments  109 documentos importados
```

El proceso terminaba con codigo de salida `0`, igual que un import exitoso. Un script de despliegue o de correccion automatica no podia distinguir "importo 109 de 110" de "todo bien", y nadie se enteraba de que faltaba un documento hasta ver el efecto en la API.

**2. Una importacion interrumpia dejaba la base reconstruida a medias.** Como cada coleccion se borra y se inserta en el mismo bucle, si fallaba la octava coleccion, las siete anteriores ya estaban reemplazadas y las siguientes seguian con el contenido viejo. Un corte de luz o un error de conexion en medio del proceso dejaba la base en un estado hibrido, sin forma de volver atras: los datos anteriores ya se habian borrado.

Ademas, `insertMany` escribia directamente sobre la coleccion definitiva, asi que un error a mitad de una coleccion la dejaba vacia o incompleta.

## Plan implementado de solucion
`scripts/db-import.js` se reescribio con dos garantias:

1. **Nada se borra sin validar antes.** Se ejecuta el validador de integridad sobre los JSON. Si hay problemas, el script los lista y termina con codigo `1` sin haber conectado con MongoDB. La base conserva su contenido intacta.

2. **El reemplazo es por coleccion temporal.** Los documentos se escriben primero en colecciones `<nombre>__tmp_import`. Solo si todas las colecciones se cargaron bien, cada temporal se renombra al nombre definitivo con `rename(name, { dropTarget: true })`, que reemplaza la coleccion de una sola vez. Si algo falla en el camino, se eliminan las temporales y **la base conserva los datos anteriores**.

Ademas, despues de promover cada coleccion se verifica que el conteo de documentos coincida con lo esperado, y cualquier discrepancia aborta la importacion.

## Verificacion
- Con los datos corruptos, `npm run db:import` no toca la base y sale con codigo `1`.
- Con los datos correctos, importa las 13 colecciones y sale con codigo `0`.
- `docker exec proyecto1-mongo mongosh --eval "db.getSiblingDB('universidad').getCollectionNames().filter(c => c.includes('__tmp'))"` -> `[]`, no quedan colecciones temporales.
- La API arranca y responde con los datos recien importados.