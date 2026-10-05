// Configuracion de ESLint 9 (formato plano). ESLint >= 9 ya no lee .eslintrc.
// La aplica `npm run lint` sobre src y test.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  {
    // Se ignoran las carpetas de compilado y dependencias
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'eslint.config.mjs'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierRecommended,
  {
    // El proyecto usa NestJS: los parametros de los controladores los decora el framework
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'prettier/prettier': 'warn',
    },
  },
  {
    // Los scripts de base de datos son JavaScript comun (CommonJS) para correrlos
    // con node sin compilar, asi que require() es lo esperado aqui
    files: ['scripts/**/*.js'],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      globals: { require: 'readonly', module: 'writable', process: 'readonly', console: 'readonly', __dirname: 'readonly', __filename: 'readonly' },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    // Este test carga el modulo CommonJS compartido por los scripts
    files: ['scripts/**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
);
