import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import {
  BarChart3,
  TrendingDown,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Layers,
  Sparkles,
  FileText,
  Sliders,
  ArrowRight
} from 'lucide-react';

export default function ComparisonView({ targetProposalId, onSelectProposal }) {
  const [proposals, setProposals] = useState([]);
  const [selectedId, setSelectedId] = useState(targetProposalId || null);
  const [proposalDetail, setProposalDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form para registrar estimación manual y horas reales (RF-10)
  const [manualEstInput, setManualEstInput] = useState('');
  const [realHoursInput, setRealHoursInput] = useState('');

  useEffect(() => {
    loadProposals();
  }, []);

  useEffect(() => {
    if (selectedId) {
      loadProposalDetail(selectedId);
    }
  }, [selectedId]);

  async function loadProposals() {
    setLoading(true);
    try {
      const res = await api.getProposals();
      setProposals(res.data);
      if (!selectedId && res.data.length > 0) {
        // Seleccionar por defecto la propuesta histórica o la primera
        const historical = res.data.find(
          (p) => p.nombre.includes('Caso de Estudio ISER') || p.id === 1
        );
        setSelectedId(historical ? historical.id : res.data[0].id);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadProposalDetail(id) {
    try {
      const res = await api.getProposalById(id);
      setProposalDetail(res.data);
      setManualEstInput(res.data.estimacion_manual !== null ? res.data.estimacion_manual : '');
      setRealHoursInput(res.data.horas_reales !== null ? res.data.horas_reales : '');
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  async function handleSaveComparison(e) {
    e.preventDefault();
    if (!selectedId) return;
    setSaving(true);
    setErrorMsg('');

    try {
      await api.updateComparison(selectedId, {
        estimacion_manual: manualEstInput ? Number(manualEstInput) : null,
        horas_reales: realHoursInput ? Number(realHoursInput) : null,
        estado: 'Comparada'
      });
      setSuccessMsg('Datos de comparación registrados y métricas MRE actualizadas');
      loadProposalDetail(selectedId);
      loadProposals();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  }

  const totals = proposalDetail?.totales || {};
  const comp = proposalDetail?.comparacion || {};
  const compReal = comp.comparacion_real;
  const compManual = comp.comparacion_manual;

  // Cálculo de porcentajes para barras de comparación visual
  const maxHours = Math.max(
    totals.total_con_reserva || 0,
    Number(manualEstInput) || 0,
    Number(realHoursInput) || 0,
    1
  );

  return (
    <div className="space-y-6">
      {/* Alertas */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-red-600 font-bold">×</button>
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-600 font-bold">×</button>
        </div>
      )}

      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Comparación y Validación con Histórico
            </h1>
            <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2.5 py-1 rounded-full border border-purple-200">
              RF-10 & Sección 10
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Contraste entre las horas generadas por el prototipo, la estimación manual del personal senior y las horas reales ejecutadas.
          </p>
        </div>

        {/* Selector de propuesta */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Propuesta:</span>
          <select
            value={selectedId || ''}
            onChange={(e) => setSelectedId(Number(e.target.value))}
            className="px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {proposals.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} {p.id === 1 ? '★ (Caso Histórico)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {proposalDetail && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda: Métricas y Contraste MRE */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gráfico Comparativo de Barras */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <h2 className="font-bold text-base text-slate-900">
                    Contraste de Horas: Prototipo vs Manual Senior vs Horas Reales
                  </h2>
                </div>
                <button
                  onClick={() => onSelectProposal(proposalDetail.id)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Ver Matriz</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Barras de progreso / comparación */}
              <div className="space-y-4">
                {/* 1. Prototipo */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-blue-900 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                      Prototipo Paramétrico (PERT Cohn 2005)
                    </span>
                    <span className="font-mono font-black text-blue-700 text-sm">
                      {totals.total_con_reserva || 0} hrs
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, ((totals.total_con_reserva || 0) / maxHours) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    Base: {totals.base_total_horas}h + Reserva {totals.reserva_porcentaje}% ({totals.horas_reserva}h) | Rango: ±{totals.desviacion_total}h
                  </span>
                </div>

                {/* 2. Estimación Manual Senior */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      Estimación Manual Previa (Juicio de Experto Senior)
                    </span>
                    <span className="font-mono font-black text-slate-800 text-sm">
                      {manualEstInput ? `${manualEstInput} hrs` : 'No registrada'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, ((Number(manualEstInput) || 0) / maxHours) * 100)}%` }}
                    ></div>
                  </div>
                  {compManual ? (
                    <span className="text-[10px] text-slate-500 block">
                      Diferencia con Prototipo: {compManual.diferencia_horas > 0 ? `+${compManual.diferencia_horas}h` : `${compManual.diferencia_horas}h`} ({compManual.diferencia_porcentaje}%)
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 block">Registre la cifra para calcular la variabilidad</span>
                  )}
                </div>

                {/* 3. Horas Reales */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                      Horas Reales Ejecutadas (Dato Final del Proyecto)
                    </span>
                    <span className="font-mono font-black text-emerald-800 text-sm">
                      {realHoursInput ? `${realHoursInput} hrs` : 'Pendiente / En ejecución'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, ((Number(realHoursInput) || 0) / maxHours) * 100)}%` }}
                    ></div>
                  </div>
                  {compReal ? (
                    <span className="text-[10px] text-emerald-700 font-semibold block">
                      Diferencia con Horas Reales: {compReal.diferencia_horas > 0 ? `+${compReal.diferencia_horas}h` : `${compReal.diferencia_horas}h`} ({compReal.diferencia_porcentaje}%)
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 block">Disponible una vez finalizado el proyecto</span>
                  )}
                </div>
              </div>
            </div>

            {/* Tarjetas de Cálculo MRE (Fórmula Sección 10) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-500 uppercase block">Error Relativo (MRE)</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-blue-700">
                    {compReal ? `${compReal.mre_porcentaje}%` : 'N/A'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {compReal ? `(${compReal.mre})` : ''}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  MRE = |real − estimado| / real
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-500 uppercase block">MRE Estimación Manual</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-700">
                    {compReal?.mre_manual_porcentaje !== null && compReal?.mre_manual_porcentaje !== undefined
                      ? `${compReal.mre_manual_porcentaje}%`
                      : 'N/A'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  MRE Senior = |real − manual| / real
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-500 uppercase block">Precisión del Prototipo</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-700">
                    {compReal ? `${compReal.precision}%` : 'N/A'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  100% − MRE
                </p>
              </div>
            </div>

            {/* Desglose por Componente de la Solución */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Distribución de Horas por Componente</span>
              </h3>

              <div className="space-y-3">
                {totals.componentes?.map((compItem) => {
                  const pct = totals.base_total_horas > 0
                    ? ((compItem.subtotal_horas / totals.base_total_horas) * 100).toFixed(1)
                    : 0;

                  return (
                    <div key={compItem.id} className="text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-800">
                          {compItem.nombre}
                          <span className="text-[10px] text-slate-400 font-normal ml-2">
                            ({compItem.complejidad}, f={compItem.factor_f})
                          </span>
                        </span>
                        <span className="font-mono font-bold text-slate-700">
                          {compItem.subtotal_horas}h ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Formulario de Actualización y Registro (RF-10) */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-base text-slate-900 mb-1">
                Registrar Datos de Contraste (RF-10)
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Permite registrar la estimación que el personal senior calculó de manera manual y las horas reales registradas al finalizar.
              </p>

              <form onSubmit={handleSaveComparison} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Estimación Manual Senior (Horas)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    placeholder="Ej: 210"
                    value={manualEstInput}
                    onChange={(e) => setManualEstInput(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Cifra estimada con juicio de expertos antes de usar el prototipo.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Horas Reales Ejecutadas (Opcional)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    placeholder="Ej: 232.5"
                    value={realHoursInput}
                    onChange={(e) => setRealHoursInput(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Horas efectivas registradas en los partes de trabajo de la empresa.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Actualizar Comparación y Recalcular MRE'}
                </button>
              </form>
            </div>

            {/* Hallazgo y Resumen según Trabajo de Grado */}
            <div className="bg-indigo-50/70 p-5 rounded-2xl border border-indigo-100 text-xs text-indigo-950 space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                <h4 className="font-bold text-sm">Conclusión de Validación ISER</h4>
              </div>
              <p className="text-slate-600 leading-relaxed">
                El prototipo combina la descomposición en componentes del catálogo, el rango paramétrico de tres valores (PERT) y las horas históricas previas de Dominio Estudio.
              </p>
              <div className="space-y-1.5 pt-1 text-[11px] text-slate-700">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Reduce la dependencia y carga sobre el personal senior.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Disminuye el tiempo de preparación de la matriz de horas.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Aporta trazabilidad y auditoría a cada cifra calculada.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
