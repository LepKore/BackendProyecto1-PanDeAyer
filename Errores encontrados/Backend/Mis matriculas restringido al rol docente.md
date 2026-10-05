# Mis matriculas restringido al rol docente

## Area del error
Backend

## Archivos
`src/enrollments/enrollments.controller.ts`

## Diagnostico
`GET /enrollments/mine` ("Mis matriculas", lo usa el estudiante) tenia `@Roles(Role.Docente)`. Quedaba oculto porque los roles no se aplicaban; al activar `RolesGuard` el estudiante habria recibido 403.

## Plan implementado de solucion
`@Roles(Role.Estudiante)`.

## Verificacion
Estudiante: `GET /enrollments/mine` -> 200.
