# El comando de lint estaba roto y modificaba archivos al revisarlos

## Area del error
Backend

## Archivos
`eslint.config.mjs` (nuevo), `.prettierrc` (nuevo), `package.json`

## Diagnostico
`npm run lint` fallaba siempre:

```
ESLint couldn't find an eslint.config.(js|mjs|cjs) file.
From ESLint v9.0.0, the default configuration file is now eslint.config.js.
```

El proyecto tiene `eslint@^9.22.0`, que desde la version 9 dejo de leer los archivos `.eslintrc.*` y exige configuracion en formato plano (`eslint.config.mjs`). No existe ningun archivo de ese nombre, asi que el comando no funcionaba y no se podia revisar el codigo de forma automatica.

Ademas, el script era:

```
"lint": "eslint \"{src,test}/**/*.ts\" --fix"
```

Con `--fix`, revisar el codigo **modifica los archivos**. Escribir correcciones de formato automaticamente en una revision es peligroso: mezcla cambios mecanicos con los funcionales del diff y hace imposible distinguir "arregle un bug" de "reformateo 200 lineas". El nombre `lint` tambien sugiere solo lectura, no escritura.

Un detalle adicional: el proyecto no tenia `.prettierrc`, asi que Prettier usaba sus valores por defecto, que no coinciden con el estilo real del codigo.

## Plan implementado de solucion

1. **Se creo `eslint.config.mjs`** con el formato plano de ESLint 9: `js.configs.recommended`, la configuracion recomendada de `typescript-eslint` y `eslint-plugin-prettier`. Se excluyen `dist`, `coverage` y `node_modules`. Para `scripts/**/*.js` se desactiva el analisis de tipos y la regla `no-require-imports`, porque esos scripts son JavaScript comun (CommonJS) que se ejecutan con `node` sin compilar, y `require()` es lo correcto ahi.

2. **Se creo `.prettierrc`** con el estilo que ya usa el codigo (`singleQuote`, `trailingComma: all`, `printWidth: 120`, `tabWidth: 2`) y `endOfLine: "auto"`, para que respete los finales de linea CRLF con los que estan guardados los archivos. Sin esto, `prettier/prettier` reportaba mas de 6000 avisos por el caracter `␍`, que tapaban los problemas reales.

3. **Se separaron los comandos:**

```
"lint":     "eslint \"{src,test,scripts}/**/*.{ts,js}\"",
"lint:fix": "eslint \"{src,test,scripts}/**/*.{ts,js}\" --fix"
```

`npm run lint` ahora solo informa; el `--fix` quedo en `lint:fix`, que es donde corresponde. Tambien se incluyeron `scripts/`, que antes quedaban fuera del analisis.

## Verificacion
`npm run lint` termina con codigo `0` y `0 errors`. Quedan 173 avisos de formato preexistentes (`prettier/prettier`), todos auto-corregibles con `npm run lint:fix`. No se aplico esa correccion para no mezclar reformateo masivo con los cambios funcionales; queda a decision del equipo.