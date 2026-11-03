import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import {
  FolderKanban,
  Plus,
  Calendar,
  FileSpreadsheet,
  Download,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function ProposalsList({ onSelectProposal, onOpenNewProposalModal, refreshTrigger }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadProposals();
  }, [refreshTrigger]);

  async function loadProposals() {
    setLoading(true);
    try {
      const res = await api.getProposals();
      setProposals(res.data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, e) {
    e.stopPropagation();
    if (!confirm('¿Confirma que desea eliminar esta propuesta y su matriz de estimación?')) return;
    try {
      await api.deleteProposal(id);
      setSuccessMsg('Propuesta eliminada correctamente');
      loadProposals();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Propuestas de Desarrollo</h1>
            <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-full">
              RF-04 a RF-10
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Gestión de propuestas a la medida, armado de solución modular, cálculo paramétrico de horas y comparación histórica.
          </p>
        </div>

        <div>
          <button
            onClick={onOpenNewProposalModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Propuesta</span>
          </button>
        </div>
      </div>

      {/* Listado de Propuestas */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          Cargando propuestas...
        </div>
      ) : proposals.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">No hay propuestas registradas</h3>
            <p className="text-xs text-slate-500 mt-1">
              Crea tu primera propuesta para seleccionar componentes del catálogo y generar la matriz de horas.
            </p>
          </div>
          <button
            onClick={onOpenNewProposalModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Propuesta Ahora</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {proposals.map((p) => {
            const totals = p.totales || {};
            const comp = p.comparacion || {};
            const isHistoricalCase = p.nombre.includes('Caso de Estudio ISER') || p.id === 1;

            return (
              <div
                key={p.id}
                onClick={() => onSelectProposal(p.id)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isHistoricalCase
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : p.estado === 'Comparada'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {isHistoricalCase ? 'Caso Histórico ISER' : p.estado}
                    </span>

                    <button
                      onClick={(e) => handleDelete(p.id, e)}
                      title="Eliminar propuesta"
                      className="text-slate-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {p.nombre}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Cliente: <span className="text-slate-700">{p.referencia_cliente}</span>
                    </p>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{p.fecha}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Layers className="w-3.5 h-3.5" />
                      <span>{p.total_componentes} componentes seleccionados</span>
                    </div>
                  </div>

                  {/* Resumen de Horas */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Horas Estimadas (PERT):</span>
                      <span className="font-bold text-blue-700 text-sm">
                        {totals.total_con_reserva || 0} hrs
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-500">
                      <span>Reserva contingencia:</span>
                      <span>{p.reserva_porcentaje}% ({totals.horas_reserva || 0} hrs)</span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-500">
                      <span>Rango esperado (±σ):</span>
                      <span>
                        {totals.intervalo_total ? `${totals.intervalo_total[0]}h - ${totals.intervalo_total[1]}h` : 'N/A'}
                      </span>
                    </div>

                    {/* Comparación histórica si existe */}
                    {p.estimacion_manual && (
                      <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between items-center text-[11px]">
                        <span className="text-slate-600 font-semibold">Est. Manual Senior:</span>
                        <span className="font-semibold text-slate-800">{p.estimacion_manual} hrs</span>
                      </div>
                    )}

                    {comp.comparacion_real && (
                      <div className="flex justify-between items-center text-[11px] text-emerald-700 font-semibold">
                        <span>Error MRE vs Real:</span>
                        <span>{comp.comparacion_real.mre_porcentaje}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones Rápidas */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <a
                      href={api.getExcelExportUrl(p.id)}
                      onClick={(e) => e.stopPropagation()}
                      download
                      title="Descargar matriz en Excel (.xlsx)"
                      className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                    </a>
                    <a
                      href={api.getCSVExportUrl(p.id)}
                      onClick={(e) => e.stopPropagation()}
                      download
                      title="Descargar matriz en CSV"
                      className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Ver Matriz</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
