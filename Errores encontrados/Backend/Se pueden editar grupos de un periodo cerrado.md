# Se pueden editar grupos de un periodo cerrado

## Area del error
Backend

## Archivos
`src/groups/groups.service.ts`

## Diagnostico
Crear un grupo en un periodo cerrado se rechaza, pero `PATCH /groups/:id` no revisaba el periodo: se podia cambiar docente, cupo u horario de grupos ya cerrados (y notificar a un docente de un grupo historico).

## Plan implementado de solucion
`update()` rechaza los grupos de un periodo cerrado con 400, igual que `create()`.

## Verificacion
Grupo de 2026-1 (cerrado) -> 400 "No se pueden modificar grupos de un periodo cerrado". Los 21 grupos del periodo abierto se siguen editando (200).
