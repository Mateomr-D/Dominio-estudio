/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dominio: {
          purple: {
            DEFAULT: '#2b003e', // Color exacto del header institucional
            50: '#fbf5fd',
            100: '#f5ebfa',
            200: '#ebd4f6',
            300: '#ddb3ee',
            400: '#c584e2',
            500: '#a853d2',
            600: '#8c35bb',
            700: '#712699',
            800: '#5a2079',
            900: '#38004e',
            950: '#2b003e', // Fondo morado oscuro oficial
          },
          green: {
            DEFAULT: '#5dc628', // Color verde brillante del cerebro e isotipo
            50: '#f3fbf0',
            100: '#e5f6dd',
            200: '#cceebe',
            300: '#aae195',
            400: '#83cf66',
            500: '#5dc628', // Verde principal Dominio
            600: '#489f1d',
            700: '#397d19',
            800: '#306419',
            900: '#2a5318',
            950: '#132e09',
          },
          dark: '#161329', // Fondo azul/morado ultra oscuro del pie de página
          band: '#5ec62b', // Franja verde del pie de página
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Montserrat', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
