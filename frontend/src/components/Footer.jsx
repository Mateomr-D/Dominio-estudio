import React from 'react';
import DominioLogo from './DominioLogo';
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 w-full text-white">
      {/* 1. Franja Superior Verde Oficial Dominio Estudio (de la imagen del pie de página) */}
      <div className="bg-[#5ec62b] text-slate-900 py-6 px-4 sm:px-6 lg:px-8 text-center shadow-inner">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs sm:text-sm font-medium leading-relaxed tracking-normal">
            Nos encanta educar personas. Creemos que la educación transforma vidas. Estamos convencidos que las personas aprenden a su propio ritmo, a través de diferentes estilos y modos. Desde el año 2003, <strong>Dominio Estudio</strong> es la compañía eLearning más innovadora del mercado latinoamericano.
          </p>
        </div>
      </div>

      {/* 2. Cuerpo Principal del Pie de Página en Fondo Oscuro Institucional */}
      <div className="bg-[#161329] pt-12 pb-8 px-4 sm:px-6 lg:px-8 border-t border-purple-950/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-between">
          
          {/* Lado Izquierdo: Logo y Datos de Contacto Oficiales */}
          <div className="space-y-4">
            <DominioLogo variant="light" size="default" showSubtitle={true} />
            
            <div className="text-xs text-slate-300 space-y-1.5 font-light pt-2">
              <div className="flex items-center gap-2 text-slate-200 font-normal">
                <Phone className="w-3.5 h-3.5 text-[#5dc628]" />
                <span>+57 310 809 1660 &nbsp;-&nbsp; +57 312 440 5789</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#5dc628]" />
                <a href="mailto:info@dominioestudio.com" className="hover:text-[#5dc628] transition-colors">
                  info@dominioestudio.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#5dc628]" />
                <span>Diagonal 61C 22A 55, Bogotá, Colombia 111311</span>
              </div>
            </div>
          </div>

          {/* Lado Derecho: Redes Sociales Oficiales en Círculos Verdes */}
          <div className="flex flex-col md:items-end space-y-4">
            <div className="flex items-center gap-3">
              {/* Facebook */}
              <a
                href="https://facebook.com/dominioestudio"
                target="_blank"
                rel="noreferrer"
                title="Facebook Dominio Estudio"
                className="w-10 h-10 rounded-full border-2 border-[#5dc628] text-[#5dc628] hover:bg-[#5dc628] hover:text-[#161329] flex items-center justify-center font-bold text-base transition-all duration-200"
              >
                f
              </a>
              {/* LinkedIn */}
              <a
                href="https://linkedin.com/company/dominio-estudio"
                target="_blank"
                rel="noreferrer"
                title="LinkedIn Dominio Estudio"
                className="w-10 h-10 rounded-full border-2 border-[#5dc628] text-[#5dc628] hover:bg-[#5dc628] hover:text-[#161329] flex items-center justify-center font-bold text-sm transition-all duration-200"
              >
                in
              </a>
              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                title="YouTube Dominio Estudio"
                className="w-10 h-10 rounded-full border-2 border-[#5dc628] text-[#5dc628] hover:bg-[#5dc628] hover:text-[#161329] flex items-center justify-center font-bold text-xs transition-all duration-200"
              >
                ▶
              </a>
              {/* Twitter / X */}
              <a
                href="https://twitter.com/dominioestudio"
                target="_blank"
                rel="noreferrer"
                title="Twitter Dominio Estudio"
                className="w-10 h-10 rounded-full border-2 border-[#5dc628] text-[#5dc628] hover:bg-[#5dc628] hover:text-[#161329] flex items-center justify-center font-bold text-sm transition-all duration-200"
              >
                𝕏
              </a>
            </div>

            <div className="text-right">
              <a
                href="https://dominioestudio.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#5dc628] hover:underline font-semibold"
              >
                <span>Visitar dominioestudio.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Línea de Derechos Reservados */}
        <div className="max-w-7xl mx-auto border-t border-slate-800/80 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 gap-2">
          <div>
            © 2026 Dominio Estudio de Diseño. Todos los derechos reservados.
          </div>
          <div className="text-slate-400">
            Trabajo de Grado: <span className="text-slate-300 font-semibold">Holnaver Dagua Cunda</span> | Asesor: <span className="text-slate-300 font-semibold">Elkin Rojas</span> (ISER)
          </div>
        </div>
      </div>
    </footer>
  );
}
