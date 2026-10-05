# El token JWT vence en 3.6 segundos

## Area del error
Backend

## Archivos
`src/auth/auth.module.ts`

## Diagnostico
La expiracion se configuraba como `expiresIn: String(JWT_EXPIRES_IN_SECONDS)`, es decir el texto `"3600"`. La libreria `jsonwebtoken` interpreta un texto sin unidad como **milisegundos**, asi que el token duraba 3.6 segundos en vez de 1 hora y la sesion vencia casi de inmediato.

## Plan implementado de solucion
Se paso el valor como numero: `expiresIn: Number(config.getOrThrow<number>('JWT_EXPIRES_IN_SECONDS'))`. Un numero se interpreta en segundos. Se quito el import de tipo `StringValue`, que ya no se usa.

## Verificacion
En el token emitido `exp - iat = 3600` segundos.
