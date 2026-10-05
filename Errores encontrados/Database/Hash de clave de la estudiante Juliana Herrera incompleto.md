# Hash de clave de la estudiante Juliana Herrera incompleto

## Area del error
Database

## Archivos
`database/users.json`

## Diagnostico
El `passwordHash` de `juliana.herrera147@universidad.edu` tenia un caracter menos que el hash correcto (le faltaba la `e` final), por lo que `bcrypt.compare` nunca coincidia con `Secret123!` y la estudiante de prueba del README no podia ingresar.

## Plan implementado de solucion
Se reemplazo por el hash correcto de `Secret123!`, el mismo que usan los demas usuarios de prueba.

## Verificacion
La estudiante obtiene token con rol `estudiante`.
