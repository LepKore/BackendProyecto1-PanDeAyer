// Reglas de integridad de las colecciones de database/*.json
// Compartido por db-validate.js y db-import.js para que la validacion sea siempre la misma.
'use strict';
const fs = require('fs');
const path = require('path');
const { EJSON } = require('bson');

const DATA_DIR = path.join(__dirname, '..', 'database');

// Por cada coleccion:
//   unique: un arreglo POR indice unico, con la lista de campos que lo forman
//           (p. ej. [['student','group']] = un indice unico student+group)
//   refs:   campos que son ObjectId (o arreglo de ObjectId) y apuntan a otra coleccion
//   nested: campos dentro de subdocumentos que tambien son referencias
const RULES = {
  users: { unique: [['email']] },
  programs: { unique: [['code']], refs: { faculty: 'faculties' } },
  subjects: { unique: [['code']], refs: { program: 'programs', prerequisites: 'subjects' } },
  periods: { unique: [['code']] },
  students: { unique: [['user'], ['code']], refs: { program: 'programs' } },
  teachers: { unique: [['user'], ['code']], refs: { faculty: 'faculties' } },
  faculties: { unique: [['code']], refs: { dean: 'teachers' } },
  classrooms: { unique: [['code']] },
  groups: {
    unique: [['subject', 'period', 'number']],
    refs: { subject: 'subjects', teacher: 'teachers', period: 'periods' },
    nested: { 'schedule.classroom': 'classrooms' },
  },
  enrollments: {
    unique: [['student', 'group']],
    refs: { student: 'students', group: 'groups', subject: 'subjects', period: 'periods' },
  },
  evaluations: { unique: [['group', 'name']], refs: { group: 'groups' } },
  grades: { unique: [['enrollment', 'evaluation']], refs: { enrollment: 'enrollments', evaluation: 'evaluations' } },
  notifications: { refs: { user: 'users' } },
};

// Reglas cruzadas que no se derivan de un indice unico pero que dejarian datos incoherentes:
// la matricula debe apuntar a la misma materia y al mismo periodo que su grupo.
function checkCrossRules(collection, doc, data, problems) {
  if (collection !== 'enrollments') return;
  const group = (data.groups || []).find((g) => String(g._id) === String(doc.group));
  if (!group) return;
  if (String(doc.subject) !== String(group.subject)) {
    problems.push(`${collection}: la matricula ${doc._id} es de la materia ${doc.subject} pero su grupo ${group._id} es de la materia ${group.subject}`);
  }
  if (String(doc.period) !== String(group.period)) {
    problems.push(`${collection}: la matricula ${doc._id} es del periodo ${doc.period} pero su grupo ${group._id} es del periodo ${group.period}`);
  }
}

// Lee un campo anidado aunque el nivel intermedio sea un arreglo de subdocumentos.
// Por ejemplo schedule.classroom sobre schedule: [{ classroom: ObjectId }]
function readNested(doc, dotted) {
  return dotted.split('.').reduce((acc, part) => {
    if (acc == null) return acc;
    if (Array.isArray(acc)) return acc.map((item) => (item == null ? item : item[part]));
    return acc[part];
  }, doc);
}

function loadData(dir = DATA_DIR) {
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort() : [];
  if (files.length === 0) throw new Error(`No hay archivos .json en ${dir}`);
  const data = {};
  for (const file of files) {
    data[path.basename(file, '.json')] = EJSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  }
  return data;
}

/**
 * Valida un conjunto de colecciones ya leidas.
 * @returns {{problems: string[], count: number}} problemas encontrados y total
 */
function validate(data) {
  const problems = [];
  const ids = new Map(); // _id -> coleccion dueña

  for (const [collection, docs] of Object.entries(data)) {
    for (const doc of docs) {
      const id = String(doc._id);
      if (ids.has(id)) problems.push(`${collection}: el _id ${id} ya existe en ${ids.get(id)}`);
      else ids.set(id, collection);
    }
  }

  for (const [collection, docs] of Object.entries(data)) {
    const rule = RULES[collection] || {};

    for (const fields of rule.unique || []) {
      const seen = new Map();
      for (const doc of docs) {
        const key = fields.map((f) => String(doc[f])).join('|');
        const previous = seen.get(key);
        if (previous) {
          problems.push(`${collection}: ${previous._id} y ${doc._id} repiten el indice unico ${fields.join('+')}`);
        } else {
          seen.set(key, doc);
        }
      }
    }

    for (const [field, target] of Object.entries(rule.refs || {})) {
      // El campo es un ObjectId o un arreglo de ObjectId segun los propios documentos
      const isArray = docs.some((d) => Array.isArray(d[field]));
      const values = isArray ? docs.flatMap((d) => d[field] || []) : docs.map((d) => d[field]);
      for (const value of values) {
        if (value == null) continue;
        const id = String(value);
        if (!ids.has(id)) problems.push(`${collection}.${field}: el _id ${id} no existe en ${target}`);
      }
    }

    for (const [dotted, target] of Object.entries(rule.nested || {})) {
      for (const doc of docs) {
        const found = readNested(doc, dotted);
        for (const value of Array.isArray(found) ? found : [found]) {
          if (value == null) continue;
          const id = String(value);
          if (!ids.has(id)) problems.push(`${collection}.${dotted}: el _id ${id} no existe en ${target}`);
        }
      }
    }

    for (const doc of docs) checkCrossRules(collection, doc, data, problems);
  }

  return { problems, count: problems.length };
}

module.exports = { RULES, DATA_DIR, loadData, validate };