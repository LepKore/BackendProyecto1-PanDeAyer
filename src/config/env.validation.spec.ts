import { validateEnv } from './env.validation';

const base = {
  PORT: '3000',
  MONGODB_URI: 'mongodb://localhost:27017/universidad',
  JWT_SECRET: 'secreto-de-prueba-largo-123',
  JWT_EXPIRES_IN_SECONDS: '3600',
  ADMIN_EMAIL: 'admin@universidad.edu',
  ADMIN_PASSWORD: 'Secret123!',
};

describe('validateEnv', () => {
  it('acepta una configuracion valida', () => {
    const result = validateEnv({ ...base });
    expect(result.MONGODB_URI).toBe(base.MONGODB_URI);
  });

  it('convierte los numeros del .env, que llegan como texto', () => {
    const result = validateEnv({ ...base, PORT: '4000', JWT_EXPIRES_IN_SECONDS: '900' });
    expect(result.PORT).toBe(4000);
    expect(result.JWT_EXPIRES_IN_SECONDS).toBe(900);
  });

  it.each([
    ['MONGODB_URI ausente', { MONGODB_URI: undefined }],
    ['JWT_SECRET ausente', { JWT_SECRET: undefined }],
    ['ADMIN_EMAIL invalido', { ADMIN_EMAIL: 'no-es-un-correo' }],
  ])('falla con %s', (_motivo, cambios) => {
    expect(() => validateEnv({ ...base, ...cambios })).toThrow(/Variables de entorno invalidas/);
  });

  it('rechaza un JWT_SECRET muy corto', () => {
    expect(() => validateEnv({ ...base, JWT_SECRET: 'corto' })).toThrow(/JWT_SECRET/);
  });

  it('rechaza una expiracion menor a 60 segundos', () => {
    expect(() => validateEnv({ ...base, JWT_EXPIRES_IN_SECONDS: '30' })).toThrow(/JWT_EXPIRES_IN_SECONDS/);
  });

  it('rechaza un puerto fuera de rango', () => {
    expect(() => validateEnv({ ...base, PORT: '70000' })).toThrow(/PORT/);
  });
});