# Estudiante de prueba con programa inexistente e inactiva

## Area del error
Database

## Archivos
`database/students.json`

## Diagnostico
El perfil de estudiante de Juliana Herrera (`E20210046`) apuntaba a `program: 6ac057b232f78f9b9e14f3c4`, un `_id` que no existe en `programs`, y tenia `active: false`. Las pantallas que muestran el programa, la malla curricular o permiten matricular no tenian datos validos para la estudiante de prueba.

## Plan implementado de solucion
Se asigno el programa `CSOC - Comunicacion Social` (`6abf0b8bfead57fb41c12942`), uno de los programas de las materias en las que esta matriculada. Sus matriculas se reparten por igual entre CSOC y ODON, asi que la eleccion de CSOC es un supuesto. Se dejo `active: true`.

## Verificacion
Revision de integridad: no quedan referencias a `_id` inexistentes en `students`.
