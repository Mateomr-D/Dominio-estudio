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
  ShieldCheck,
  Sparkles,
  Search,
  FolderOpen
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

  // Proyectos históricos para el selector (RF-03)
  const [historicalProjects, setHistoricalProjects] = useState([
    'App Educativa ICBF - OIM',
    'Plataforma Green List (IUCN - Drupal)',
    'Chatbot Educativo en WhatsApp (n8n + OpenAI)',
    'Tasking Propuesta Famisanar (Drupal)',
    'Plataforma Entidades Financieras',
    'Portal E-Commerce Artesanías 2024',
    'Portal Institucional ISER 2025',
    'App Web Reservas Coworking 2025'
  ]);

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
  const [customProjectInput, setCustomProjectInput] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadComponents();
    loadHistoricalProjects();
  }, [includeInactive]);

  async function loadHistoricalProjects() {
    try {
      const res = await api.getHistoricalProjects();
      if (res.data && res.data.length > 0) {
        setHistoricalProjects(res.data);
      }
    } catch (err) {
      console.warn('No se pudo cargar la lista remota de proyectos históricos, usando lista precargada', err);
    }
  }

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
      setCustomProjectInput(false);
      if (expandedCompId) loadComponentDetail(expandedCompId);
      loadHistoricalProjects();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

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

      {/* Encabezado del catálogo con estilo corporativo Dominio Estudio */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs border-l-4 border-l-[#2b003e]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#2b003e] tracking-tight">Catálogo de Componentes</h1>
            <span className="text-xs bg-purple-100 text-[#2b003e] font-bold px-2.5 py-1 rounded-full border border-purple-200">
              RF-01 a RF-03
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              Base Histórica Real
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Componentes estandarizados y tareas técnicas nutridas con las estimaciones y proyectos históricos de <strong>Dominio Estudio</strong> (ICBF, Green List, Chatbot WhatsApp, Famisanar, etc.).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingComp(null);
              setCompForm({ nombre: '', descripcion: '', categoria: 'E-Learning y Contenidos', activo: 1 });
              setShowCompModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2b003e] hover:bg-[#3d0059] text-white rounded-xl text-sm font-bold shadow-md shadow-purple-900/10 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 text-[#5dc628]" />
            <span>Nuevo Componente</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar componentes o tareas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3.5 py-2 text-sm border border-slate-300 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#2b003e]"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2b003e]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? 'Todas las Categorías' : cat}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer self-start sm:self-auto">
          <input
            type="checkbox"
            checked={includeInactive}
            onChange={(e) => setIncludeInactive(e.target.checked)}
            className="rounded text-[#2b003e] focus:ring-[#2b003e]"
          />
          Mostrar componentes inactivos
        </label>
      </div>

      {/* Lista de Componentes */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          Cargando catálogo de componentes de Dominio Estudio...
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
                  isExpanded
                    ? 'border-[#2b003e] shadow-md ring-1 ring-purple-100'
                    : 'border-slate-200 hover:border-purple-300 shadow-xs'
                } ${!comp.activo ? 'opacity-60 bg-slate-50' : ''}`}
              >
                {/* Cabecera del Componente */}
                <div
                  onClick={() => handleToggleExpand(comp.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-slate-400">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-[#2b003e]" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-base text-slate-900">{comp.nombre}</span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-[#2b003e] border border-purple-200">
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
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
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
                      className="p-2 text-slate-500 hover:text-[#2b003e] hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => handleToggleActive(comp.id, e)}
                      title={comp.activo ? 'Desactivar componente (RF-01)' : 'Activar componente (RF-01)'}
                      className={`p-2 rounded-lg transition-colors ${
                        comp.activo
                          ? 'text-[#5dc628] hover:bg-emerald-50'
                          : 'text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Detalle Desplegable con Tareas y Referencias Históricas (RF-02 y RF-03) */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/70 p-5 rounded-b-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-[#2b003e]" />
                        <h3 className="text-sm font-bold text-slate-900">
                          Tareas Técnicas y Horas de Referencia (PERT Cohn 2005)
                        </h3>
                      </div>
                      <button
                        onClick={() => {
                          setTargetCompId(comp.id);
                          setShowTaskModal(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2b003e] hover:bg-[#3d0059] text-white rounded-lg text-xs font-bold shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#5dc628]" />
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
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#2b003e] border border-purple-200">
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
                                      setRefForm({
                                        proyecto_origen: historicalProjects[0] || 'App Educativa ICBF - OIM',
                                        horas: '',
                                        tipo: 'real',
                                        notas: ''
                                      });
                                      setCustomProjectInput(false);
                                      setShowRefModal(true);
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#2b003e] hover:bg-purple-100/60 bg-purple-50 rounded-lg transition-colors border border-purple-200"
                                    title="Añadir horas de referencia de un proyecto anterior de Dominio Estudio (RF-03)"
                                  >
                                    <History className="w-3.5 h-3.5 text-[#5dc628]" />
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
                                  <span className="text-[#2b003e] block text-[10px] uppercase font-bold">Esperada (E)</span>
                                  <span className="font-black text-[#2b003e] text-sm">{base.horasEsperadas} hrs</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Desviación (σ)</span>
                                  <span className="font-medium text-slate-700">± {base.desviacion} hrs</span>
                                </div>
                              </div>

                              {/* Trazabilidad: Proyectos históricos de origen (RF-03) */}
                              <div className="text-xs pt-1">
                                <span className="font-bold text-slate-700 flex items-center gap-1 mb-1.5">
                                  <Info className="w-3.5 h-3.5 text-[#5dc628]" />
                                  Proyectos de referencia de Dominio Estudio ({tarea.referencias.length} registrados):
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
                                        className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-md text-[11px] shadow-2xs"
                                      >
                                        <span className="font-semibold text-slate-800">{ref.proyecto_origen}:</span>
                                        <span className="font-bold text-[#2b003e]">{ref.horas}h</span>
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#2b003e] mb-1">
              {editingComp ? 'Editar Componente del Catálogo' : 'Nuevo Componente para el Catálogo'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Defina el módulo reutilizable que integrará las soluciones a la medida de Dominio Estudio.
            </p>

            <form onSubmit={handleSaveComponent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre *</label>
                <input
                  type="text"
                  required
                  value={compForm.nombre}
                  onChange={(e) => setCompForm({ ...compForm, nombre: e.target.value })}
                  placeholder="Ej: Chatbot Educativo con IA"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2b003e] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Categoría *</label>
                <select
                  value={compForm.categoria}
                  onChange={(e) => setCompForm({ ...compForm, categoria: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-[#2b003e] focus:outline-none"
                >
                  <option value="E-Learning y Contenidos">E-Learning y Contenidos</option>
                  <option value="Gestión y Análisis">Gestión y Análisis</option>
                  <option value="Diseño y Experiencia">Diseño y Experiencia</option>
                  <option value="Arquitectura e Infraestructura">Arquitectura e Infraestructura</option>
                  <option value="Seguridad y Usuarios">Seguridad y Usuarios</option>
                  <option value="Plataformas Transaccionales">Plataformas Transaccionales</option>
                  <option value="Calidad y Seguridad">Calidad y Seguridad</option>
                  <option value="Despliegue y Capacitación">Despliegue y Capacitación</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={compForm.descripcion}
                  onChange={(e) => setCompForm({ ...compForm, descripcion: e.target.value })}
                  placeholder="Alcance técnico del componente..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2b003e] focus:outline-none"
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
                  className="px-4 py-2 text-sm bg-[#2b003e] hover:bg-[#3d0059] text-white rounded-lg font-bold shadow-xs"
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#2b003e] mb-1">Registrar Tarea Técnica</h3>
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
                  placeholder="Ej: Integración de WhatsApp Business API"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2b003e] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Perfil Técnico *</label>
                <select
                  value={taskForm.perfil}
                  onChange={(e) => setTaskForm({ ...taskForm, perfil: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-[#2b003e] focus:outline-none font-medium"
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
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2b003e] focus:outline-none"
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
                  className="px-4 py-2 text-sm bg-[#2b003e] hover:bg-[#3d0059] text-white rounded-lg font-bold shadow-xs"
                >
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Añadir Referencia Histórica (RF-03) con selector desplegable de PROYECTO DE ORIGEN (Imagen 4 / menu.png) */}
      {showRefModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2b003e] text-[#5dc628] flex items-center justify-center font-bold">
                  <History className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-extrabold text-[#2b003e]">Añadir Referencia Histórica (RF-03)</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Alimenta los valores paramétricos (O, M, P) con horas de proyectos anteriores de <strong>Dominio Estudio</strong>.
              </p>
            </div>

            <form onSubmit={handleSaveReference} className="space-y-4 pt-2">
              {/* CAMPO SOLICITADO: Desplegable de PROYECTO DE ORIGEN * con opciones de selección */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                    PROYECTO DE ORIGEN *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomProjectInput(!customProjectInput);
                      if (!customProjectInput) {
                        setRefForm({ ...refForm, proyecto_origen: '' });
                      } else {
                        setRefForm({ ...refForm, proyecto_origen: historicalProjects[0] || '' });
                      }
                    }}
                    className="text-[11px] font-bold text-[#2b003e] hover:text-[#5dc628] underline transition-colors"
                  >
                    {customProjectInput ? '← Seleccionar de la lista' : '+ Escribir otro proyecto'}
                  </button>
                </div>

                {!customProjectInput ? (
                  /* Selector desplegable de proyectos históricos reales de Dominio Estudio */
                  <div className="relative">
                    <select
                      required
                      value={refForm.proyecto_origen}
                      onChange={(e) => {
                        if (e.target.value === '__NEW__') {
                          setCustomProjectInput(true);
                          setRefForm({ ...refForm, proyecto_origen: '' });
                        } else {
                          setRefForm({ ...refForm, proyecto_origen: e.target.value });
                        }
                      }}
                      className="w-full px-3.5 py-2.5 text-sm font-semibold border-2 border-purple-200 rounded-xl bg-purple-50/50 text-[#2b003e] focus:bg-white focus:border-[#2b003e] focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="" disabled>-- Seleccione un proyecto histórico de Dominio Estudio --</option>
                      {historicalProjects.map((proj) => (
                        <option key={proj} value={proj}>
                          {proj}
                        </option>
                      ))}
                      <option value="__NEW__" className="font-bold text-[#5dc628] bg-slate-900">
                        + Escribir otro proyecto personalizado...
                      </option>
                    </select>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Opciones tomadas de las estimaciones y propuestas históricas de la empresa.
                    </span>
                  </div>
                ) : (
                  /* Campo de texto libre con sugerencias automáticas (datalist) */
                  <div>
                    <input
                      type="text"
                      required
                      autoFocus
                      list="historical-projects-datalist"
                      value={refForm.proyecto_origen}
                      onChange={(e) => setRefForm({ ...refForm, proyecto_origen: e.target.value })}
                      placeholder="Ej: Portal Institucional ISER 2025"
                      className="w-full px-3.5 py-2.5 text-sm border-2 border-[#2b003e] rounded-xl focus:ring-2 focus:ring-[#5dc628] focus:outline-none"
                    />
                    <datalist id="historical-projects-datalist">
                      {historicalProjects.map((p) => (
                        <option key={p} value={p} />
                      ))}
                    </datalist>
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Escriba el nombre exacto del proyecto anterior.
                    </span>
                  </div>
                )}
              </div>

              {/* Horas y Tipo de Dato */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wide mb-1">
                    HORAS *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    required
                    value={refForm.horas}
                    onChange={(e) => setRefForm({ ...refForm, horas: e.target.value })}
                    placeholder="Ej: 14"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2b003e] focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wide mb-1">
                    TIPO DE DATO *
                  </label>
                  <select
                    value={refForm.tipo}
                    onChange={(e) => setRefForm({ ...refForm, tipo: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#2b003e] focus:outline-none font-semibold text-slate-800"
                  >
                    <option value="real">Horas Reales (Ejecutadas)</option>
                    <option value="estimada">Horas Estimadas (Propuesta)</option>
                  </select>
                </div>
              </div>

              {/* Notas u Observaciones */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wide mb-1">
                  NOTAS / OBSERVACIONES
                </label>
                <input
                  type="text"
                  value={refForm.notas}
                  onChange={(e) => setRefForm({ ...refForm, notas: e.target.value })}
                  placeholder="Condiciones específicas o contexto del proyecto..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2b003e] focus:outline-none"
                />
              </div>

              <div className="flex justify-end items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowRefModal(false);
                    setCustomProjectInput(false);
                  }}
                  className="px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm bg-[#2b003e] hover:bg-[#3d0059] text-white rounded-xl font-bold shadow-md shadow-purple-900/20 transition-all hover:scale-[1.02]"
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
