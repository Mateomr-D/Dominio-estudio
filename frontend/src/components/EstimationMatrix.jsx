import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import {
  FileSpreadsheet,
  Download,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Info,
  Layers,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calendar,
  Sliders,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export default function EstimationMatrix({ proposalId, onBack, onOpenComparison }) {
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Add component modal
  const [showAddCompModal, setShowAddCompModal] = useState(false);
  const [catalogComponents, setCatalogComponents] = useState([]);
  const [selectedCompToAdd, setSelectedCompToAdd] = useState('');
  const [newCompComplexity, setNewCompComplexity] = useState('media');

  // Manual edit modal (RF-09)
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [manualHours, setManualHours] = useState('');
  const [manualJustification, setManualJustification] = useState('');

  // Traceability modal (RNF)
  const [traceabilityTask, setTraceabilityTask] = useState(null);

  useEffect(() => {
    loadProposalData();
  }, [proposalId]);

  async function loadProposalData() {
    setLoading(true);
    try {
      const res = await api.getProposalById(proposalId);
      setProposal(res.data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleComplexityChange(propCompId, newComplexity) {
    try {
      await api.updateComponentComplexity(proposalId, propCompId, newComplexity);
      setSuccessMsg(`Complejidad cambiada a ${newComplexity}. Horas recalculadas automáticamente.`);
      loadProposalData();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  async function handleRemoveComponent(propCompId) {
    if (!confirm('¿Confirma remover este componente de la estimación de la propuesta?')) return;
    try {
      await api.removeComponentFromProposal(proposalId, propCompId);
      setSuccessMsg('Componente removido de la propuesta');
      loadProposalData();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  async function handleOpenAddCompModal() {
    try {
      const res = await api.getComponents(false);
      const currentIds = (proposal?.componentes || []).map((c) => c.componente_id);
      const available = res.data.filter((c) => !currentIds.includes(c.id));
      setCatalogComponents(available);
      if (available.length > 0) {
        setSelectedCompToAdd(available[0].id);
      }
      setShowAddCompModal(true);
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  async function handleAddComponent(e) {
    e.preventDefault();
    if (!selectedCompToAdd) return;
    try {
      await api.addComponentToProposal(proposalId, selectedCompToAdd, newCompComplexity);
      setSuccessMsg('Componente añadido a la solución y tareas parametrizadas');
      setShowAddCompModal(false);
      loadProposalData();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  function handleOpenManualEdit(task, comp) {
    setEditingTask({ ...task, compNombre: comp.nombre, factor_f: comp.factor_f });
    setManualHours(task.horas_ajustadas || task.horas_esperadas);
    setManualJustification(task.justificacion || '');
    setShowEditModal(true);
  }

  async function handleSaveManualEdit(e) {
    e.preventDefault();
    if (!editingTask) return;
    try {
      await api.manualEditTask(proposalId, editingTask.id, manualHours, manualJustification);
      setSuccessMsg('Horas editadas manualmente y justificación registrada con trazabilidad');
      setShowEditModal(false);
      setEditingTask(null);
      loadProposalData();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  async function handleResetManualEdit(propTaskId) {
    if (!confirm('¿Desea restablecer esta tarea a su cálculo paramétrico PERT original?')) return;
    try {
      await api.resetManualEditTask(proposalId, propTaskId);
      setSuccessMsg('Tarea restablecida al cálculo PERT paramétrico');
      loadProposalData();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
        Cargando matriz de estimación de Dominio Estudio...
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-red-600 font-bold">Propuesta no encontrada</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-slate-100 rounded-lg text-sm">
          Volver a Propuestas
        </button>
      </div>
    );
  }

  const totals = proposal.totales || {};
  const isHistoricalCase =
    proposal.nombre.includes('ICBF') ||
    proposal.nombre.includes('Green List') ||
    proposal.nombre.includes('WhatsApp') ||
    proposal.nombre.includes('Entidades Financieras') ||
    proposal.nombre.includes('Famisanar') ||
    proposal.nombre.includes('ISER');

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

      {/* Barra superior de navegación y exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#2b003e] hover:text-[#5dc628] bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs self-start transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al listado de propuestas</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenComparison(proposal.id)}
            className="flex items-center gap-2 px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-[#2b003e] border border-purple-200 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#5dc628]" />
            <span>Comparar con Histórico (RF-10)</span>
          </button>

          <a
            href={api.getExcelExportUrl(proposal.id)}
            download
            className="flex items-center gap-2 px-3.5 py-2 bg-[#2b003e] hover:bg-[#3d0059] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            title="Descargar matriz de estimación en Microsoft Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#5dc628]" />
            <span>Exportar Excel (RF-08)</span>
          </a>

          <a
            href={api.getCSVExportUrl(proposal.id)}
            download
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            title="Descargar datos en CSV delimitado por comas con BOM UTF-8"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </a>
        </div>
      </div>

      {/* Tarjeta de Metadatos de la Propuesta */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 border-l-4 border-l-[#2b003e]">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#2b003e] tracking-tight">{proposal.nombre}</h1>
              {isHistoricalCase && (
                <span className="text-xs bg-purple-100 text-[#2b003e] font-extrabold px-2.5 py-0.5 rounded-full border border-purple-200">
                  Estimación Histórica Real
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Cliente: <span className="font-bold text-slate-800">{proposal.referencia_cliente}</span> | Tecnologías: <span className="font-semibold text-slate-800">{proposal.tecnologias}</span>
            </p>
          </div>

          <button
            onClick={handleOpenAddCompModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#2b003e] hover:bg-[#3d0059] text-white rounded-xl text-xs font-bold shadow-xs self-start transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 text-[#5dc628]" />
            <span>+ Agregar Componente (RF-05)</span>
          </button>
        </div>

        {/* Cajas de métricas clave */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-100">
            <span className="text-[11px] font-bold text-slate-600 uppercase block">Horas Base PERT</span>
            <span className="text-xl font-extrabold text-[#2b003e]">{totals.base_total_horas || 0} hrs</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Suma H de componentes</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-600 uppercase block">Reserva Contingencia</span>
            <span className="text-xl font-extrabold text-slate-800">
              +{totals.horas_reserva || 0} hrs
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{totals.reserva_porcentaje}% configurable</span>
          </div>

          <div className="bg-[#2b003e] text-white p-3.5 rounded-xl shadow-md shadow-purple-900/20">
            <span className="text-[11px] font-bold text-[#5dc628] uppercase block">TOTAL ESTIMADO FINAL</span>
            <span className="text-xl font-black">{totals.total_con_reserva || 0} hrs</span>
            <span className="text-[10px] text-purple-200 block mt-0.5">Base + Reserva</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-600 uppercase block">Intervalo (±σ Total)</span>
            <span className="text-base font-extrabold text-slate-800">
              {totals.intervalo_total ? `${totals.intervalo_total[0]}h a ${totals.intervalo_total[1]}h` : 'N/A'}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Desv: ±{totals.desviacion_total || 0} hrs</span>
          </div>
        </div>
      </div>

      {/* Matriz de Estimación Detallada (Tabla) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#2b003e]" />
            <h2 className="text-sm font-bold text-slate-900">
              Desglose de Componentes, Tareas Técnicas y Factores de Complejidad (RF-06, RF-07, RF-09)
            </h2>
          </div>
          <div className="text-xs text-slate-500">
            Fórmula PERT: <span className="font-mono font-bold text-[#2b003e]">E = (O + 4M + P) / 6</span> | Ajuste: <span className="font-mono font-bold text-[#2b003e]">H = E × f</span>
          </div>
        </div>

        {totals.componentes?.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <p>La propuesta aún no tiene componentes seleccionados del catálogo.</p>
            <button
              onClick={handleOpenAddCompModal}
              className="px-4 py-2 bg-[#2b003e] text-white rounded-xl text-xs font-semibold"
            >
              Armar Solución con Componentes
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {totals.componentes.map((comp) => (
              <div key={comp.id} className="p-5 space-y-4">
                {/* Cabecera del Componente en la Matriz */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-purple-50/30 p-4 rounded-xl border border-purple-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-[#2b003e]">{comp.nombre}</h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white border border-purple-200 text-[#2b003e]">
                        {comp.categoria}
                      </span>
                    </div>
                    {comp.descripcion && (
                      <p className="text-xs text-slate-500 mt-0.5">{comp.descripcion}</p>
                    )}
                  </div>

                  {/* Selector de Complejidad (RF-06) y Subtotales */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
                      <span className="font-bold text-slate-600 uppercase text-[10px]">Complejidad:</span>
                      <select
                        value={comp.complejidad}
                        onChange={(e) => handleComplexityChange(comp.id, e.target.value)}
                        className={`font-bold rounded px-2 py-0.5 text-xs border focus:outline-none ${
                          comp.complejidad === 'baja'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : comp.complejidad === 'alta'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-purple-50 text-[#2b003e] border-purple-300'
                        }`}
                      >
                        <option value="baja">Baja (f = {proposal.factor_baja})</option>
                        <option value="media">Media (f = {proposal.factor_media})</option>
                        <option value="alta">Alta (f = {proposal.factor_alta})</option>
                      </select>
                    </div>

                    <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
                      <span className="text-slate-400 text-[10px] block font-bold uppercase">Subtotal</span>
                      <span className="font-black text-[#2b003e] text-sm">{comp.subtotal_horas} hrs</span>
                    </div>

                    <button
                      onClick={() => handleRemoveComponent(comp.id)}
                      title="Quitar componente de la propuesta"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tabla de tareas técnicas del componente */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                        <th className="py-2.5 px-3">Tarea Técnica</th>
                        <th className="py-2.5 px-2">Perfil</th>
                        <th className="py-2.5 px-2 text-right">O</th>
                        <th className="py-2.5 px-2 text-right">M</th>
                        <th className="py-2.5 px-2 text-right">P</th>
                        <th className="py-2.5 px-2 text-right text-[#2b003e] font-bold">PERT (E)</th>
                        <th className="py-2.5 px-2 text-right font-black text-slate-900">Ajustadas (H)</th>
                        <th className="py-2.5 px-2 text-right">±σ</th>
                        <th className="py-2.5 px-3 text-center">Trazabilidad / Edición</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {comp.tareas?.map((tarea) => {
                        const isEdited = Boolean(tarea.editado_manualmente);
                        return (
                          <tr
                            key={tarea.id}
                            className={`hover:bg-slate-50/80 transition-colors ${
                              isEdited ? 'bg-amber-50/40' : ''
                            }`}
                          >
                            <td className="py-3 px-3">
                              <div className="font-semibold text-slate-900">{tarea.nombre}</div>
                              {isEdited && (
                                <div className="text-[10px] text-amber-800 font-medium mt-0.5 flex items-center gap-1">
                                  <ShieldAlert className="w-3 h-3 text-amber-600" />
                                  <span>Editada manualmente: {tarea.justificacion}</span>
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-2">
                              <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                {tarea.perfil}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-right font-mono text-slate-600">{tarea.O}</td>
                            <td className="py-3 px-2 text-right font-mono text-slate-600">{tarea.M}</td>
                            <td className="py-3 px-2 text-right font-mono text-slate-600">{tarea.P}</td>
                            <td className="py-3 px-2 text-right font-mono font-bold text-[#2b003e]">
                              {tarea.horas_esperadas}
                            </td>
                            <td className="py-3 px-2 text-right font-mono font-black text-slate-900 text-sm">
                              {tarea.horas_ajustadas}
                            </td>
                            <td className="py-3 px-2 text-right font-mono text-slate-400">
                              ±{tarea.desviacion}
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => setTraceabilityTask(tarea)}
                                  title="Ver origen y referencias históricas (RNF Trazabilidad)"
                                  className="p-1 text-slate-500 hover:text-[#2b003e] hover:bg-purple-50 rounded-md"
                                >
                                  <Info className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => handleOpenManualEdit(tarea, comp)}
                                  title="Editar manualmente con justificación (RF-09)"
                                  className={`p-1 rounded-md transition-colors ${
                                    isEdited
                                      ? 'text-amber-700 hover:bg-amber-100'
                                      : 'text-slate-400 hover:text-[#2b003e] hover:bg-slate-100'
                                  }`}
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                {isEdited && (
                                  <button
                                    onClick={() => handleResetManualEdit(tarea.id)}
                                    title="Restablecer a fórmula PERT original"
                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Añadir Componente (RF-05) */}
      {showAddCompModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#2b003e] mb-1">Incorporar Componente a la Solución</h3>
            <p className="text-xs text-slate-500 mb-4">
              Seleccione un componente del catálogo de Dominio Estudio para sumar sus tareas técnicas a la matriz.
            </p>

            {catalogComponents.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-600 text-center">
                Todos los componentes disponibles ya forman parte de esta propuesta.
              </div>
            ) : (
              <form onSubmit={handleAddComponent} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Componente *</label>
                  <select
                    value={selectedCompToAdd}
                    onChange={(e) => setSelectedCompToAdd(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#2b003e] focus:outline-none font-semibold text-slate-800"
                  >
                    {catalogComponents.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} ({c.categoria})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Complejidad Inicial (RF-06)
                  </label>
                  <select
                    value={newCompComplexity}
                    onChange={(e) => setNewCompComplexity(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#2b003e] focus:outline-none"
                  >
                    <option value="baja">Baja (Factor {proposal.factor_baja})</option>
                    <option value="media">Media (Factor {proposal.factor_media})</option>
                    <option value="alta">Alta (Factor {proposal.factor_alta})</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCompModal(false)}
                    className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm bg-[#2b003e] hover:bg-[#3d0059] text-white rounded-xl font-bold shadow-xs"
                  >
                    Incorporar a la Solución
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal Edición Manual con Justificación (RF-09) */}
      {showEditModal && editingTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#2b003e] mb-1">Edición Manual de Horas (RF-09)</h3>
            <p className="text-xs text-slate-500 mb-4">
              El prototipo es un apoyo a la decisión. Toda cifra modificada requiere justificación explícita para trazabilidad técnica.
            </p>

            <form onSubmit={handleSaveManualEdit} className="space-y-4">
              <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-100 text-xs space-y-1">
                <div>
                  <span className="text-slate-500">Tarea: </span>
                  <span className="font-bold text-slate-900">{editingTask.nombre}</span>
                </div>
                <div>
                  <span className="text-slate-500">Componente: </span>
                  <span className="font-semibold text-slate-800">{editingTask.compNombre}</span>
                </div>
                <div>
                  <span className="text-slate-500">Horas PERT Calculadas: </span>
                  <span className="font-mono font-bold text-[#2b003e]">{editingTask.horas_esperadas} hrs</span> (con factor f={editingTask.factor_f})
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Horas Asignadas Manualmente *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  required
                  value={manualHours}
                  onChange={(e) => setManualHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2b003e] focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Justificación Técnica (Obligatoria según RF-09) *
                </label>
                <textarea
                  rows={3}
                  required
                  minLength={5}
                  value={manualJustification}
                  onChange={(e) => setManualJustification(e.target.value)}
                  placeholder="Explique el motivo del ajuste (ej: requerimiento estricto del cliente, complejidad de integración)..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2b003e] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm bg-[#2b003e] hover:bg-[#3d0059] text-white rounded-xl font-bold shadow-xs"
                >
                  Guardar Ajuste Manual
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Trazabilidad Histórica (RNF) */}
      {traceabilityTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-[#5dc628]" />
                <h3 className="font-extrabold text-base text-[#2b003e]">Trazabilidad Técnica de la Cifra</h3>
              </div>
              <button
                onClick={() => setTraceabilityTask(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Tarea Técnica</span>
                <span className="font-bold text-slate-900 text-sm">{traceabilityTask.nombre}</span>
              </div>

              <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-100 space-y-1">
                <div className="font-bold text-[#2b003e]">Fórmula y Valores Base:</div>
                <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
                  <div>O (Optimista): <span className="font-bold">{traceabilityTask.O}h</span></div>
                  <div>M (Probable): <span className="font-bold">{traceabilityTask.M}h</span></div>
                  <div>P (Pesimista): <span className="font-bold">{traceabilityTask.P}h</span></div>
                </div>
                <div className="pt-2 text-[#2b003e] font-semibold">
                  Horas PERT: <span className="font-bold font-mono">({traceabilityTask.O} + 4×{traceabilityTask.M} + {traceabilityTask.P}) / 6 = {traceabilityTask.horas_esperadas}h</span>
                </div>
              </div>

              <div>
                <span className="text-slate-700 font-bold block mb-1">
                  Proyectos históricos de Dominio Estudio que sustentan O, M y P:
                </span>
                {(!traceabilityTask.referencias_historicas || traceabilityTask.referencias_historicas.length === 0) ? (
                  <p className="text-slate-400 italic">Valores base iniciales del equipo técnico.</p>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {traceabilityTask.referencias_historicas.map((ref) => (
                      <div
                        key={ref.id}
                        className="p-2 bg-white rounded-lg border border-slate-200 flex justify-between items-center"
                      >
                        <span className="font-semibold text-slate-800">{ref.proyecto_origen}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#2b003e]">{ref.horas} hrs</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                              ref.tipo === 'real'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ref.tipo}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {traceabilityTask.editado_manualmente && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                  <span className="font-bold block uppercase text-[10px]">Ajuste Manual Aplicado:</span>
                  <p className="mt-0.5">{traceabilityTask.justificacion}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setTraceabilityTask(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
