# Todos los logins esperan 5 segundos

## Area del error
Backend

## Archivos
`src/auth/auth.service.ts`

## Diagnostico
`slowDownAttempts()` (espera de 5000 ms contra fuerza bruta) se ejecutaba al inicio de `login()`, es decir tambien en los ingresos correctos. Cada inicio de sesion tardaba mas de 5 segundos, lo que se percibe como que la aplicacion esta colgada.

## Plan implementado de solucion
La espera ahora se aplica solo cuando las credenciales son invalidas, y se redujo a 1000 ms. Se mantiene el mismo mensaje `Credenciales invalidas` para correo inexistente o clave incorrecta.

## Verificacion
Un login correcto responde de inmediato; uno incorrecto responde 401 despues de ~1 s.
