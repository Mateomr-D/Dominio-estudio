import React from 'react';
import { BookOpen, Check, Layers, Sliders, FileSpreadsheet, ShieldAlert, BarChart3, HelpCircle } from 'lucide-react';

export default function UserGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Guía Básica de Uso | Prototipo de Estimación de Tareas Técnicas
              </h2>
              <p className="text-xs text-slate-500">
                Dominio Estudio – Trabajo de Grado ISER 2026 (Holnaver Dagua Cunda / Elkin Rojas)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-2xl font-bold p-1 leading-none"
          >
            ×
          </button>
        </div>

        {/* Sección 1: Introducción */}
        <div className="space-y-2 text-sm text-slate-600">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">1</span>
            Propósito del Prototipo
          </h3>
          <p>
            El prototipo tiene como objetivo generar una <strong>matriz de horas técnica y reproducible</strong> para propuestas de desarrollo de software a la medida, mitigando la dependencia exclusiva del juicio manual de expertos senior, reduciendo tiempos de respuesta y disminuyendo la variabilidad entre estimaciones.
          </p>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Principio de Apoyo a la Decisión:</strong> El prototipo asiste al equipo técnico pero no reemplaza su criterio. Cualquier cifra puede editarse manualmente en la matriz siempre que se documente la respectiva justificación técnica (RF-09).
            </span>
          </div>
        </div>

        {/* Sección 2: Flujo de Uso Paso a Paso */}
        <div className="space-y-3 text-sm text-slate-600">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">2</span>
            Flujo de Trabajo Paso a Paso
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-blue-700 block">Paso 1: Mantenimiento del Catálogo (RF-01 a RF-03)</span>
              <p className="text-slate-600">
                Consulte y mantenga los componentes y tareas técnicas. Añada referencias históricas de proyectos anteriores con horas reales o estimadas. El sistema recalcula automáticamente O, M y P.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-blue-700 block">Paso 2: Registro de Nueva Propuesta (RF-04)</span>
              <p className="text-slate-600">
                Haga clic en <strong>"Nueva Propuesta"</strong>. Ingrese el nombre del proyecto, referencia del cliente, tecnologías previstas, fecha y porcentaje de reserva de contingencia (10% por defecto).
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-blue-700 block">Paso 3: Armado de la Solución (RF-05)</span>
              <p className="text-slate-600">
                Seleccione los componentes del catálogo que formarán parte de la propuesta. Cada componente incorpora automáticamente sus tareas técnicas parametrizadas.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-blue-700 block">Paso 4: Ajuste por Complejidad (RF-06)</span>
              <p className="text-slate-600">
                Asigne a cada componente su nivel de complejidad: <strong>Baja (f=0.8)</strong>, <strong>Media (f=1.0)</strong> o <strong>Alta (f=1.3)</strong>. Las horas ajustadas (H) se recalculan de inmediato.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-blue-700 block">Paso 5: Revisión de la Matriz y Edición (RF-07, RF-09)</span>
              <p className="text-slate-600">
                Revise las horas PERT, desviación estándar e intervalos. Si una tarea requiere una cifra personalizada, haga clic en el ícono de edición e ingrese la justificación obligatoria.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-blue-700 block">Paso 6: Exportación y Comparación (RF-08, RF-10)</span>
              <p className="text-slate-600">
                Descargue la matriz formal en <strong>Excel (.xlsx)</strong> o <strong>CSV</strong>. En la pestaña de Validación, contraste las cifras con la estimación manual senior y calcule el error relativo MRE.
              </p>
            </div>
          </div>
        </div>

        {/* Sección 3: Fórmulas Matemáticas Utilizadas */}
        <div className="space-y-3 text-sm text-slate-600">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">3</span>
            Modelo Matemático de Estimación (Sección 6 del Documento)
          </h3>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="font-bold text-slate-700 block">1. Horas Esperadas PERT (Cohn, 2005):</span>
                <code className="text-blue-700 bg-white px-2 py-1 rounded border border-slate-200 block mt-1 font-mono">
                  E = (O + 4M + P) / 6
                </code>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Donde O = Optimista, M = Más Probable, P = Pesimista.
                </span>
              </div>

              <div>
                <span className="font-bold text-slate-700 block">2. Horas Ajustadas por Complejidad:</span>
                <code className="text-blue-700 bg-white px-2 py-1 rounded border border-slate-200 block mt-1 font-mono">
                  H = E × f
                </code>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Factor f: Baja = 0.8 | Media = 1.0 | Alta = 1.3 (calibrable).
                </span>
              </div>

              <div>
                <span className="font-bold text-slate-700 block">3. Desviación Estándar e Intervalo:</span>
                <code className="text-blue-700 bg-white px-2 py-1 rounded border border-slate-200 block mt-1 font-mono">
                  σ = (P − O) / 6
                </code>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Permite mostrar el rango de incertidumbre [Total − σ, Total + σ].
                </span>
              </div>

              <div>
                <span className="font-bold text-slate-700 block">4. Error Relativo de Magnitud (MRE):</span>
                <code className="text-blue-700 bg-white px-2 py-1 rounded border border-slate-200 block mt-1 font-mono">
                  MRE = |real − estimado| / real
                </code>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Métrica estándar de la industria (Terlapu et al., 2024 / Jørgensen, 2007).
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección 4: Criterios de Aceptación y Trazabilidad */}
        <div className="space-y-2 text-xs text-slate-600 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
            <Check className="w-4 h-4 text-blue-600" />
            Criterios de Cumplimiento del Objetivo Específico 3
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li>El prototipo permite construir soluciones a partir de un catálogo con datos históricos.</li>
            <li>Genera la matriz de estimación de horas con exportación a Excel y CSV.</li>
            <li>Cada cifra es trazable hasta su proyecto de origen o justificación de edición manual.</li>
            <li>Cuenta con validación sobre la propuesta histórica "E-Commerce Artesanías y Reservas".</li>
          </ul>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            Entendido, volver a la aplicación
          </button>
        </div>
      </div>
    </div>
  );
}
