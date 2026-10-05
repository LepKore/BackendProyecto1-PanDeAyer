# Administrador sin nombre

## Area del error
Database

## Archivos
`database/users.json`

## Diagnostico
El usuario `admin@universidad.edu` tenia `name: ""`, aunque el esquema lo marca como requerido. El frontend muestra ese nombre (`/users/me`) en el menu y en el avatar, que quedaban vacios.

## Plan implementado de solucion
Se asigno `name: "Administrador"`, como figura en la tabla de usuarios del README.

## Verificacion
`GET /api/users/me` con el token del admin devuelve el nombre.
