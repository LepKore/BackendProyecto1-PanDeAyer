import { BadRequestException } from '@nestjs/common';
import { ParseObjectIdPipe } from './parse-object-id.pipe';

describe('ParseObjectIdPipe', () => {
  const pipe = new ParseObjectIdPipe();

  it('deja pasar un ObjectId de 24 caracteres hexadecimales', () => {
    expect(pipe.transform('6abf0b8bfead57fb41c12a38')).toBe('6abf0b8bfead57fb41c12a38');
  });

  it('acepta mayusculas', () => {
    expect(pipe.transform('6ABF0B8BFEAD57FB41C12A38')).toBe('6ABF0B8BFEAD57FB41C12A38');
  });

  it.each([
    ['id corto', '6abf0b8b'],
    ['con guion', '6abf0b8b-fead57fb-41c12a38'],
    ['no hexadecimal', 'zzzzzzzzzzzzzzzzzzzzzzzz'],
    ['vacio', ''],
    ['un ObjectId de mongoose', 'ObjectId("6abf0b8bfead57fb41c12a38")'],
  ])('rechaza %s', (_motivo, valor) => {
    expect(() => pipe.transform(valor)).toThrow(BadRequestException);
  });
});