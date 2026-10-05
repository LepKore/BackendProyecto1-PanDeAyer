# Volumen de MongoDB declarado pero no montado

## Area del error
Database

## Archivos
`docker-compose.yml`

## Diagnostico
El archivo declara el volumen `mongo_data` al final, pero el servicio `mongo` no lo usaba. Los datos quedaban dentro del contenedor y se perdian al borrarlo o recrearlo (`npm run db:down` + `npm run db:up`).

## Plan implementado de solucion
Se monto el volumen en el servicio: `volumes: - mongo_data:/data/db`.

## Verificacion
Aplica al crear el contenedor con `npm run db:up`.
