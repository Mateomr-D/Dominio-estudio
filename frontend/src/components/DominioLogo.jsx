import React from 'react';
import logoImg from '../assets/logo-dominio.png';

export default function DominioLogo({ variant = 'light', size = 'default', showSubtitle = false }) {
  const isLight = variant === 'light';

  const heights = {
    small: 'h-9',
    default: 'h-12',
    large: 'h-16'
  };

  const imgHeight = heights[size] || heights.default;

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Logo oficial enviado por Dominio Estudio (Cerebro verde + texto dominio) */}
      <div className={`flex items-center ${!isLight ? 'bg-[#2b003e] px-3 py-1.5 rounded-xl shadow-xs' : ''}`}>
        <img
          src={logoImg}
          alt="Dominio Estudio"
          className={`${imgHeight} w-auto object-contain transition-transform duration-300 hover:scale-105`}
        />
      </div>

      {showSubtitle && (
        <div className="hidden sm:flex flex-col leading-tight border-l border-purple-300/30 pl-2.5">
          <span className="text-[10px] tracking-widest uppercase font-bold text-[#5dc628]">
            Estudio de Diseño
          </span>
          <span className="text-[9px] text-slate-300 font-medium">
            eLearning & Desarrollo
          </span>
        </div>
      )}
    </div>
  );
}
