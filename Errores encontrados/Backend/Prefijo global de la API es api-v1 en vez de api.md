# Prefijo global de la API es api-v1 en vez de api

## Area del error
Backend

## Archivos
`src/main.ts`

## Diagnostico
Se usaba `app.setGlobalPrefix('api/v1')`, pero el README, la coleccion de Postman y el frontend (`src/lib/server.ts` y `src/app/api/[...path]/route.ts`) llaman a `${BACKEND_URL}/api/...`. Todas las llamadas del frontend terminaban en 404.

## Plan implementado de solucion
Se cambio el prefijo global a `api`.

## Verificacion
`POST http://localhost:3000/api/auth/login` responde correctamente.
