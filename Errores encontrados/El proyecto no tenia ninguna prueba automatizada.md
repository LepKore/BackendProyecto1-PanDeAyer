# El proyecto no tenia ninguna prueba automatizada

## Area del error
Backend

## Archivos
`src/auth/auth.service.spec.ts`, `src/config/env.validation.spec.ts`, `src/common/pipes/parse-object-id.pipe.spec.ts`, `src/common/dto/query-helpers.spec.ts`, `scripts/db-rules.spec.ts`, `package.json`

## Diagnostico
`npm test` terminaba con error sin ejecutar nada:

```
No tests found, exiting with code 1
In C:\VSCode\Certi 1\IA Parcia 1\BackendProyecto1-PanDeAyer
  319 files checked.
  testMatch: **/__tests__/**/*.[jt]s?(x), **/?(*.)+(spec|test).[tj]s?(x) - 0 matches
```

El proyecto ya tenia `jest`, `ts-jest` y `supertest` en las dependencias, pero no un solo archivo de prueba. Eso dejaba sin cobertura automatica justo las partes mas sensibles:

- **Autenticacion**: no se comprobaba que el login emitiera token con el rol correcto, ni que rechazara claves incorrectas, usuarios inactivos o correos inexistentes.
- **Configuracion**: `validateEnv` es la barrera que evita que la API arranque con `JWT_SECRET` corto o una expiracion invalida, y no se probaba.
- **Validadores de entrada**: `ParseObjectIdPipe` es lo que evita que un id mal formado llegue a MongoDB.
- **Integridad de datos**: nada impedia que los JSON de `database/` tuvieran referencias rotas o indices unicos repetidos. De hecho, `enrollments.json` tenia una matricula duplicada y dos matriculas incoherentes que nadie detecto.

## Plan implementado de solucion
Se configuro Jest en `package.json` (`testRegex` para `*.spec.ts`, `ts-jest` como transformador y `setupFiles: ["reflect-metadata"]`, necesario para que `class-transformer` funcione fuera de Nest) y se escribieron 44 pruebas en 5 archivos:

**`src/auth/auth.service.spec.ts`** (7 pruebas)
Login correcto emite un token con `sub`, `email` y `role`. Se verifica el rechazo de clave incorrecta, correo inexistente y usuario inactivo, y que en ningun caso se emite token. Ademas comprueba que un correo inexistente y una clave incorrecta producen el **mismo mensaje**, para no revelar que cuentas existen.

**`src/config/env.validation.spec.ts`** (9 pruebas)
Una configuracion valida se acepta; los numeros del `.env` (que llegan como texto) se convierten a numero; y se rechazan `MONGODB_URI` ausente, `JWT_SECRET` de menos de 16 caracteres, expiracion menor a 60 segundos, puerto fuera de rango y `ADMIN_EMAIL` que no es un correo.

**`src/common/pipes/parse-object-id.pipe.spec.ts`** (7 pruebas)
Un ObjectId valido pasa intacto, en mayusculas o minusculas. Se rechazan id corto, con guiones, no hexadecimales, vacio y el texto `ObjectId("...")`.

**`src/common/dto/query-helpers.spec.ts`** (8 pruebas)
`toBoolean` convierte los valores del query string y deja intacto lo que `IsBoolean` debe rechazar. `escapeRegex` escapa los metacaracteres, y `textPattern('a.c')` **no** llega a coincidir con `abc`: es la proteccion contra inyeccion de regex en los buscadores del frontend.

**`scripts/db-rules.spec.ts`** (13 pruebas)
La primera prueba pasa los JSON reales por el validador y exige cero problemas. Las demas usan conjuntos de datos minimos, creados en la propia prueba, para verificar que el validador detecta cada fallo (referencia huerfana, indice unico repetido, materia o periodo distintos a los del grupo, aula inexistente, prerrequisito inexistente, `_id` repetido entre colecciones) y que **no** marca falso positivo cuando los datos si son coherentes.

## Verificacion
```
npm test
Test Suites: 5 passed, 5 total
Tests:       44 passed, 44 total
```

`npm run build` sigue compilando sin errores.