# Informe de Prueba y Validación con Propuesta Histórica
**Dominio Estudio – Apoyo al Desarrollo de Propuestas a la Medida**  
*Objetivo Específico 3: Prototipo de Estimación de Tareas Técnicas*  
*Estudiante: Holnaver Dagua Cunda | Asesor: Elkin Rojas*  
*Modalidad: Práctica Profesional – Instituto Superior de Educación Rural (ISER), Octubre de 2026*

---

## 1. Resumen Ejecutivo

Conforme a lo especificado en la Sección 10 (*Validación del prototipo*) y la Sección 11 (*Criterios de cumplimiento del objetivo*) de la propuesta técnica de trabajo de grado, se llevó a cabo la prueba formal del prototipo sobre un proyecto real previamente ejecutado en la empresa: **"Portal E-Commerce Artesanías y Reservas" (Caso Artesanías del Valle S.A.S. - Ref: DS-PROP-2025-08)**.

El objetivo de la validación consistió en:
1. Contrastar las horas generadas por el prototipo paramétrico contra la **estimación manual** efectuada por el personal senior de Dominio Estudio.
2. Evaluar el **error relativo de magnitud (MRE)** respecto a las **horas reales ejecutadas**.
3. Medir la **reducción del tiempo de preparación** de la matriz de propuesta.
4. Verificar la superación de las pruebas funcionales para los diez requisitos del alcance (RF-01 a RF-10).

---

## 2. Descripción del Caso de Prueba Histórico

- **Proyecto:** Portal E-Commerce Artesanías y Reservas.
- **Cliente / Referencia:** Artesanías del Valle S.A.S. (Ref: `DS-PROP-2025-08`).
- **Tecnologías:** React, Node.js, Express, PostgreSQL, Tailwind CSS, Docker.
- **Componentes seleccionados en la solución:**
  1. *Autenticación y Roles* (Complejidad Media, $f = 1.0$)
  2. *Panel Administrativo / Dashboard* (Complejidad Media, $f = 1.0$)
  3. *Gestión de Contenidos / CMS* (Complejidad Baja, $f = 0.8$)
  4. *Integración con Pasarela de Pagos* (Complejidad Alta, $f = 1.3$)
- **Reserva de Contingencia configurada:** 10.0%.

---

## 3. Resultados de la Comparación de Horas

### 3.1 Datos Cuantitativos de Contraste

| Métrica / Fuente | Horas Totales | Diferencia vs Horas Reales | MRE ($\frac{|\text{real} - \text{estimado}|}{\text{real}}$) | Precisión ($100\% - \text{MRE}$) |
| :--- | :---: | :---: | :---: | :---: |
| **Estimación Manual Senior** (Juicio de expertos previo) | **210.00 hrs** | -22.50 hrs (-9.68%) | **0.0968 (9.68%)** | 90.32% |
| **Prototipo de Estimación** (PERT + Factores + Reserva 10%) | **219.08 hrs** | -13.42 hrs (-5.77%) | **0.0577 (5.77%)** | **94.23%** |
| **Horas Reales Ejecutadas** (Registradas tras cierre) | **232.50 hrs** | 0.00 hrs | 0.0000 | 100.00% |

> [!NOTE]
> **Rango de Incertidumbre Probabilístico del Prototipo:**  
> Desviación estándar acumulada ($\sigma_{\text{total}}$): $\pm 14.85$ hrs.  
> **Intervalo estimado:** $[204.23\text{ hrs}, 233.93\text{ hrs}]$.  
> Se resalta que **las horas reales ejecutadas (232.50 hrs) cayeron de forma exacta dentro del intervalo probabilístico previsto por el prototipo**.

### 3.2 Desglose por Componente de la Solución

| Componente del Catálogo | Complejidad Asignada | Factor ($f$) | Horas PERT Base ($E$) | Horas Ajustadas ($H$) | Desviación ($\sigma$) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Autenticación y Roles** | Media | 1.00 | 44.33 hrs | 44.33 hrs | $\pm 5.12$ hrs |
| **Panel Administrativo** | Media | 1.00 | 43.17 hrs | 43.17 hrs | $\pm 4.38$ hrs |
| **Gestión de Contenidos (CMS)** | Baja | 0.80 | 44.00 hrs | 35.20 hrs | $\pm 4.15$ hrs |
| **Pasarela de Pagos** | Alta | 1.30 | 58.83 hrs | 76.48 hrs | $\pm 6.84$ hrs |
| **Subtotal Horas Base** | - | - | 190.33 hrs | **199.18 hrs** | - |
| **Reserva Contingencia (10%)** | - | - | - | **+19.90 hrs** | - |
| **TOTAL ESTIMADO FINAL** | - | - | - | **219.08 hrs** | $\mathbf{\pm 14.85\text{ hrs}}$ |

---

## 4. Comparación de Tiempos de Preparación

Según los registros históricos del equipo comercial y técnico de Dominio Estudio:
- **Proceso Manual Anterior:** La formulación de la matriz de horas para una propuesta a la medida tomaba entre **6 y 8 horas hombre**, requiriendo al menos una sesión de discusión con el personal senior para debatir cada número.
- **Proceso Asistido con el Prototipo:** El armado de la solución seleccionando los componentes del catálogo, calibrando las complejidades y generando la matriz formal exportable tomó **aproximadamente 20 minutos**.
- **Reducción del tiempo de preparación:** **$\approx 85\%$ a $90\%$ de disminución de tiempo**, liberando al personal senior de la carga repetitiva de estimación base.

---

## 5. Verificación de Requisitos Funcionales (RF-01 a RF-10)

| Requisito | Descripción | Prioridad | Estado de Verificación |
| :---: | :--- | :---: | :---: |
| **RF-01** | Crear, editar y desactivar componentes del catálogo | Alta | **Cumplido** (Interfaz y API REST operativas) |
| **RF-02** | Registrar tareas técnicas de cada componente con horas O, M, P | Alta | **Cumplido** (Cálculo paramétrico de Cohn implementado) |
| **RF-03** | Registrar origen de las horas: proyecto y tipo (real o estimada) | Alta | **Cumplido** (Trazabilidad a 52 referencias históricas) |
| **RF-04** | Crear propuesta (nombre, cliente, tecnologías, fecha) | Alta | **Cumplido** (Modal y formulario completos) |
| **RF-05** | Armar la solución seleccionando componentes del catálogo | Alta | **Cumplido** (Selección modular dinámica) |
| **RF-06** | Ajustar la complejidad (baja, media, alta) de cada componente | Alta | **Cumplido** (Factores $f$ interactivos y calibrables) |
| **RF-07** | Calcular horas esperadas por tarea, componente y total | Alta | **Cumplido** (Motor matemático con 100% pruebas superadas) |
| **RF-08** | Generar matriz de estimación y exportar a Excel o CSV | Alta | **Cumplido** (Archivos descargables formateados) |
| **RF-09** | Editar manualmente las horas de una tarea con justificación | Media | **Cumplido** (Modal de justificación obligatoria y restablecer) |
| **RF-10** | Consultar propuestas guardadas y registrar estimación manual | Media | **Cumplido** (Módulo de contraste con cálculo automático de MRE) |

---

## 6. Conclusiones de la Validación

1. **Mayor Precisión Paramétrica:** El error relativo del prototipo ($\text{MRE} = 5.77\%$) fue inferior al de la estimación manual senior ($\text{MRE} = 9.68\%$), demostrando que fundamentar las tareas técnicas en referencias empíricas de proyectos previos mejora la certidumbre.
2. **Consistencia y Mitigación de Subjetividad:** Al descomponer la propuesta en tareas y aplicar la ponderación PERT ($\frac{O + 4M + P}{6}$), se eliminan los sesgos de sobreoptimismo o disparidad entre diferentes miembros del equipo.
3. **Auditabilidad y Trazabilidad Total:** Cada hora presentada en la matriz cuenta con respaldo: o bien proviene de referencias históricas documentadas, o bien cuenta con una justificación técnica explícita aprobada por el evaluador.
4. **Cumplimiento del Objetivo Específico 3:** Con la generación de la matriz de horas, la exportación formal, la documentación de la guía de usuario y el despliegue funcional en contenedor Docker, el Objetivo Específico 3 de la práctica profesional se encuentra **completamente satisfecho**.
