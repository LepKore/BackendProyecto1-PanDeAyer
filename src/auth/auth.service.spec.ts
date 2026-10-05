import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { Role } from '../common/enums/role.enum';

const PASSWORD = 'Secret123!';

// El hash se calcula una vez para que las pruebas no tarden mas de lo necesario
let passwordHash: string;

beforeAll(async () => {
  passwordHash = await bcrypt.hash(PASSWORD, 10);
});

const usuario = (over: Record<string, unknown> = {}) =>
  ({
    _id: '6abf0b8bfead57fb41c12a38',
    id: '6abf0b8bfead57fb41c12a38',
    name: 'Administrador',
    email: 'admin@universidad.edu',
    passwordHash,
    role: Role.Admin,
    active: true,
    ...over,
  }) as never;

describe('AuthService.login', () => {
  let usersService: { findByEmailWithPassword: jest.Mock };
  let jwtService: { signAsync: jest.Mock };
  let service: AuthService;

  beforeEach(() => {
    usersService = { findByEmailWithPassword: jest.fn() };
    jwtService = { signAsync: jest.fn().mockResolvedValue('token-falso') };
    service = new AuthService(usersService as never, jwtService as never);
  });

  it('devuelve un token cuando las credenciales son correctas', async () => {
    usersService.findByEmailWithPassword.mockResolvedValue(usuario());

    const result = await service.login({ email: 'admin@universidad.edu', password: PASSWORD });

    expect(result).toEqual({ accessToken: 'token-falso' });
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: '6abf0b8bfead57fb41c12a38',
      email: 'admin@universidad.edu',
      role: Role.Admin,
    });
  });

  it('rechaza una clave incorrecta', async () => {
    usersService.findByEmailWithPassword.mockResolvedValue(usuario());
    await expect(service.login({ email: 'admin@universidad.edu', password: 'otra-clave' })).rejects.toThrow(
      UnauthorizedException,
    );
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });

  it('rechaza un correo inexistente sin emitir token', async () => {
    usersService.findByEmailWithPassword.mockResolvedValue(null);
    await expect(service.login({ email: 'nadie@universidad.edu', password: PASSWORD })).rejects.toThrow(
      UnauthorizedException,
    );
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });

  it('rechaza un usuario inactivo', async () => {
    usersService.findByEmailWithPassword.mockResolvedValue(usuario({ active: false }));
    await expect(service.login({ email: 'admin@universidad.edu', password: PASSWORD })).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('no revela si el correo existe: mismo error y mismo tiempo en ambos casos', async () => {
    const errorConCorreo = await service
      .login({ email: 'admin@universidad.edu', password: 'mala' })
      .then(() => null)
      .catch((e: Error) => e);
    const errorSinCorreo = await service
      .login({ email: 'nadie@universidad.edu', password: 'mala' })
      .then(() => null)
      .catch((e: Error) => e);

    expect(errorConCorreo).toBeInstanceOf(UnauthorizedException);
    expect(errorSinCorreo).toBeInstanceOf(UnauthorizedException);
    expect((errorConCorreo as Error).message).toBe((errorSinCorreo as Error).message);
  });
});