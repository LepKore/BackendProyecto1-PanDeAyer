// Valida la integridad de database/*.json sin tocar la base de datos:
// referencias huerfanas, indices unicos repetidos y reglas cruzadas.
// Uso: npm run db:validate
'use strict';
const { DATA_DIR, loadData, validate } = require('./db-rules');

const MAX_SHOWN = 40;

function main() {
  const data = loadData();
  const total = Object.values(data).reduce((sum, docs) => sum + docs.length, 0);
  console.log(`Revisando ${Object.keys(data).length} colecciones (${total} documentos) en ${DATA_DIR}\n`);

  const { problems } = validate(data);

  if (problems.length === 0) {
    for (const [name, docs] of Object.entries(data)) {
      console.log(name.padEnd(14), String(docs.length).padStart(4), 'documentos  ok');
    }
    console.log('\nIntegridad correcta: sin referencias huerfanas ni indices unicos repetidos.');
    return 0;
  }

  console.error(`Se encontraron ${problems.length} problema(s):\n`);
  for (const problem of problems.slice(0, MAX_SHOWN)) console.error('  - ' + problem);
  if (problems.length > MAX_SHOWN) {
    console.error(`  ... y ${problems.length - MAX_SHOWN} mas`);
  }
  console.error('\nCorrige los archivos o ejecuta npm run db:seed para regenerar los datos.');
  return 1;
}

process.exit(main());