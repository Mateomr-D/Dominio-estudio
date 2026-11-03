import React from 'react';
import { Layers, FolderKanban, BarChart3, BookOpen, Sparkles, Building2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenGuide }) {
  const tabs = [
    { id: 'proposals', label: 'Propuestas de Desarrollo', icon: FolderKanban },
    { id: 'catalog', label: 'Catálogo de Componentes', icon: Layers },
    { id: 'comparison', label: 'Comparación & Validación', icon: BarChart3 }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Marca Dominio Estudio */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">Dominio Estudio</span>
                <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                  Prototipo OE3
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Estimación de Tareas Técnicas con PERT</p>
            </div>
          </div>

          {/* Menú de Navegación */}
          <nav className="flex space-x-1 sm:space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Botón de Guía Básica de Uso */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors shadow-xs"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span className="hidden md:inline">Guía de Uso</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
