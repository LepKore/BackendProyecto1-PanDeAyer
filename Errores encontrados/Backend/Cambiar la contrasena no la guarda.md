# Cambiar la contrasena no la guarda

## Area del error
Backend

## Archivos
`src/users/users.service.ts`

## Diagnostico
`changePassword` calculaba el nuevo hash pero devolvia el usuario sin `save()`. La API respondia 200 con un token nuevo, pero la clave seguia siendo la anterior.

## Plan implementado de solucion
Se usa `setPassword()`, que guarda el hash y `passwordChangedAt`.

## Verificacion
Prueba real: tras cambiarla, el login funciona con la nueva y falla con la vieja (luego se restauro la clave de prueba).
