import React from 'react';
import DominioLogo from './DominioLogo';
import { Layers, FolderKanban, BarChart3, BookOpen, Search, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenGuide }) {
  const tabs = [
    { id: 'proposals', label: 'Propuestas de Desarrollo', icon: FolderKanban },
    { id: 'catalog', label: 'Catálogo de Componentes', icon: Layers },
    { id: 'comparison', label: 'Comparación & Validación', icon: BarChart3 }
  ];

  return (
    <header className="bg-[#2b003e] border-b border-[#3d0059] sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Oficial de Dominio Estudio */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('proposals')}
              className="text-left focus:outline-none"
            >
              <DominioLogo variant="light" size="default" showSubtitle={true} />
            </button>
            <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-purple-800/60 text-[11px] font-semibold text-slate-300">
              <span className="text-[#5dc628]">Elearning</span>
              <span className="text-purple-400">•</span>
              <span className="text-slate-300">Drupal</span>
              <span className="text-purple-400">•</span>
              <span className="text-slate-300">Apps</span>
              <span className="text-purple-400">•</span>
              <span className="text-slate-300">Campus</span>
            </div>
          </div>

          {/* Menú de Navegación del Prototipo */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#5dc628] text-[#161329] shadow-sm font-bold'
                      : 'text-white hover:text-[#5dc628] hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#161329]' : 'text-slate-300'}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Acciones del encabezado: Búsqueda, Banderas y Guía de Uso */}
          <div className="flex items-center gap-3">
            {/* Indicadores de Idioma / Banderas como en el encabezado oficial */}
            <div className="hidden md:flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-lg border border-purple-800/40 text-xs">
              <span title="Colombia (Español)" className="cursor-default select-none text-sm">🇨🇴</span>
              <span title="English" className="cursor-default select-none opacity-50 hover:opacity-100 text-sm">🇬🇧</span>
            </div>

            {/* Botón Guía Básica de Uso */}
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-purple-900/80 hover:bg-[#5dc628] hover:text-[#161329] border border-purple-700/60 transition-all shadow-xs"
              title="Abrir Guía Básica de Uso"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">Guía de Uso</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
