import React from 'react';

export default function DominioLogo({ variant = 'light', size = 'default', showSubtitle = true }) {
  const isLight = variant === 'light';
  const textColor = isLight ? '#ffffff' : '#2b003e';
  const subtitleColor = isLight ? '#a7f3d0' : '#5dc628';

  const iconSizes = {
    small: 'w-7 h-7',
    default: 'w-9 h-9',
    large: 'w-12 h-12'
  };

  const textSizes = {
    small: 'text-lg',
    default: 'text-2xl',
    large: 'text-3xl'
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Isotipo: Cerebro tecnológico en verde brillante oficial Dominio Estudio */}
      <svg
        className={`${iconSizes[size] || iconSizes.default} flex-shrink-0 transition-transform duration-300 hover:scale-105`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Silueta del cerebro */}
        <path
          d="M32 20C22 20 14 28 14 38C14 43 16 47 20 50C16 54 14 59 14 65C14 76 23 84 34 84C38 84 42 83 45 80C48 83 52 84 56 84C67 84 76 76 76 65C76 61 74 57 71 54C77 50 81 44 81 37C81 26 71 18 60 18C56 18 52 19 49 22C44 20 38 20 32 20Z"
          fill="#5dc628"
        />
        {/* Circuitos neuronales y conexiones tecnológicas */}
        <circle cx="36" cy="38" r="4.5" fill="#2b003e" />
        <circle cx="56" cy="34" r="4" fill="#2b003e" />
        <circle cx="44" cy="54" r="5" fill="#2b003e" />
        <circle cx="62" cy="58" r="4.5" fill="#2b003e" />
        <circle cx="32" cy="66" r="4" fill="#2b003e" />
        
        {/* Pistas de circuito */}
        <path
          d="M36 38L44 54M44 54L56 34M44 54L62 58M44 54L32 66"
          stroke="#2b003e"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>

      {/* Logotipo tipográfico "dominio" */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline">
          <span
            className={`${textSizes[size] || textSizes.default} font-extrabold tracking-tight`}
            style={{ color: textColor, fontFamily: "'Plus Jakarta Sans', 'Montserrat', sans-serif" }}
          >
            dominio
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#5dc628] ml-0.5 mb-1 inline-block"></span>
        </div>
        {showSubtitle && (
          <span
            className="text-[9px] tracking-widest uppercase font-bold mt-0.5"
            style={{ color: subtitleColor }}
          >
            Estudio de Diseño
          </span>
        )}
      </div>
    </div>
  );
}
