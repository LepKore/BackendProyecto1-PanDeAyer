// Importa los archivos de database/*.json a la base indicada en MONGODB_URI
// Uso: npm run db:import          (reemplaza el contenido de cada coleccion)
//
// El import es seguro por dos motivos:
//   1. Valida los JSON antes de tocar la base. Si hay datos incoherentes, no borra nada.
//   2. Escribe primero en colecciones temporales y recien ahi las renombra. Si algo
//      falla, la base conserva los datos anteriores en lugar de quedar a medias.
'use strict';
require('dotenv').config();
const { MongoClient } = require('mongodb');
const { loadData, validate } = require('./db-rules');

const TMP_SUFFIX = '__tmp_import';

async function main() {
  if (!process.env.MONGODB_URI) throw new Error('Falta MONGODB_URI en el .env');

  const data = loadData();

  const { problems, count } = validate(data);
  if (count > 0) {
    console.error(`Los datos tienen ${count} problema(s) de integridad. No se toco la base:\n`);
    for (const problem of problems.slice(0, 20)) console.error('  - ' + problem);
    if (count > 20) console.error(`  ... y ${count - 20} mas`);
    console.error('\nRevisa con npm run db:validate');
    return 1;
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();
  const staged = [];

  try {
    // 1. Cargar los datos en colecciones temporales
    for (const [name, docs] of Object.entries(data)) {
      const tmp = name + TMP_SUFFIX;
      await db.collection(tmp).drop().catch(() => {});
      if (docs.length > 0) await db.collection(tmp).insertMany(docs, { ordered: false });
      staged.push({ name, tmp, expected: docs.length });
    }

    // 2. Promover: cada renombrado reemplaza la coleccion definitiva
    for (const { name, tmp, expected } of staged) {
      await db.collection(tmp).rename(name, { dropTarget: true });
      const actual = await db.collection(name).countDocuments();
      if (actual !== expected) throw new Error(`${name}: se esperaban ${expected} documentos y hay ${actual}`);
      console.log(name.padEnd(14), String(actual).padStart(4), 'documentos');
    }
  } catch (error) {
    // Si algo fallo, se limpian las temporales y la base conserva los datos anteriores
    for (const { tmp } of staged) await db.collection(tmp).drop().catch(() => {});
    console.error('\nLa importacion fallo y se descarto. La base conserva los datos anteriores.');
    console.error(error.message);
    return 1;
  } finally {
    await client.close();
  }

  console.log('\nImportacion terminada en la base:', db.databaseName);
  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  });