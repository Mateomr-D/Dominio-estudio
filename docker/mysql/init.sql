-- Script de inicialización de Base de Datos MySQL
-- Dominio Estudio - Prototipo de Estimación de Tareas Técnicas
-- Trabajo de Grado ISER 2026

CREATE DATABASE IF NOT EXISTS dominio_estudio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dominio_estudio;

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
