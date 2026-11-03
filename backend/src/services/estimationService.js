/**
 * Servicio de Estimación PERT / Tres Puntos y Reglas de Negocio
 * Basado en Cohn (2005) y especificaciones técnicas de Dominio Estudio
 */

function calculatePERT(O, M, P) {
  const oVal = Number(O) || 0;
  const mVal = Number(M) || 0;
  const pVal = Number(P) || 0;

  // Fórmula PERT: E = (O + 4M + P) / 6
  const E = (oVal + 4 * mVal + pVal) / 6;

  // Desviación estándar: sigma = (P - O) / 6
  const sigma = Math.max(0, (pVal - oVal) / 6);

  return {
    horasEsperadas: Number(E.toFixed(2)),
    desviacion: Number(sigma.toFixed(2))
  };
}

function calculateMedian(values) {
  if (!values || values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[mid];
  }
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Determina O, M y P a partir de las referencias históricas de una tarea.
 * Según especificación (Sección 7 del documento):
 * - Varias referencias: O es la menor, M la mediana y P la mayor.
 * - Una referencia: M toma ese valor, O y P se calibran por factor (0.8 y 1.3 por defecto).
 * - Sin referencias: valores base por defecto.
 */
function deriveOMPFromReferences(references = []) {
  if (!references || references.length === 0) {
    return {
      O: 4.0,
      M: 8.0,
      P: 16.0,
      fuente: 'Valores base iniciales (sin referencias previas)',
      totalReferencias: 0
    };
  }

  const hours = references.map((r) => Number(r.horas)).filter((h) => !isNaN(h) && h > 0);

  if (hours.length === 0) {
    return {
      O: 4.0,
      M: 8.0,
      P: 16.0,
      fuente: 'Valores base iniciales',
      totalReferencias: 0
    };
  }

  if (hours.length === 1) {
    const single = hours[0];
    const O = Number((single * 0.8).toFixed(2));
    const M = Number(single.toFixed(2));
    const P = Number((single * 1.3).toFixed(2));
    return {
      O,
      M,
      P,
      fuente: `1 referencia histórica (${references[0].proyecto_origen}: ${single}h)`,
      totalReferencias: 1
    };
  }

  const sorted = [...hours].sort((a, b) => a - b);
  const O = Number(sorted[0].toFixed(2));
  const M = Number(calculateMedian(sorted).toFixed(2));
  const P = Number(sorted[sorted.length - 1].toFixed(2));

  return {
    O,
    M,
    P,
    fuente: `${hours.length} referencias históricas (rango: ${O}h - ${P}h, mediana: ${M}h)`,
    totalReferencias: hours.length
  };
}

/**
 * Obtiene el factor de complejidad numérico
 */
function getComplexityFactor(complejidad, customFactors = {}) {
  const comp = (complejidad || 'media').toLowerCase();
  const factors = {
    baja: customFactors.factor_baja !== undefined ? Number(customFactors.factor_baja) : 0.8,
    media: customFactors.factor_media !== undefined ? Number(customFactors.factor_media) : 1.0,
    alta: customFactors.factor_alta !== undefined ? Number(customFactors.factor_alta) : 1.3
  };

  return factors[comp] !== undefined ? factors[comp] : 1.0;
}

/**
 * Calcula el ajuste por complejidad
 * H = E * f
 */
function calculateAdjustedHours(horasEsperadas, factor) {
  const H = Number(horasEsperadas) * Number(factor);
  return Number(H.toFixed(2));
}

/**
 * Calcula métricas completas para una propuesta armada
 */
function calculateProposalTotals(componentesData = [], config = {}) {
  const reservaPorcentaje = Number(config.reserva_porcentaje || 10.0);
  let baseTotalHoras = 0;
  let sumaVarianzaTotal = 0;

  const componentesProcesados = componentesData.map((comp) => {
    let subtotalHorasComp = 0;
    let varianzaComp = 0;

    const tareasProcesadas = (comp.tareas || []).map((t) => {
      const pert = calculatePERT(t.O, t.M, t.P);
      const horasEsperadas = t.horas_esperadas !== undefined ? Number(t.horas_esperadas) : pert.horasEsperadas;
      const desviacion = t.desviacion !== undefined ? Number(t.desviacion) : pert.desviacion;

      // Si ha sido editado manualmente, prevalece la hora editada pero se conserva trazabilidad
      let horasFinales;
      let editado = Boolean(t.editado_manualmente);

      if (editado && t.horas_editadas !== null && t.horas_editadas !== undefined) {
        horasFinales = Number(Number(t.horas_editadas).toFixed(2));
      } else {
        horasFinales = calculateAdjustedHours(horasEsperadas, comp.factor_f);
      }

      subtotalHorasComp += horasFinales;
      varianzaComp += Math.pow(desviacion, 2);

      return {
        ...t,
        O: Number(Number(t.O).toFixed(2)),
        M: Number(Number(t.M).toFixed(2)),
        P: Number(Number(t.P).toFixed(2)),
        horas_esperadas: horasEsperadas,
        horas_ajustadas: horasFinales,
        desviacion: desviacion,
        rango_tarea: [
          Math.max(0, Number((horasFinales - desviacion).toFixed(2))),
          Number((horasFinales + desviacion).toFixed(2))
        ]
      };
    });

    const desviacionComp = Math.sqrt(varianzaComp);
    subtotalHorasComp = Number(subtotalHorasComp.toFixed(2));

    baseTotalHoras += subtotalHorasComp;
    sumaVarianzaTotal += varianzaComp;

    return {
      ...comp,
      subtotal_horas: subtotalHorasComp,
      desviacion: Number(desviacionComp.toFixed(2)),
      rango_componente: [
        Math.max(0, Number((subtotalHorasComp - desviacionComp).toFixed(2))),
        Number((subtotalHorasComp + desviacionComp).toFixed(2))
      ],
      tareas: tareasProcesadas
    };
  });

  baseTotalHoras = Number(baseTotalHoras.toFixed(2));
  const horasReserva = Number(((baseTotalHoras * reservaPorcentaje) / 100).toFixed(2));
  const totalConReserva = Number((baseTotalHoras + horasReserva).toFixed(2));

  const desviacionTotal = Number(Math.sqrt(sumaVarianzaTotal).toFixed(2));
  const intervaloTotal = [
    Math.max(0, Number((totalConReserva - desviacionTotal).toFixed(2))),
    Number((totalConReserva + desviacionTotal).toFixed(2))
  ];

  return {
    base_total_horas: baseTotalHoras,
    reserva_porcentaje: reservaPorcentaje,
    horas_reserva: horasReserva,
    total_con_reserva: totalConReserva,
    desviacion_total: desviacionTotal,
    intervalo_total: intervaloTotal,
    componentes: componentesProcesados
  };
}

/**
 * Calcula comparación entre estimación del prototipo, estimación manual y horas reales
 * Conforme a Sección 10: MRE = |real - estimado| / real y diferencias porcentuales
 */
function calculateComparison({ totalEstimado, estimacionManual, horasReales }) {
  const result = {
    total_estimado: Number(totalEstimado || 0),
    estimacion_manual: estimacionManual !== null && estimacionManual !== undefined ? Number(estimacionManual) : null,
    horas_reales: horasReales !== null && horasReales !== undefined ? Number(horasReales) : null,
    comparacion_manual: null,
    comparacion_real: null
  };

  if (result.estimacion_manual && result.estimacion_manual > 0) {
    const diffManual = Number((result.total_estimado - result.estimacion_manual).toFixed(2));
    const diffPctManual = Number(((diffManual / result.estimacion_manual) * 100).toFixed(2));
    result.comparacion_manual = {
      diferencia_horas: diffManual,
      diferencia_porcentaje: diffPctManual,
      interpretacion:
        diffManual > 0
          ? `El prototipo estima +${diffManual}h (+${diffPctManual}%) respecto a la estimación manual senior.`
          : diffManual < 0
          ? `El prototipo estima ${diffManual}h (${diffPctManual}%) respecto a la estimación manual senior.`
          : 'Estimaciones idénticas.'
    };
  }

  if (result.horas_reales && result.horas_reales > 0) {
    const diffReal = Number((result.total_estimado - result.horas_reales).toFixed(2));
    const diffPctReal = Number(((diffReal / result.horas_reales) * 100).toFixed(2));
    const mre = Number((Math.abs(result.horas_reales - result.total_estimado) / result.horas_reales).toFixed(4));
    const mrePorcentaje = Number((mre * 100).toFixed(2));

    // MRE también para estimación manual si existe
    let mreManual = null;
    if (result.estimacion_manual && result.estimacion_manual > 0) {
      mreManual = Number(
        (Math.abs(result.horas_reales - result.estimacion_manual) / result.horas_reales).toFixed(4)
      );
    }

    result.comparacion_real = {
      diferencia_horas: diffReal,
      diferencia_porcentaje: diffPctReal,
      mre: mre,
      mre_porcentaje: mrePorcentaje,
      mre_manual: mreManual,
      mre_manual_porcentaje: mreManual !== null ? Number((mreManual * 100).toFixed(2)) : null,
      precision: Number((Math.max(0, 1 - mre) * 100).toFixed(2)),
      mejora_vs_manual:
        mreManual !== null
          ? Number(((mreManual - mre) * 100).toFixed(2))
          : null
    };
  }

  return result;
}

module.exports = {
  calculatePERT,
  calculateMedian,
  deriveOMPFromReferences,
  getComplexityFactor,
  calculateAdjustedHours,
  calculateProposalTotals,
  calculateComparison
};
