# Notificacion con fecha de creacion ayer

## Area del error
Database

## Archivos
`database/notifications.json` (y la coleccion `notifications`)

## Diagnostico
La notificacion `6abf0b8bfead57fb41c12ec0` tenia `createdAt: "ayer"` (texto, no fecha).

## Plan implementado de solucion
Se puso `2026-08-02T00:00:00Z`, igual que las demas confirmaciones de matricula y anterior a su `readAt`.

## Verificacion
La notificacion muestra una fecha valida.
