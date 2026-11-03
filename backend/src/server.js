const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDatabase, getDb } = require('./config/database');
const { runSeed } = require('./seeds/runSeed');

const catalogRoutes = require('./routes/catalogRoutes');
const proposalsRoutes = require('./routes/proposalsRoutes');
const exportRoutes = require('./routes/exportRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rutas de API
app.use('/api/catalog', catalogRoutes);
app.use('/api/proposals', proposalsRoutes);
app.use('/api/export', exportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Dominio Estudio - Prototipo de Estimación de Tareas Técnicas',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error('Error no controlado en Express:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Error interno del servidor'
  });
});

async function startServer() {
  try {
    console.log('[Server] Conectando base de datos...');
    const db = await initDatabase();

    // Comprobar si requiere seed inicial automático
    const existing = await db.query('SELECT COUNT(*) as count FROM componentes');
    if ((existing[0]?.count || 0) === 0) {
      console.log('[Server] Base de datos vacía detectada. Ejecutando seed inicial automático...');
      await runSeed();
    }

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`  Dominio Estudio - Backend API de Estimación Técnica  `);
      console.log(`  Servidor corriendo en: http://localhost:${PORT}        `);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('[Server Error] No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
