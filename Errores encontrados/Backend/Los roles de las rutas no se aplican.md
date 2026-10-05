# Los roles de las rutas no se aplican

## Area del error
Backend

## Archivos
`src/auth/auth.module.ts`

## Diagnostico
Solo se registraba `JwtAuthGuard` como guardia global; `RolesGuard` existia pero nunca se usaba, asi que ningun `@Roles()` tenia efecto. Un estudiante podia consultar `/users` o `/reports/dashboard` (200) y llamar cualquier endpoint de administracion.

## Plan implementado de solucion
Se registra `RolesGuard` como `APP_GUARD` despues de `JwtAuthGuard`.

## Verificacion
Estudiante: `GET /users` -> 403. Recorrido de los tres roles con Playwright sin errores.
