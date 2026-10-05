# Cancelar una matricula no libera el cupo

## Area del error
Backend

## Archivos
`src/enrollments/enrollments.service.ts`

## Diagnostico
`cancel()` solo cambiaba el estado a `cancelada`; `enrolled` del grupo no bajaba, asi que cada cancelacion dejaba un cupo ocupado para siempre (el endpoint dice "libera el cupo").

## Plan implementado de solucion
Dentro de la misma transaccion se hace `$inc: { enrolled: -1 }` sobre el grupo (sin bajar de 0).

## Verificacion
Flujo real: cupos ocupados 0 -> matricular 1 -> cancelar 0.
