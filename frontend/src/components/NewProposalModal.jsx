import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Plus, Check, Layers, Sliders, AlertCircle } from 'lucide-react';

export default function NewProposalModal({ isOpen, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    nombre: '',
    referencia_cliente: '',
    tecnologias: '',
    fecha: new Date().toISOString().slice(0, 10),
    reserva_porcentaje: 10.0,
    factor_baja: 0.8,
    factor_media: 1.0,
    factor_alta: 1.3,
    estimacion_manual: '',
    horas_reales: '',
    notas: ''
  });

  const [availableComponents, setAvailableComponents] = useState([]);
  const [selectedComponentIds, setSelectedComponentIds] = useState([]);
  const [loadingComps, setLoadingComps] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadComponents();
    }
  }, [isOpen]);

  async function loadComponents() {
    setLoadingComps(true);
    try {
      const res = await api.getComponents(false);
      setAvailableComponents(res.data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoadingComps(false);
    }
  }

  function toggleComponentSelection(id) {
    if (selectedComponentIds.includes(id)) {
      setSelectedComponentIds(selectedComponentIds.filter((item) => item !== id));
    } else {
      setSelectedComponentIds([...selectedComponentIds, id]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        ...formData,
        reserva_porcentaje: Number(formData.reserva_porcentaje),
        factor_baja: Number(formData.factor_baja),
        factor_media: Number(formData.factor_media),
        factor_alta: Number(formData.factor_alta),
        estimacion_manual: formData.estimacion_manual ? Number(formData.estimacion_manual) : null,
        horas_reales: formData.horas_reales ? Number(formData.horas_reales) : null,
        componentes_ids: selectedComponentIds
      };

      const res = await api.createProposal(payload);
      onCreated(res.data.id);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Registrar Nueva Propuesta Técnica</h2>
            <p className="text-xs text-slate-500">
              Conforme a RF-04 y RF-05: Defina los datos de la propuesta y arme la solución inicial.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl font-bold">
            ×
          </button>
        </div>

        {errorMsg && (
          <div className="my-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nombre del Proyecto / Propuesta *
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Portal Transaccional de Pagos y Facturación"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Referencia del Cliente *
              </label>
              <input
                type="text"
                required
                value={formData.referencia_cliente}
                onChange={(e) => setFormData({ ...formData, referencia_cliente: e.target.value })}
                placeholder="Ej: Banco Cooperativo - Ref: PROP-2026-11"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Fecha de Emisión *
              </label>
              <input
                type="date"
                required
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tecnologías Previstas *
              </label>
              <input
                type="text"
                required
                value={formData.tecnologias}
                onChange={(e) => setFormData({ ...formData, tecnologias: e.target.value })}
                placeholder="Ej: React, Node.js, Express, MySQL, Docker, Tailwind"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Selección de Componentes del Catálogo (RF-05) */}
          <div className="border-t border-slate-100 pt-3">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                Armar Solución: Seleccionar Componentes del Catálogo (RF-05)
              </span>
              <span className="text-slate-400 font-normal lowercase">
                ({selectedComponentIds.length} seleccionados)
              </span>
            </label>

            {loadingComps ? (
              <p className="text-xs text-slate-500">Cargando componentes del catálogo...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50">
                {availableComponents.map((comp) => {
                  const isSelected = selectedComponentIds.includes(comp.id);
                  return (
                    <div
                      key={comp.id}
                      onClick={() => toggleComponentSelection(comp.id)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-blue-400 text-blue-900 font-medium'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{comp.nombre}</div>
                        <div className="text-[10px] text-slate-400">{comp.categoria}</div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Configuración de Factores y Calibración (Avanzado) */}
          <div className="border-t border-slate-100 pt-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'Ocultar Parámetros de Calibración' : 'Configurar Factores de Complejidad y Reserva'}</span>
            </button>

            {showAdvanced && (
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Factor Baja (f)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={formData.factor_baja}
                    onChange={(e) => setFormData({ ...formData, factor_baja: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Factor Media (f)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={formData.factor_media}
                    onChange={(e) => setFormData({ ...formData, factor_media: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Factor Alta (f)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={formData.factor_alta}
                    onChange={(e) => setFormData({ ...formData, factor_alta: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Reserva (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={formData.reserva_porcentaje}
                    onChange={(e) => setFormData({ ...formData, reserva_porcentaje: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs disabled:opacity-50"
            >
              {submitting ? 'Creando propuesta...' : 'Crear Propuesta y Generar Matriz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
