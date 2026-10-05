# Puerto del servidor lee APP_PORT y usa 3001 por defecto

## Area del error
Backend

## Archivos
`src/main.ts`

## Diagnostico
El servidor leia `process.env.APP_PORT ?? 3001`, pero `.env.example` define la variable `PORT` (validada en `src/config/env.validation.ts`). Como `APP_PORT` nunca existe, la API siempre levantaba en el puerto 3001, que es justamente el puerto del frontend (`next dev -p 3001`). Resultado: la API y el frontend no podian correr al mismo tiempo y el frontend no encontraba la API en `http://localhost:3000` como indica el README.

## Plan implementado de solucion
Se cambio a `Number(process.env.PORT ?? 3000)`, usando la misma variable que valida la configuracion y el puerto documentado en el README.

## Verificacion
La API responde en `http://localhost:3000/api/health` con `{"status":"ok","database":"up"}`.
