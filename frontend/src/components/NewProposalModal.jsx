import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Plus, Check, Layers, Sliders, AlertCircle } from 'lucide-react';

export default function NewProposalModal({ isOpen, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    nombre: '',
    referencia_cliente: '',
    tecnologias: '',
    fecha: new Date().toISOString().slice(0, 10),
    reserva_porcentaje: 8.0,
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
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-extrabold text-[#2b003e]">Registrar Nueva Propuesta Técnica</h2>
            <p className="text-xs text-slate-500">
              Conforme a RF-04 y RF-05: Defina los datos de la propuesta y arme la solución con componentes de Dominio Estudio.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-2xl font-bold">
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
              <label className="block text-xs font-extrabold text-slate-800 uppercase mb-1">
                Nombre del Proyecto / Propuesta *
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Campus Virtual E-Learning y Chatbot IA"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2b003e] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase mb-1">
                Referencia del Cliente *
              </label>
              <input
                type="text"
                required
                value={formData.referencia_cliente}
                onChange={(e) => setFormData({ ...formData, referencia_cliente: e.target.value })}
                placeholder="Ej: Universidad Nacional - Ref: PROP-2026-05"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2b003e] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase mb-1">
                Fecha de Emisión *
              </label>
              <input
                type="date"
                required
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2b003e] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-extrabold text-slate-800 uppercase mb-1">
                Tecnologías Previstas *
              </label>
              <input
                type="text"
                required
                value={formData.tecnologias}
                onChange={(e) => setFormData({ ...formData, tecnologias: e.target.value })}
                placeholder="Ej: Drupal 10, Moodle, PHP, React, WhatsApp Business API, n8n, OpenAI"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2b003e] focus:outline-none"
              />
            </div>
          </div>

          {/* Selección de Componentes del Catálogo (RF-05) */}
          <div className="border-t border-slate-100 pt-3">
            <label className="block text-xs font-extrabold text-slate-800 uppercase mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#2b003e]">
                <Layers className="w-4 h-4 text-[#5dc628]" />
                Armar Solución: Seleccionar Componentes del Catálogo (RF-05)
              </span>
              <span className="text-slate-500 font-semibold lowercase">
                ({selectedComponentIds.length} seleccionados)
              </span>
            </label>

            {loadingComps ? (
              <p className="text-xs text-slate-500">Cargando componentes de Dominio Estudio...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto p-1 border border-slate-200 rounded-2xl bg-slate-50">
                {availableComponents.map((comp) => {
                  const isSelected = selectedComponentIds.includes(comp.id);
                  return (
                    <div
                      key={comp.id}
                      onClick={() => toggleComponentSelection(comp.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-purple-50 border-[#2b003e] text-[#2b003e] font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-purple-200'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{comp.nombre}</div>
                        <div className="text-[10px] text-slate-400">{comp.categoria}</div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isSelected ? 'bg-[#5dc628] border-[#5dc628] text-slate-900' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
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
              className="text-xs font-bold text-[#2b003e] hover:text-[#5dc628] flex items-center gap-1"
            >
              <Sliders className="w-3.5 h-3.5 text-[#5dc628]" />
              <span>{showAdvanced ? 'Ocultar Parámetros de Calibración' : 'Configurar Factores de Complejidad y Reserva'}</span>
            </button>

            {showAdvanced && (
              <div className="mt-3 p-3 bg-purple-50/50 rounded-xl border border-purple-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Factor Baja (f)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={formData.factor_baja}
                    onChange={(e) => setFormData({ ...formData, factor_baja: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Factor Media (f)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={formData.factor_media}
                    onChange={(e) => setFormData({ ...formData, factor_media: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Factor Alta (f)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={formData.factor_alta}
                    onChange={(e) => setFormData({ ...formData, factor_alta: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Reserva (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={formData.reserva_porcentaje}
                    onChange={(e) => setFormData({ ...formData, reserva_porcentaje: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white font-semibold"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-sm bg-[#2b003e] hover:bg-[#3d0059] text-white rounded-xl font-bold shadow-md shadow-purple-900/20 disabled:opacity-50"
            >
              {submitting ? 'Creando propuesta...' : 'Crear Propuesta y Generar Matriz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
