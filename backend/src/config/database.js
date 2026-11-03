const path = require('path');
const fs = require('fs');

const DB_CLIENT = process.env.DB_CLIENT || 'sqlite';

let dbInstance = null;

// Normalizes parameters: MySQL uses '?' and SQLite also uses '?'
// Normalizes boolean fields and returned rows
function createSqliteWrapper(sqliteDb) {
  return {
    client: 'sqlite',
    query(sql, params = []) {
      return new Promise((resolve, reject) => {
        sqliteDb.all(sql, params, (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        });
      });
    },
    get(sql, params = []) {
      return new Promise((resolve, reject) => {
        sqliteDb.get(sql, params, (err, row) => {
          if (err) return reject(err);
          resolve(row || null);
        });
      });
    },
    run(sql, params = []) {
      return new Promise((resolve, reject) => {
        sqliteDb.run(sql, params, function (err) {
          if (err) return reject(err);
          resolve({
            insertId: this.lastID,
            affectedRows: this.changes
          });
        });
      });
    },
    async exec(sql) {
      return new Promise((resolve, reject) => {
        sqliteDb.exec(sql, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }
  };
}

function createMysqlWrapper(pool) {
  return {
    client: 'mysql',
    async query(sql, params = []) {
      const [rows] = await pool.query(sql, params);
      return rows;
    },
    async get(sql, params = []) {
      const [rows] = await pool.query(sql, params);
      return rows && rows.length > 0 ? rows[0] : null;
    },
    async run(sql, params = []) {
      const [result] = await pool.query(sql, params);
      return {
        insertId: result.insertId,
        affectedRows: result.affectedRows
      };
    },
    async exec(sql) {
      // Split multiple statements if needed
      const statements = sql
        .split(/;\s*$/m)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      for (const statement of statements) {
        await pool.query(statement);
      }
    }
  };
}

async function initDatabase() {
  if (dbInstance) return dbInstance;

  if (DB_CLIENT === 'mysql') {
    const mysql = require('mysql2/promise');
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'rootpassword',
      database: process.env.DB_NAME || 'dominio_estudio',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      multipleStatements: true
    });
    dbInstance = createMysqlWrapper(pool);
    console.log(`[Database] Conectado a MySQL en ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
  } else {
    // SQLite mode
    const sqlite3 = require('sqlite3').verbose();
    const dataDir = path.resolve(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = path.join(dataDir, 'dominio_estudio.sqlite');
    const sqliteDb = new sqlite3.Database(dbPath);
    dbInstance = createSqliteWrapper(sqliteDb);
    console.log(`[Database] Conectado a SQLite en ${dbPath}`);
  }

  // Ensure tables exist
  await createTables(dbInstance);

  return dbInstance;
}

async function createTables(db) {
  if (db.client === 'sqlite') {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS componentes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        categoria TEXT NOT NULL,
        activo INTEGER DEFAULT 1,
        creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tareas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        componente_id INTEGER NOT NULL,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        perfil TEXT NOT NULL, -- 'Backend', 'Frontend', 'QA', 'DevOps', etc.
        creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (componente_id) REFERENCES componentes(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS referencias_horas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tarea_id INTEGER NOT NULL,
        proyecto_origen TEXT NOT NULL,
        horas REAL NOT NULL,
        tipo TEXT NOT NULL, -- 'real' o 'estimada'
        notas TEXT,
        creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tarea_id) REFERENCES tareas(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS propuestas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        referencia_cliente TEXT NOT NULL,
        tecnologias TEXT NOT NULL,
        fecha TEXT NOT NULL,
        estado TEXT DEFAULT 'Borrador', -- 'Borrador', 'Estimada', 'Aprobada', 'Comparada'
        reserva_porcentaje REAL DEFAULT 10.0,
        factor_baja REAL DEFAULT 0.8,
        factor_media REAL DEFAULT 1.0,
        factor_alta REAL DEFAULT 1.3,
        estimacion_manual REAL DEFAULT NULL,
        horas_reales REAL DEFAULT NULL,
        notas TEXT,
        creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
        actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS propuesta_componentes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        propuesta_id INTEGER NOT NULL,
        componente_id INTEGER NOT NULL,
        complejidad TEXT NOT NULL DEFAULT 'media', -- 'baja', 'media', 'alta'
        factor_f REAL NOT NULL DEFAULT 1.0,
        FOREIGN KEY (propuesta_id) REFERENCES propuestas(id) ON DELETE CASCADE,
        FOREIGN KEY (componente_id) REFERENCES componentes(id)
      );

      CREATE TABLE IF NOT EXISTS propuesta_tareas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        propuesta_componente_id INTEGER NOT NULL,
        tarea_id INTEGER NOT NULL,
        O REAL NOT NULL,
        M REAL NOT NULL,
        P REAL NOT NULL,
        horas_esperadas REAL NOT NULL,
        horas_ajustadas REAL NOT NULL,
        desviacion REAL NOT NULL,
        horas_editadas REAL DEFAULT NULL,
        justificacion TEXT DEFAULT NULL,
        editado_manualmente INTEGER DEFAULT 0,
        FOREIGN KEY (propuesta_componente_id) REFERENCES propuesta_componentes(id) ON DELETE CASCADE,
        FOREIGN KEY (tarea_id) REFERENCES tareas(id)
      );
    `);
  } else {
    // MySQL schema
    await db.exec(`
      CREATE TABLE IF NOT EXISTS componentes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        categoria VARCHAR(100) NOT NULL,
        activo TINYINT(1) DEFAULT 1,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS tareas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        componente_id INT NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        perfil VARCHAR(50) NOT NULL,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (componente_id) REFERENCES componentes(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS referencias_horas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tarea_id INT NOT NULL,
        proyecto_origen VARCHAR(255) NOT NULL,
        horas DECIMAL(6,2) NOT NULL,
        tipo ENUM('real', 'estimada') NOT NULL,
        notas TEXT,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tarea_id) REFERENCES tareas(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS propuestas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        referencia_cliente VARCHAR(255) NOT NULL,
        tecnologias VARCHAR(255) NOT NULL,
        fecha VARCHAR(50) NOT NULL,
        estado VARCHAR(50) DEFAULT 'Borrador',
        reserva_porcentaje DECIMAL(5,2) DEFAULT 10.00,
        factor_baja DECIMAL(4,2) DEFAULT 0.80,
        factor_media DECIMAL(4,2) DEFAULT 1.00,
        factor_alta DECIMAL(4,2) DEFAULT 1.30,
        estimacion_manual DECIMAL(8,2) DEFAULT NULL,
        horas_reales DECIMAL(8,2) DEFAULT NULL,
        notas TEXT,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS propuesta_componentes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        propuesta_id INT NOT NULL,
        componente_id INT NOT NULL,
        complejidad ENUM('baja', 'media', 'alta') NOT NULL DEFAULT 'media',
        factor_f DECIMAL(4,2) NOT NULL DEFAULT 1.00,
        FOREIGN KEY (propuesta_id) REFERENCES propuestas(id) ON DELETE CASCADE,
        FOREIGN KEY (componente_id) REFERENCES componentes(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS propuesta_tareas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        propuesta_componente_id INT NOT NULL,
        tarea_id INT NOT NULL,
        O DECIMAL(6,2) NOT NULL,
        M DECIMAL(6,2) NOT NULL,
        P DECIMAL(6,2) NOT NULL,
        horas_esperadas DECIMAL(6,2) NOT NULL,
        horas_ajustadas DECIMAL(6,2) NOT NULL,
        desviacion DECIMAL(6,2) NOT NULL,
        horas_editadas DECIMAL(6,2) DEFAULT NULL,
        justificacion TEXT DEFAULT NULL,
        editado_manualmente TINYINT(1) DEFAULT 0,
        FOREIGN KEY (propuesta_componente_id) REFERENCES propuesta_componentes(id) ON DELETE CASCADE,
        FOREIGN KEY (tarea_id) REFERENCES tareas(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  }
}

function getDb() {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return dbInstance;
}

module.exports = {
  initDatabase,
  getDb
};
