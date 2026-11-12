import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import {
  FolderKanban,
  Plus,
  Calendar,
  FileSpreadsheet,
  Download,
  Trash2,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Target,
  Rocket,
  PenTool,
  Building
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

      {/* Pilares de Marca Dominio Estudio (Tomados directamente de la Imagen 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="w-12 h-12 rounded-full bg-[#5dc628] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-[#2b003e]">Alta personalización</h3>
            <p className="text-xs text-slate-500 mt-1 leading-snug">
              Fortalecemos el modelo de negocio a través del diseño y desarrollo de estrategias de e-learning y apps a la medida.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="w-12 h-12 rounded-full bg-[#5dc628] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-[#2b003e]">Metodologías Innovadoras</h3>
            <p className="text-xs text-slate-500 mt-1 leading-snug">
              Compañía flexible y creativa que aplica gran sensibilidad estética y últimas tecnologías (Drupal, Apps, Chatbots IA).
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="w-12 h-12 rounded-full bg-[#5dc628] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-[#2b003e]">Soluciones exitosas</h3>
            <p className="text-xs text-slate-500 mt-1 leading-snug">
              Enfocadas en el usuario final, buscando a través de la simplicidad alcanzar los objetivos técnicos propuestos.
            </p>
          </div>
        </div>
      </div>

      {/* Cabecera Principal de Propuestas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs border-l-4 border-l-[#2b003e]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#2b003e] tracking-tight">Propuestas de Desarrollo</h1>
            <span className="text-xs bg-purple-100 text-[#2b003e] font-bold px-2.5 py-1 rounded-full border border-purple-200">
              RF-04 a RF-10
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Gestión y estimación técnica basada en datos históricos de proyectos ejecutados por <strong>Dominio Estudio</strong>.
          </p>
        </div>

        <div>
          <button
            onClick={onOpenNewProposalModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#2b003e] hover:bg-[#3d0059] text-white rounded-xl text-sm font-bold shadow-md shadow-purple-900/10 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 text-[#5dc628]" />
            <span>Nueva Propuesta</span>
          </button>
        </div>
      </div>

      {/* Listado de Propuestas */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          Cargando propuestas de Dominio Estudio...
        </div>
      ) : proposals.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-[#2b003e] flex items-center justify-center mx-auto">
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
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#2b003e] hover:bg-[#3d0059] text-white rounded-xl text-sm font-bold"
          >
            <Plus className="w-4 h-4 text-[#5dc628]" />
            <span>Crear Propuesta Ahora</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {proposals.map((p) => {
            const totals = p.totales || {};
            const comp = p.comparacion || {};
            const isHistoricalProject =
              p.nombre.includes('ICBF') ||
              p.nombre.includes('Green List') ||
              p.nombre.includes('WhatsApp') ||
              p.nombre.includes('Entidades Financieras') ||
              p.nombre.includes('Famisanar') ||
              p.nombre.includes('ISER');

            return (
              <div
                key={p.id}
                onClick={() => onSelectProposal(p.id)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#2b003e] hover:shadow-lg transition-all p-5 flex flex-col justify-between cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isHistoricalProject
                          ? 'bg-purple-100 text-[#2b003e] border border-purple-200'
                          : p.estado === 'Comparada'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {isHistoricalProject ? 'Proyecto Histórico Real' : p.estado}
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
                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#2b003e] transition-colors leading-snug">
                      {p.nombre}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Cliente: <span className="text-slate-800 font-semibold">{p.referencia_cliente}</span>
                    </p>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-[#5dc628]" />
                      <span>{p.fecha}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Layers className="w-3.5 h-3.5 text-[#5dc628]" />
                      <span>{p.total_componentes} componentes de solución</span>
                    </div>
                  </div>

                  {/* Resumen de Horas */}
                  <div className="bg-purple-50/40 p-3.5 rounded-xl border border-purple-100 space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-semibold">Horas Estimadas (PERT):</span>
                      <span className="font-black text-[#2b003e] text-sm">
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
                      <div className="pt-2 mt-2 border-t border-purple-100 flex justify-between items-center text-[11px]">
                        <span className="text-slate-700 font-bold">Est. Manual Dominio Estudio:</span>
                        <span className="font-extrabold text-amber-700">{p.estimacion_manual} hrs</span>
                      </div>
                    )}

                    {comp.comparacion_real && (
                      <div className="flex justify-between items-center text-[11px] text-emerald-800 font-bold">
                        <span>Error MRE vs Horas Reales:</span>
                        <span className="bg-emerald-100 px-1.5 py-0.2 rounded text-emerald-900">{comp.comparacion_real.mre_porcentaje}%</span>
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
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    </a>
                    <a
                      href={api.getCSVExportUrl(p.id)}
                      onClick={(e) => e.stopPropagation()}
                      download
                      title="Descargar matriz en CSV"
                      className="p-1.5 text-slate-500 hover:text-[#2b003e] hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4 text-[#2b003e]" />
                    </a>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2b003e] group-hover:text-[#5dc628] group-hover:translate-x-0.5 transition-all">
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
