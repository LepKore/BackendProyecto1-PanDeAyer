# Facultad de Comunicacion con decano inexistente

## Area del error
Database

## Archivos
`database/faculties.json`

## Diagnostico
La facultad `FAC-COM` tenia `dean: 6ac057b232f78f9b9e14f3c3`, un `_id` que no existe en ninguna coleccion. En las demas facultades `dean` apunta a un docente.

## Plan implementado de solucion
Se asigno como decano al primer docente activo de esa facultad: `DOC-041` (Sofia Diaz Zapata, `6abf0b8bfead57fb41c12b33`).

## Verificacion
Revision de integridad sobre todas las colecciones: ninguna referencia apunta a un `_id` inexistente.
