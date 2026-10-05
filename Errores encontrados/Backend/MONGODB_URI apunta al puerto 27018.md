# MONGODB_URI apunta al puerto 27018

## Area del error
Backend

## Archivos
`.env.example`

## Diagnostico
`.env.example` usaba `mongodb://localhost:27018/...`, pero `docker-compose.yml` publica MongoDB en el puerto `27017`. Al copiar `.env.example` a `.env` como dice el README, ni la API ni `npm run db:import` podian conectarse a la base.

## Plan implementado de solucion
Se cambio el puerto a `27017` en `MONGODB_URI`.

## Verificacion
`npm run db:import` importa todas las colecciones y `/api/health` reporta `database: up`.
