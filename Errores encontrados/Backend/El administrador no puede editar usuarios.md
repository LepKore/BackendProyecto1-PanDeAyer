# El administrador no puede editar usuarios

## Area del error
Backend

## Archivos
`src/users/dto/user.dto.ts`

## Diagnostico
`UpdateUserDto` declaraba `namesssss` en vez de `name`. El formulario de Usuarios envia `name`, y con `forbidNonWhitelisted` la API respondia 400 "property name should not exist". Swagger tambien documentaba `namesssss`.

## Plan implementado de solucion
El campo se llama `name`.

## Verificacion
`PATCH /users/:id {name}` responde 200 y Swagger muestra `name`.
