# Una nota de 5.0 se rechaza

## Area del error
Backend

## Archivos
`src/grades/dto/grade.dto.ts`

## Diagnostico
`UpsertGradeDto.value` tenia `@Max(4.5)`, aunque la escala es 0.0 a 5.0 (Swagger, el schema y el frontend lo dicen). Las notas mayores a 4.5 no se podian registrar.

## Plan implementado de solucion
`@Max(5)`.

## Verificacion
`PUT /grades` con `value: 5` ya no responde 400 "value must not be greater than 4.5".
