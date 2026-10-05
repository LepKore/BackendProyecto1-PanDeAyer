# ReportsService no registrado en ReportsModule

## Area del error
Backend

## Archivos
`src/reports/reports.module.ts`

## Diagnostico
El import de `ReportsService` y la linea `providers: [ReportsService]` estaban comentados. `ReportsController` lo necesita en su constructor, asi que Nest fallaba al iniciar con `UnknownDependenciesException: Nest can't resolve dependencies of the ReportsController (?)` y la API no levantaba.

## Plan implementado de solucion
Se descomentaron el import y `providers: [ReportsService]`.

## Verificacion
La aplicacion inicia con `Nest application successfully started`.
