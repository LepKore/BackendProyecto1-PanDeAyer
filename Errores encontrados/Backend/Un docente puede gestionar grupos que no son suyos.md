# Un docente puede gestionar grupos que no son suyos

## Area del error
Backend

## Archivos
`src/groups/groups.service.ts`

## Diagnostico
`assertCanManage` verificaba la propiedad del grupo solo cuando `user.role === Role.Estudiante` (rol que nunca llega a esas rutas). Cualquier docente podia ver la planilla y la nomina, registrar notas, crear evaluaciones y finalizar grupos de otros docentes.

## Plan implementado de solucion
La verificacion se hace para `Role.Docente`; el administrador sigue gestionando cualquier grupo.

## Verificacion
Laura Lopez pidiendo la planilla de un grupo ajeno: antes 200, ahora 403. Sus propios grupos siguen funcionando.
