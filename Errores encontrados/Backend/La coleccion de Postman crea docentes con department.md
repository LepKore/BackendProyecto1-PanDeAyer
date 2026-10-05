# La coleccion de Postman crea docentes con department

## Area del error
Backend

## Archivos
`postman/proyecto1-simple.postman_collection.json`

## Diagnostico
Los requests teachers > Crear y Actualizar enviaban `department`, campo que ya no existe: el docente ahora pertenece a una facultad (`faculty`). Con `forbidNonWhitelisted` respondian 400.

## Plan implementado de solucion
Los bodies usan `faculty` (con el texto PEGA_AQUI_EL_ID_DE_LA_FACULTAD como los demas). Ademas se agrego como mejora: auth Bearer `{{token}}` a nivel de coleccion y un script en auth > Login que guarda el token.

## Verificacion
Con newman (login + todos los GET de la coleccion): 9 requests, 9 aserciones, 0 fallos.
