# Una nota final de 3.0 queda reprobada

## Area del error
Backend

## Archivos
`src/grades/grades.service.ts`

## Diagnostico
`finalize()` aprobaba con `finalGrade > PASSING_GRADE`; con exactamente 3.0 el estudiante quedaba reprobado, aunque se aprueba con 3.0 o mas.

## Plan implementado de solucion
`finalGrade >= PASSING_GRADE`.

## Verificacion
Revisado en el codigo (afecta tambien la finalizacion en bloque, que usa este mismo metodo); `tsc` sin errores.
