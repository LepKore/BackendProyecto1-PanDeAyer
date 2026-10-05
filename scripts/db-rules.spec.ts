const { validate, loadData } = require('./db-rules');

describe('integridad de database/*.json', () => {
  it('los datos versionados no tienen referencias huerfanas ni indices unicos repetidos', () => {
    const { problems } = validate(loadData());
    // Si falla, revisar con: npm run db:validate
    expect(problems).toEqual([]);
  });
});

// Datos minimos para probar cada regla sin depender de los JSON reales
const estudiante = (id: string) => ({ _id: id, code: `E-${id}`, program: 'prog-1', user: id });
const grupo = (id: string, overrides: Record<string, unknown> = {}) => ({
  _id: id,
  subject: 'mat-1',
  teacher: 'doc-1',
  period: 'per-1',
  number: 1,
  schedule: [{ classroom: 'sal-1' }],
  ...overrides,
});

describe('validador de integridad', () => {
  it('acepta un conjunto coherente', () => {
    const { problems } = validate({
      students: [estudiante('e1')],
      programs: [{ _id: 'prog-1', code: 'ISIS' }],
      groups: [grupo('g1')],
      subjects: [{ _id: 'mat-1', code: 'MAT101' }],
      teachers: [{ _id: 'doc-1' }],
      periods: [{ _id: 'per-1', code: '2026-2' }],
      classrooms: [{ _id: 'sal-1' }],
    });
    expect(problems).toEqual([]);
  });

  it('detecta una referencia a un _id inexistente', () => {
    const { problems } = validate({
      students: [estudiante('e1')],
      programs: [], // el estudiante apunta a prog-1, que no existe
    });
    expect(problems).toContain('students.program: el _id prog-1 no existe en programs');
  });

  it('detecta dos matriculas del mismo estudiante en el mismo grupo', () => {
    const { problems } = validate({
      enrollments: [
        { _id: 'm1', student: 'e1', group: 'g1', subject: 'mat-1', period: 'per-1' },
        { _id: 'm2', student: 'e1', group: 'g1', subject: 'mat-1', period: 'per-1' },
      ],
    });
    expect(problems[0]).toContain('repiten el indice unico student+group');
  });

  it('detecta dos programas con el mismo codigo', () => {
    const { problems } = validate({
      programs: [
        { _id: 'p1', code: 'DERE' },
        { _id: 'p2', code: 'DERE' },
      ],
    });
    expect(problems[0]).toContain('repiten el indice unico code');
  });

  it('detecta dos estudiantes con el mismo codigo', () => {
    const { problems } = validate({
      students: [
        { _id: 'e1', user: 'u1', code: 'E2026001', program: 'prog-1' },
        { _id: 'e2', user: 'u2', code: 'E2026001', program: 'prog-1' },
      ],
      programs: [{ _id: 'prog-1' }],
    });
    expect(problems[0]).toContain('repiten el indice unico code');
  });

  it('detecta una matricula cuya materia no es la de su grupo', () => {
    const { problems } = validate({
      groups: [grupo('g1', { subject: 'mat-1' })],
      subjects: [
        { _id: 'mat-1' },
        { _id: 'mat-2' },
      ],
      periods: [{ _id: 'per-1' }],
      enrollments: [{ _id: 'm1', student: 'e1', group: 'g1', subject: 'mat-2', period: 'per-1' }],
    });
    expect(problems.some((p: string) => p.includes('es de la materia mat-2'))).toBe(true);
  });

  it('detecta una matricula de un periodo distinto al de su grupo', () => {
    const { problems } = validate({
      groups: [grupo('g1', { period: 'per-1' })],
      subjects: [{ _id: 'mat-1' }],
      enrollments: [{ _id: 'm1', student: 'e1', group: 'g1', subject: 'mat-1', period: 'per-2' }],
    });
    expect(problems.some((p: string) => p.includes('es del periodo per-2'))).toBe(true);
  });

  it('detecta un aula inexistente dentro del horario de un grupo', () => {
    const { problems } = validate({
      groups: [grupo('g1')],
      subjects: [{ _id: 'mat-1' }],
      teachers: [{ _id: 'doc-1' }],
      periods: [{ _id: 'per-1', code: '2026-2' }],
      classrooms: [], // el grupo usa sal-1, que no esta
    });
    expect(problems).toContain('groups.schedule.classroom: el _id sal-1 no existe en classrooms');
  });

  it('detecta prerrequisitos que apuntan a materias inexistentes', () => {
    const { problems } = validate({
      subjects: [{ _id: 'mat-1', code: 'MAT101', program: 'prog-1', prerequisites: ['mat-9'] }],
      programs: [{ _id: 'prog-1' }],
    });
    expect(problems).toContain('subjects.prerequisites: el _id mat-9 no existe en subjects');
  });

  it('detecta el mismo _id en dos colecciones', () => {
    const { problems } = validate({
      programs: [{ _id: 'dup', code: 'A' }],
      subjects: [{ _id: 'dup', code: 'B' }],
    });
    expect(problems.some((p: string) => p.includes('ya existe en'))).toBe(true);
  });

  it('no marca problema cuando un grupo repite materia pero cambia el periodo', () => {
    // El indice real de groups es subject+period+number, no solo subject
    const { problems } = validate({
      groups: [grupo('g1', { period: 'per-1' }), grupo('g2', { period: 'per-2' })],
      subjects: [{ _id: 'mat-1' }],
      periods: [
        { _id: 'per-1', code: '2026-1' },
        { _id: 'per-2', code: '2026-2' },
      ],
      teachers: [{ _id: 'doc-1' }],
      classrooms: [{ _id: 'sal-1' }],
    });
    expect(problems).toEqual([]);
  });
});