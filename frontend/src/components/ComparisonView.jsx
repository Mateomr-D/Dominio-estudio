import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import {
  BarChart3,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

export default function ComparisonView({ targetProposalId, onSelectProposal }) {
  const [proposals, setProposals] = useState([]);
  const [selectedId, setSelectedId] = useState(targetProposalId || null);
  const [proposalDetail, setProposalDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
        setSelectedId(res.data[0].id);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs border-l-4 border-l-[#2b003e]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#2b003e] tracking-tight">
              Comparación y Validación con Histórico
            </h1>
            <span className="text-xs bg-purple-100 text-[#2b003e] font-extrabold px-2.5 py-1 rounded-full border border-purple-200">
              RF-10 & Sección 10
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Contraste entre las horas paramétricas generadas por el prototipo, la estimación manual de <strong>Dominio Estudio</strong> y las horas reales registradas.
          </p>
        </div>

        {/* Selector de propuesta */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 uppercase">Propuesta:</span>
          <select
            value={selectedId || ''}
            onChange={(e) => setSelectedId(Number(e.target.value))}
            className="px-3 py-2 text-xs font-bold border-2 border-purple-200 rounded-xl bg-purple-50/50 text-[#2b003e] focus:outline-none focus:border-[#2b003e]"
          >
            {proposals.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
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
                  <BarChart3 className="w-5 h-5 text-[#2b003e]" />
                  <h2 className="font-extrabold text-base text-slate-900">
                    Contraste: Prototipo vs Estimación Manual vs Horas Reales
                  </h2>
                </div>
                <button
                  onClick={() => onSelectProposal(proposalDetail.id)}
                  className="text-xs font-bold text-[#2b003e] hover:text-[#5dc628] flex items-center gap-1 transition-colors"
                >
                  <span>Ver Matriz</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Barras de comparación */}
              <div className="space-y-4">
                {/* 1. Prototipo */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[#2b003e] flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2b003e]"></span>
                      Prototipo Paramétrico (PERT Cohn 2005)
                    </span>
                    <span className="font-mono font-black text-[#2b003e] text-sm">
                      {totals.total_con_reserva || 0} hrs
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                    <div
                      className="bg-[#2b003e] h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, ((totals.total_con_reserva || 0) / maxHours) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Base: {totals.base_total_horas}h + Reserva {totals.reserva_porcentaje}% ({totals.horas_reserva}h) | Rango: ±{totals.desviacion_total}h
                  </span>
                </div>

                {/* 2. Estimación Manual Dominio Estudio */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      Estimación Manual de Dominio Estudio (XLSX Histórico)
                    </span>
                    <span className="font-mono font-black text-amber-800 text-sm">
                      {manualEstInput ? `${manualEstInput} hrs` : 'No registrada'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
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
                    <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#5dc628]"></span>
                      Horas Reales Ejecutadas (Proyecto Finalizado)
                    </span>
                    <span className="font-mono font-black text-emerald-800 text-sm">
                      {realHoursInput ? `${realHoursInput} hrs` : 'Pendiente / En ejecución'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                    <div
                      className="bg-[#5dc628] h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, ((Number(realHoursInput) || 0) / maxHours) * 100)}%` }}
                    ></div>
                  </div>
                  {compReal ? (
                    <span className="text-[10px] text-emerald-700 font-bold block">
                      Diferencia vs Real: {compReal.diferencia_horas > 0 ? `+${compReal.diferencia_horas}h` : `${compReal.diferencia_horas}h`} ({compReal.diferencia_porcentaje}%)
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 block">Disponible una vez concluido el proyecto</span>
                  )}
                </div>
              </div>
            </div>

            {/* Tarjetas de Cálculo MRE (Fórmula Sección 10) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs border-b-4 border-b-[#2b003e]">
                <span className="text-xs font-bold text-slate-500 uppercase block">Error Relativo (MRE)</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#2b003e]">
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

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs border-b-4 border-b-amber-500">
                <span className="text-xs font-bold text-slate-500 uppercase block">MRE Estimación Manual</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-700">
                    {compReal?.mre_manual_porcentaje !== null && compReal?.mre_manual_porcentaje !== undefined
                      ? `${compReal.mre_manual_porcentaje}%`
                      : 'N/A'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  MRE Manual = |real − manual| / real
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs border-b-4 border-b-[#5dc628]">
                <span className="text-xs font-bold text-slate-500 uppercase block">Precisión del Prototipo</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#5dc628]">
                    {compReal ? `${compReal.precision}%` : 'N/A'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  100% − MRE
                </p>
              </div>
            </div>

            {/* Desglose por Componente */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-extrabold text-sm text-[#2b003e] mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#5dc628]" />
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
                        <span className="font-mono font-bold text-[#2b003e]">
                          {compItem.subtotal_horas}h ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#2b003e] h-full rounded-full"
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
              <h3 className="font-extrabold text-base text-[#2b003e] mb-1">
                Registrar Datos de Contraste (RF-10)
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Permite registrar la estimación manual senior y las horas reales ejecutadas para evaluar la precisión del modelo.
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
                    placeholder="Ej: 572"
                    value={manualEstInput}
                    onChange={(e) => setManualEstInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2b003e] focus:outline-none font-bold"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Cifra estimada con juicio manual antes del uso del prototipo.
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
                    placeholder="Ej: 588"
                    value={realHoursInput}
                    onChange={(e) => setRealHoursInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2b003e] focus:outline-none font-bold text-emerald-800"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Horas efectivas registradas tras la finalización del proyecto.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2.5 bg-[#2b003e] hover:bg-[#3d0059] text-white rounded-xl text-xs font-bold shadow-md shadow-purple-900/20 transition-all hover:scale-[1.01] disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Actualizar Comparación y Recalcular MRE'}
                </button>
              </form>
            </div>

            {/* Hallazgo y Resumen según Trabajo de Grado */}
            <div className="bg-purple-50/70 p-5 rounded-2xl border border-purple-100 text-xs text-[#2b003e] space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#5dc628]" />
                <h4 className="font-extrabold text-sm">Conclusión de Validación ISER</h4>
              </div>
              <p className="text-slate-600 leading-relaxed">
                El prototipo combina la descomposición en componentes del catálogo, el rango paramétrico de tres valores (PERT) y las horas históricas reales de <strong>Dominio Estudio</strong>.
              </p>
              <div className="space-y-1.5 pt-1 text-[11px] text-slate-700">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#5dc628] flex-shrink-0" />
                  <span>Reduce la dependencia y carga sobre el personal senior.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#5dc628] flex-shrink-0" />
                  <span>Disminuye el tiempo de preparación de la matriz de horas en más del 85%.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#5dc628] flex-shrink-0" />
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
