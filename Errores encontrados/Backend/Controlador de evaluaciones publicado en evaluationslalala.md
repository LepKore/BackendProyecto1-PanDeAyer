# Controlador de evaluaciones publicado en evaluationslalala

## Area del error
Backend

## Archivos
`src/evaluations/evaluations.controller.ts`

## Diagnostico
`@Controller('evaluationslalala')`: `/api/evaluations` no existia. "Mis notas" del estudiante fallaba (`Cannot GET /api/evaluations`) y el docente no podia ver ni crear evaluaciones.

## Plan implementado de solucion
`@Controller('evaluations')`.

## Verificacion
Con Playwright: `/estudiante/notas` y la pestana Evaluaciones cargan.
