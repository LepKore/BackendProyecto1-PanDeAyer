# Marcar una notificacion como leida no la marca

## Area del error
Backend

## Archivos
`src/notifications/notifications.service.ts`

## Diagnostico
`markRead` guardaba `readAt` pero nunca ponia `read = true`: la notificacion seguia como no leida y el contador no bajaba.

## Plan implementado de solucion
Se pone `read = true` junto con `readAt`.

## Verificacion
`PATCH /notifications/:id/read` responde `read: true`.
