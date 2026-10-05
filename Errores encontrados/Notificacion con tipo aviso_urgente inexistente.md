# Notificacion con tipo aviso_urgente inexistente

## Area del error
Database

## Archivos
`database/notifications.json` (y la coleccion `notifications`)

## Diagnostico
La notificacion `6abf0b8bfead57fb41c12eb7` tenia `type: "aviso_urgente"`, que no existe en el enum `NotificationType`; su titulo es "Matricula confirmada".

## Plan implementado de solucion
Se cambio a `matricula_confirmada`.

## Verificacion
`/notificaciones` del estudiante carga.
