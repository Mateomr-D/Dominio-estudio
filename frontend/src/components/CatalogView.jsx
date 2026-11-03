import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Power,
  ChevronDown,
  ChevronRight,
  Database,
  History,
  Info,
  CheckCircle2,
  AlertCircle,
  Tag,
  ShieldCheck
} from 'lucide-react';

export default function CatalogView() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedCompId, setExpandedCompId] = useState(null);
  const [componentDetail, setComponentDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Modals
  const [showCompModal, setShowCompModal] = useState(false);
  const [editingComp, setEditingComp] = useState(null);
  const [compForm, setCompForm] = useState({ nombre: '', descripcion: '', categoria: '', activo: 1 });

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [targetCompId, setTargetCompId] = useState(null);
  const [taskForm, setTaskForm] = useState({ nombre: '', descripcion: '', perfil: 'Backend' });

  const [showRefModal, setShowRefModal] = useState(false);
  const [targetTaskId, setTargetTaskId] = useState(null);
  const [refForm, setRefForm] = useState({ proyecto_origen: '', horas: '', tipo: 'real', notas: '' });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadComponents();
  }, [includeInactive]);

  async function loadComponents() {
    setLoading(true);
    try {
      const res = await api.getComponents(includeInactive);
      setComponents(res.data);
      if (expandedCompId) {
        await loadComponentDetail(expandedCompId);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadComponentDetail(id) {
    setDetailLoading(true);
    try {
      const res = await api.getComponentById(id);
      setComponentDetail(res.data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setDetailLoading(false);
    }
  }

  function handleToggleExpand(id) {
    if (expandedCompId === id) {
      setExpandedCompId(null);
      setComponentDetail(null);
    } else {
      setExpandedCompId(id);
      loadComponentDetail(id);
    }
  }

  async function handleToggleActive(id, e) {
    e.stopPropagation();
    try {
      await api.toggleComponentActive(id);
      setSuccessMsg('Estado del componente actualizado');
      loadComponents();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  // Guardar o editar componente (RF-01)
  async function handleSaveComponent(e) {
    e.preventDefault();
    try {
      if (editingComp) {
        await api.updateComponent(editingComp.id, compForm);
        setSuccessMsg('Componente actualizado con éxito');
      } else {
        await api.createComponent(compForm);
        setSuccessMsg('Componente creado en el catálogo con éxito');
      }
      setShowCompModal(false);
      setEditingComp(null);
      loadComponents();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  // Guardar nueva tarea técnica (RF-02)
  async function handleSaveTask(e) {
    e.preventDefault();
    try {
      await api.createTask(targetCompId, taskForm);
      setSuccessMsg('Tarea técnica agregada exitosamente al componente');
      setShowTaskModal(false);
      setTaskForm({ nombre: '', descripcion: '', perfil: 'Backend' });
      loadComponentDetail(targetCompId);
      loadComponents();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  // Eliminar tarea
  async function handleDeleteTask(taskId) {
    if (!confirm('¿Confirma eliminar esta tarea técnica del catálogo?')) return;
    try {
      await api.deleteTask(taskId);
      setSuccessMsg('Tarea eliminada');
      if (expandedCompId) loadComponentDetail(expandedCompId);
      loadComponents();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  // Registrar referencia histórica de horas (RF-03)
  async function handleSaveReference(e) {
    e.preventDefault();
    try {
      await api.addHourReference(targetTaskId, {
        proyecto_origen: refForm.proyecto_origen,
        horas: Number(refForm.horas),
        tipo: refForm.tipo,
        notas: refForm.notas
      });
      setSuccessMsg('Referencia histórica de horas registrada correctamente');
      setShowRefModal(false);
      setRefForm({ proyecto_origen: '', horas: '', tipo: 'real', notas: '' });
      if (expandedCompId) loadComponentDetail(expandedCompId);
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  // Eliminar referencia de horas
  async function handleDeleteReference(refId) {
    if (!confirm('¿Desea eliminar esta referencia histórica?')) return;
    try {
      await api.deleteHourReference(refId);
      setSuccessMsg('Referencia eliminada');
      if (expandedCompId) loadComponentDetail(expandedCompId);
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  const categories = ['ALL', ...new Set(components.map((c) => c.categoria))];

  const filteredComponents = components.filter((c) => {
    const matchesSearch =
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || c.categoria === selectedCategory;
    return matchesSearch && matchesCat;
  });

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

      {/* Encabezado del catálogo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Catálogo de Componentes</h1>
            <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-full">
              RF-01 a RF-03
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Componentes estandarizados y tareas técnicas con horas de referencia O, M y P tomadas de proyectos anteriores de Dominio Estudio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingComp(null);
              setCompForm({ nombre: '', descripcion: '', categoria: 'General', activo: 1 });
              setShowCompModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Componente</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3.5 py-2 text-sm border border-slate-300 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? 'Todas las Categorías' : cat}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer self-start sm:self-auto">
          <input
            type="checkbox"
            checked={includeInactive}
            onChange={(e) => setIncludeInactive(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          Mostrar componentes inactivos
        </label>
      </div>

      {/* Lista de Componentes */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          Cargando catálogo de componentes...
        </div>
      ) : filteredComponents.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          No se encontraron componentes con los filtros seleccionados.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComponents.map((comp) => {
            const isExpanded = expandedCompId === comp.id;
            return (
              <div
                key={comp.id}
                className={`bg-white rounded-2xl border transition-all ${
                  isExpanded ? 'border-blue-400 shadow-md ring-1 ring-blue-100' : 'border-slate-200 hover:border-slate-300 shadow-xs'
                } ${!comp.activo ? 'opacity-60 bg-slate-50' : ''}`}
              >
                {/* Cabecera del Componente */}
                <div
                  onClick={() => handleToggleExpand(comp.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-slate-400">
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-blue-600" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-base text-slate-900">{comp.nombre}</span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {comp.categoria}
                        </span>
                        {!comp.activo && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            Inactivo
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 max-w-2xl">{comp.descripcion}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {comp.total_tareas} {comp.total_tareas === 1 ? 'tarea técnica' : 'tareas técnicas'}
                    </span>

                    <button
                      onClick={() => {
                        setEditingComp(comp);
                        setCompForm({
                          nombre: comp.nombre,
                          descripcion: comp.descripcion || '',
                          categoria: comp.categoria,
                          activo: comp.activo ? 1 : 0
                        });
                        setShowCompModal(true);
                      }}
                      title="Editar componente"
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => handleToggleActive(comp.id, e)}
                      title={comp.activo ? 'Desactivar componente (RF-01)' : 'Activar componente (RF-01)'}
                      className={`p-2 rounded-lg transition-colors ${
                        comp.activo
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Detalle Desplegable con Tareas y Referencias Históricas (RF-02 y RF-03) */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/60 p-5 rounded-b-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-blue-600" />
                        <h3 className="text-sm font-bold text-slate-800">
                          Tareas Técnicas y Horas de Referencia (PERT Cohn 2005)
                        </h3>
                      </div>
                      <button
                        onClick={() => {
                          setTargetCompId(comp.id);
                          setShowTaskModal(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agregar Tarea Técnica</span>
                      </button>
                    </div>

                    {detailLoading ? (
                      <p className="text-xs text-slate-500 italic p-4 text-center">Cargando detalles de tareas...</p>
                    ) : componentDetail?.tareas?.length === 0 ? (
                      <p className="text-xs text-slate-500 italic p-4 text-center bg-white rounded-xl border border-slate-200">
                        No hay tareas registradas para este componente. Agregue una para comenzar a estimar.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {componentDetail?.tareas?.map((tarea) => {
                          const base = tarea.calculo_base || {};
                          return (
                            <div
                              key={tarea.id}
                              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm text-slate-900">{tarea.nombre}</span>
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                      {tarea.perfil}
                                    </span>
                                  </div>
                                  {tarea.descripcion && (
                                    <p className="text-xs text-slate-500 mt-0.5">{tarea.descripcion}</p>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      setTargetTaskId(tarea.id);
                                      setShowRefModal(true);
                                    }}
                                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200"
                                    title="Añadir horas de referencia de un proyecto anterior (RF-03)"
                                  >
                                    <History className="w-3.5 h-3.5 text-blue-600" />
                                    <span>+ Referencia Histórica</span>
                                  </button>

                                  <button
                                    onClick={() => handleDeleteTask(tarea.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                    title="Eliminar tarea"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Métricas PERT de la tarea */}
                              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                                <div>
                                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Optimista (O)</span>
                                  <span className="font-semibold text-slate-800">{base.O} hrs</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Probable (M)</span>
                                  <span className="font-semibold text-slate-800">{base.M} hrs</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Pesimista (P)</span>
                                  <span className="font-semibold text-slate-800">{base.P} hrs</span>
                                </div>
                                <div>
                                  <span className="text-blue-600 block text-[10px] uppercase font-bold">Esperada (E)</span>
                                  <span className="font-bold text-blue-700 text-sm">{base.horasEsperadas} hrs</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Desviación (σ)</span>
                                  <span className="font-medium text-slate-700">± {base.desviacion} hrs</span>
                                </div>
                              </div>

                              {/* Trazabilidad: Proyectos históricos de origen (RF-03) */}
                              <div className="text-xs pt-1">
                                <span className="font-semibold text-slate-600 flex items-center gap-1 mb-1.5">
                                  <Info className="w-3.5 h-3.5 text-slate-400" />
                                  Trazabilidad de datos históricos ({tarea.referencias.length} registros):
                                </span>

                                {tarea.referencias.length === 0 ? (
                                  <span className="text-slate-400 italic">
                                    Sin proyectos previos registrados. Se usan valores base de calibración.
                                  </span>
                                ) : (
                                  <div className="flex flex-wrap gap-2">
                                    {tarea.referencias.map((ref) => (
                                      <div
                                        key={ref.id}
                                        className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-md text-[11px]"
                                      >
                                        <span className="font-medium text-slate-800">{ref.proyecto_origen}:</span>
                                        <span className="font-bold text-blue-600">{ref.horas}h</span>
                                        <span
                                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                                            ref.tipo === 'real'
                                              ? 'bg-emerald-100 text-emerald-800'
                                              : 'bg-amber-100 text-amber-800'
                                          }`}
                                        >
                                          {ref.tipo}
                                        </span>
                                        <button
                                          onClick={() => handleDeleteReference(ref.id)}
                                          className="text-slate-400 hover:text-red-500 ml-1 font-bold"
                                          title="Eliminar referencia"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Crear/Editar Componente (RF-01) */}
      {showCompModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {editingComp ? 'Editar Componente del Catálogo' : 'Nuevo Componente para el Catálogo'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Defina el módulo reutilizable que integrará las soluciones a la medida.
            </p>

            <form onSubmit={handleSaveComponent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre *</label>
                <input
                  type="text"
                  required
                  value={compForm.nombre}
                  onChange={(e) => setCompForm({ ...compForm, nombre: e.target.value })}
                  placeholder="Ej: Integración Pasarela de Pagos"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Categoría *</label>
                <input
                  type="text"
                  required
                  value={compForm.categoria}
                  onChange={(e) => setCompForm({ ...compForm, categoria: e.target.value })}
                  placeholder="Ej: Finanzas, Seguridad, Contenido..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={compForm.descripcion}
                  onChange={(e) => setCompForm({ ...compForm, descripcion: e.target.value })}
                  placeholder="Alcance técnico del componente..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCompModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Guardar Componente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Crear Tarea Técnica (RF-02) */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Registrar Tarea Técnica</h3>
            <p className="text-xs text-slate-500 mb-4">
              Descompone el componente en una actividad técnica atómica con perfil asignado.
            </p>

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre de la Tarea *</label>
                <input
                  type="text"
                  required
                  value={taskForm.nombre}
                  onChange={(e) => setTaskForm({ ...taskForm, nombre: e.target.value })}
                  placeholder="Ej: Implementación de Webhook de confirmación"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Perfil Técnico *</label>
                <select
                  value={taskForm.perfil}
                  onChange={(e) => setTaskForm({ ...taskForm, perfil: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Backend">Backend</option>
                  <option value="Frontend">Frontend</option>
                  <option value="QA">QA (Aseguramiento de Calidad)</option>
                  <option value="DevOps">DevOps / Infraestructura</option>
                  <option value="Diseño UI/UX">Diseño UI/UX</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={taskForm.descripcion}
                  onChange={(e) => setTaskForm({ ...taskForm, descripcion: e.target.value })}
                  placeholder="Criterios técnicos de aceptación de la tarea..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Registrar Referencia Histórica de Horas (RF-03) */}
      {showRefModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Añadir Referencia Histórica (RF-03)</h3>
            <p className="text-xs text-slate-500 mb-4">
              Alimenta los valores paramétricos (O, M, P) con horas de proyectos anteriores de Dominio Estudio.
            </p>

            <form onSubmit={handleSaveReference} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Proyecto de Origen *
                </label>
                <input
                  type="text"
                  required
                  value={refForm.proyecto_origen}
                  onChange={(e) => setRefForm({ ...refForm, proyecto_origen: e.target.value })}
                  placeholder="Ej: Portal Institucional ISER 2025"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Horas *</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    required
                    value={refForm.horas}
                    onChange={(e) => setRefForm({ ...refForm, horas: e.target.value })}
                    placeholder="Ej: 14"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tipo de Dato *</label>
                  <select
                    value={refForm.tipo}
                    onChange={(e) => setRefForm({ ...refForm, tipo: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="real">Horas Reales (Ejecutadas)</option>
                    <option value="estimada">Horas Estimadas (Propuesta previa)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Notas / Observaciones</label>
                <input
                  type="text"
                  value={refForm.notas}
                  onChange={(e) => setRefForm({ ...refForm, notas: e.target.value })}
                  placeholder="Condiciones específicas o contexto del proyecto..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRefModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Guardar Referencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
