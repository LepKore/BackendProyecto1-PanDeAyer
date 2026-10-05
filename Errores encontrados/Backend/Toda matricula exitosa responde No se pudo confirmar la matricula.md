# Toda matricula exitosa responde No se pudo confirmar la matricula

## Area del error
Backend

## Archivos
`src/enrollments/enrollments.service.ts`

## Diagnostico
Al final de `enroll()` la verificacion estaba invertida: `if (created.status === Active) throw 'No se pudo confirmar la matricula'`. Cada matricula correcta se creaba, ocupaba el cupo y enviaba la notificacion, pero la API respondia 400.

## Plan implementado de solucion
La condicion es `!== EnrollmentStatus.Active`.

## Verificacion
Flujo real: `POST /enrollments` responde 201 con `status: activa` (la matricula de prueba se elimino despues).
