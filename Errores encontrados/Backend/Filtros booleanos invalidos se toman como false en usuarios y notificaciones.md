# Filtros booleanos invalidos se toman como false en usuarios y notificaciones

## Area del error
Backend

## Archivos
`src/users/dto/user.dto.ts`, `src/notifications/dto/notification.dto.ts`

## Diagnostico
`UsersQueryDto.active` y `NotificationsQueryDto.read` convertian con `value === 'true' || value === true`: cualquier otro valor (`?active=abc`, `?read=si`) se volvia `false` en silencio y filtraba como "inactivos" / "leidas". El resto de la API usa `toBoolean` y responde 400 ante un valor invalido.

## Plan implementado de solucion
Ambos usan el helper compartido `toBoolean` (`common/dto/query-helpers.ts`).

## Verificacion
`GET /users?active=abc` y `GET /notifications/mine?read=abc` -> 400 "must be a boolean value"; `true`/`false` siguen funcionando (198 activos, 3 inactivos; 1 sin leer).
