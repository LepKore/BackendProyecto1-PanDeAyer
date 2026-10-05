import { escapeRegex, textPattern, toBoolean } from './query-helpers';

describe('toBoolean', () => {
  it.each([
    ['true', true],
    [true, true],
    ['false', false],
    [false, false],
  ])('convierte %p en %p', (entrada, esperado) => {
    expect(toBoolean({ value: entrada })).toBe(esperado);
  });

  it.each([['TRUE'], ['1'], ['si'], ['']])('deja intacto %p para que lo rechace IsBoolean', (entrada) => {
    expect(toBoolean({ value: entrada })).toBe(entrada);
  });
});

describe('escapeRegex', () => {
  it('escapa los metacaracteres de RegExp', () => {
    expect(escapeRegex('a.b*c')).toBe('a\\.b\\*c');
  });

  it('deja intacto un texto normal', () => {
    expect(escapeRegex('Ingenieria')).toBe('Ingenieria');
  });
});

describe('textPattern', () => {
  it('no interpreta los metacaracteres como regex', () => {
    // Sin escapar, "a.c" tambien matchearia "abc"
    expect(textPattern('a.c').test('abc')).toBe(false);
    expect(textPattern('a.c').test('a.c')).toBe(true);
  });

  it('ignora mayusculas y espacios sobrantes', () => {
    expect(textPattern('  pipelines ').test('Curso de PIPELINES')).toBe(true);
  });
});