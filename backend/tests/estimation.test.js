const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  calculatePERT,
  calculateMedian,
  deriveOMPFromReferences,
  getComplexityFactor,
  calculateAdjustedHours,
  calculateProposalTotals,
  calculateComparison
} = require('../src/services/estimationService');

describe('Pruebas Unitarias del Motor de Estimación (PERT y Dominio Estudio)', () => {
  it('RF-07: Debe calcular correctamente horas esperadas y desviación PERT (O=10, M=16, P=28)', () => {
    // E = (10 + 4*16 + 28) / 6 = (10 + 64 + 28) / 6 = 102 / 6 = 17.0
    // sigma = (28 - 10) / 6 = 18 / 6 = 3.0
    const res = calculatePERT(10, 16, 28);
    assert.equal(res.horasEsperadas, 17.0);
    assert.equal(res.desviacion, 3.0);
  });

  it('RF-06: Debe aplicar correctamente los factores de complejidad (baja: 0.8, media: 1.0, alta: 1.3)', () => {
    assert.equal(getComplexityFactor('baja'), 0.8);
    assert.equal(getComplexityFactor('media'), 1.0);
    assert.equal(getComplexityFactor('alta'), 1.3);

    // Ajuste H = E * f
    const e = 20.0;
    assert.equal(calculateAdjustedHours(e, 0.8), 16.0);
    assert.equal(calculateAdjustedHours(e, 1.0), 20.0);
    assert.equal(calculateAdjustedHours(e, 1.3), 26.0);
  });

  it('RF-03 & Sección 7: Debe derivar O, M, P a partir de referencias históricas', () => {
    // Caso con múltiples referencias: [8, 12, 16] -> O=8, M=12, P=16
    const refs = [
      { proyecto_origen: 'Proj A', horas: 16 },
      { proyecto_origen: 'Proj B', horas: 8 },
      { proyecto_origen: 'Proj C', horas: 12 }
    ];
    const omp = deriveOMPFromReferences(refs);
    assert.equal(omp.O, 8);
    assert.equal(omp.M, 12);
    assert.equal(omp.P, 16);
    assert.equal(omp.totalReferencias, 3);

    // Caso con una sola referencia: 10h -> M=10, O=8, P=13
    const single = [{ proyecto_origen: 'Proj X', horas: 10 }];
    const ompSingle = deriveOMPFromReferences(single);
    assert.equal(ompSingle.M, 10);
    assert.equal(ompSingle.O, 8);
    assert.equal(ompSingle.P, 13);
  });

  it('RF-07: Debe calcular totales de propuesta con reserva configurable e intervalos', () => {
    const mockComponentes = [
      {
        id: 1,
        nombre: 'Autenticación y Roles',
        factor_f: 1.0,
        tareas: [
          { O: 6, M: 10, P: 20, horas_esperadas: 11.0, desviacion: 2.33 }
        ]
      }
    ];

    const totals = calculateProposalTotals(mockComponentes, { reserva_porcentaje: 10 });
    assert.equal(totals.base_total_horas, 11.0);
    assert.equal(totals.horas_reserva, 1.1);
    assert.equal(totals.total_con_reserva, 12.1);
    assert.ok(totals.desviacion_total > 0);
  });

  it('RF-10: Debe calcular la comparación con estimación manual y el error relativo MRE', () => {
    // Horas reales: 100, Prototipo: 108, Manual: 80
    // MRE = |100 - 108| / 100 = 8 / 100 = 0.08 (8%)
    // MRE manual = |100 - 80| / 100 = 20 / 100 = 0.20 (20%)
    const comp = calculateComparison({
      totalEstimado: 108,
      estimacionManual: 80,
      horasReales: 100
    });

    assert.equal(comp.comparacion_real.mre, 0.08);
    assert.equal(comp.comparacion_real.mre_porcentaje, 8.0);
    assert.equal(comp.comparacion_real.mre_manual, 0.20);
    assert.equal(comp.comparacion_manual.diferencia_horas, 28);
    assert.equal(comp.comparacion_manual.diferencia_porcentaje, 35.0);
  });
});
