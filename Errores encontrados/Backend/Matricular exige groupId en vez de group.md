# Matricular exige groupId en vez de group

## Area del error
Backend

## Archivos
`src/enrollments/dto/enrollment.dto.ts`, `src/enrollments/enrollments.service.ts`

## Diagnostico
`CreateEnrollmentDto` declaraba el campo `groupId`, pero el frontend (estudiante y administrador) envia `group`, igual que el resto de la API (filtros `?group=`, evaluaciones). Con `forbidNonWhitelisted`, toda matricula respondia 400: `property group should not exist, groupId must be a mongodb id`.

## Plan implementado de solucion
El DTO usa `group` y el servicio lee `dto.group`.

## Verificacion
`POST /enrollments {group}` llega al servicio (con un ID inexistente responde 404 "Grupo no encontrado" en vez del 400 de validacion).
