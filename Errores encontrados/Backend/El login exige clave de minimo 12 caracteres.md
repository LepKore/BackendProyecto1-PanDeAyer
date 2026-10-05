# El login exige clave de minimo 12 caracteres

## Area del error
Backend

## Archivos
`src/auth/dto/login.dto.ts`

## Diagnostico
El DTO de login tenia `@MinLength(12)` en `password`. Las claves de los usuarios (`Secret123!`, 10 caracteres) y la regla de creacion de claves (`@MinLength(8)` en `create-user.dto.ts`) son mas cortas, asi que **ningun usuario podia iniciar sesion**: la API respondia `400 password must be longer than or equal to 12 characters`. Ademas el ejemplo de Swagger (`Admin12345`) no correspondia a ninguna clave real.

## Plan implementado de solucion
Se quito `@MinLength(12)` del login: las reglas de longitud aplican al crear la clave, no al ingresar. Se dejaron `@IsString()` y `@IsNotEmpty()` y se corrigio el ejemplo a `Secret123!`.

## Verificacion
Los tres usuarios de prueba del README obtienen `accessToken`.
