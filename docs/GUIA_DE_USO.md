# Guía de Uso del Prototipo de Estimación de Tareas Técnicas
**Dominio Estudio – Apoyo al Desarrollo de Propuestas a la Medida**  
*Trabajo de Grado – Modalidad Práctica Profesional (ISER 2026)*  
*Estudiante: Holnaver Dagua Cunda | Asesor: Elkin Rojas*

---

## 1. Introducción y Objetivo

El prototipo de estimación de tareas técnicas para **Dominio Estudio** tiene como objetivo reemplazar el cálculo manual subjetivo dependiente del personal senior por un **sistema paramétrico y reproducible**.

La solución combina tres pilares metodológicos:
1. **Descomposición de la solución en tareas técnicas atómicas** por perfil (Backend, Frontend, QA, DevOps).
2. **Estimación paramétrica de tres puntos (PERT)** basada en *Mike Cohn (2005)* para modelar la incertidumbre: Optimista ($O$), Probable ($M$) y Pesimista ($P$).
3. **Catálogo nutrido con datos históricos reales** de proyectos anteriores de la organización.

> [!IMPORTANT]
> **Herramienta de Apoyo a la Decisión:** El sistema no sustituye el juicio técnico del equipo, sino que reduce la carga operativa y estandariza la base de cálculo. Cualquier cifra puede editarse manualmente en la matriz, quedando registrada la justificación técnica correspondiente para garantizar la trazabilidad.

---

## 2. Requisitos Previos y Puesta en Marcha

### Opción A: Ejecución Rápida en Desarrollo Local (Sin dependencias externas)
El proyecto incluye un motor SQLite integrado por defecto para pruebas y desarrollo inmediato sin necesidad de instalar o configurar bases de datos externas:

```bash
# 1. Instalar dependencias en la raíz
npm run install:all

# 2. Inicializar base de datos con catálogo y propuesta histórica de prueba
npm run seed

# 3. Iniciar el Backend (Terminal 1)
npm run dev:backend
# Servidor activo en http://localhost:4000

# 4. Iniciar el Frontend (Terminal 2)
npm run dev:frontend
# Aplicación web disponible en http://localhost:3000
```

### Opción B: Despliegue con Docker Compose (Ambiente de Producción con MySQL)
```bash
docker-compose up -d --build
```
- Frontend Web: `http://localhost:3000`
- Backend API: `http://localhost:4000/api`
- MySQL: Puerto `3306`

---

## 3. Guía Paso a Paso de las Funcionalidades

### Paso 1: Gestión del Catálogo de Componentes y Tareas (RF-01 a RF-03)
En la pestaña **"Catálogo de Componentes"**:
1. **Crear o editar componentes (RF-01):** Defina módulos reutilizables (ej: *Autenticación y Roles, Pasarela de Pagos, CMS, Dashboard*). Puede activar o desactivar componentes según su vigencia.
2. **Registrar tareas técnicas por componente (RF-02):** Asigne nombre, descripción y perfil técnico (*Backend, Frontend, QA, DevOps*).
3. **Alimentar referencias históricas (RF-03):** Por cada tarea, registre las horas reportadas en proyectos anteriores, indicando si son horas **reales** (ejecutadas) o **estimadas**.
   - Con múltiples proyectos, el sistema calcula automáticamente:
     - $O = \min(\text{horas})$
     - $M = \text{mediana}(\text{horas})$
     - $P = \max(\text{horas})$
   - Con un único proyecto de referencia ($M$):
     - $O = M \times 0.8$
     - $P = M \times 1.3$

---

### Paso 2: Crear una Nueva Propuesta Técnica (RF-04)
1. Ingrese a la pestaña **"Propuestas de Desarrollo"** y presione el botón **"Nueva Propuesta"**.
2. Complete los campos obligatorios:
   - **Nombre de la propuesta:** Ej. *Plataforma de Subastas y Pagos en Línea*.
   - **Referencia del cliente:** Ej. *AgroComercio del Norte (Ref: PROP-2026-14)*.
   - **Tecnologías previstas:** Ej. *React, Node.js, Express, MySQL, Docker*.
   - **Fecha de emisión.**
3. Configure la **Reserva de Contingencia** (porcentaje configurable, sugerido 10%).
4. Opcionalmente, ajuste los factores de complejidad por defecto (Baja: 0.8, Media: 1.0, Alta: 1.3).
5. Seleccione los componentes iniciales del catálogo y presione **"Crear Propuesta y Generar Matriz"**.

---

### Paso 3: Armado de la Solución y Ajuste por Complejidad (RF-05 y RF-06)
Dentro de la vista de la propuesta:
1. **Agregar más componentes:** Use el botón `+ Agregar Componente` para seleccionar cualquier módulo del catálogo. Sus tareas se incorporarán automáticamente.
2. **Ajustar la complejidad (RF-06):** En cada tarjeta de componente, seleccione en el menú desplegable:
   - **Baja ($f = 0.8$):** Requisitos estándar, interfaces sencillas o integraciones bien documentadas.
   - **Media ($f = 1.0$):** Flujo habitual de desarrollo de Dominio Estudio.
   - **Alta ($f = 1.3$):** Lógica de negocio crítica, algoritmos complejos o pasarelas de pago con conciliación estricta.
3. El sistema recalcula inmediatamente las **Horas Ajustadas ($H = E \times f$)** y actualiza los subtotales en tiempo real.

---

### Paso 4: Revisión de la Matriz y Cálculo PERT (RF-07)
La tabla de la matriz despliega por cada tarea técnica:
- $O$: Estimación optimista.
- $M$: Estimación más probable.
- $P$: Estimación pesimista.
- **PERT ($E$):** Horas esperadas calculadas mediante la fórmula:
  $$E = \frac{O + 4M + P}{6}$$
- **Ajustadas ($H$):** Horas tras aplicar el factor de complejidad:
  $$H = E \times f$$
- **Desviación ($\sigma$):** Incertidumbre de la tarea:
  $$\sigma = \frac{P - O}{6}$$
- **Intervalo Probabilístico de la Propuesta:** Rango $[\text{Total} - \sigma_{\text{total}}, \text{Total} + \sigma_{\text{total}}]$, donde:
  $$\sigma_{\text{total}} = \sqrt{\sum \sigma_i^2}$$

---

### Paso 5: Edición Manual con Justificación Técnica (RF-09)
Si el evaluador técnico o líder senior identifica una particularidad que no contempla el catálogo base:
1. Haga clic en el ícono del **lápiz de edición** junto a la tarea técnica en la matriz.
2. Ingrese el número de horas ajustadas.
3. **Escriba la justificación técnica obligatoria** (mínimo 5 caracteres).  
   *Ejemplo: "Se asignan 18h en lugar de 14h debido a que el cliente exige conciliación bancaria con archivo plano propietario".*
4. Guarde los cambios. La tarea se destacará visualmente en amarillo y se mantendrá trazable tanto el valor PERT original como la justificación.
5. Si desea deshacer el cambio manual, presione el botón de **restablecer** (flecha circular) para volver a la fórmula PERT paramétrica.

---

### Paso 6: Exportación de la Matriz (RF-08)
El sistema permite descargar formalmente la matriz en dos formatos:
- **Microsoft Excel (.xlsx):** Genera una hoja de cálculo profesionalmente estilizada con los colores corporativos de Dominio Estudio, fórmulas numéricas formateadas, metadatos del cliente, desgloses por componente, subtotales, reserva de contingencia, intervalos y trazabilidad.
- **CSV UTF-8 (con BOM):** Compatible directamente con herramientas de análisis de datos, Google Sheets y sistemas ERP.

---

### Paso 7: Comparación con Histórico y Validación (RF-10)
En la pestaña **"Comparación & Validación"**:
1. Seleccione la propuesta que desea analizar.
2. Registre la **Estimación Manual Senior** que se había elaborado previamente mediante juicio de expertos.
3. Registre las **Horas Reales Ejecutadas** (si el proyecto ya concluyó).
4. El sistema calculará automáticamente:
   - **Diferencia porcentual** respecto al juicio manual.
   - **Error Relativo de Magnitud (MRE):**
     $$\text{MRE} = \frac{|\text{real} - \text{estimado}|}{\text{real}}$$
   - **Precisión porcentual:** $100\% - (\text{MRE} \times 100\%)$.
   - Gráfico de barras visual de contraste.

---

## 4. Preguntas Frecuentes y Buenas Prácticas

- **¿Qué pasa si una tarea técnica aún no tiene proyectos históricos previos?**  
  El sistema asigna valores base calibrados con el equipo técnico ($O=4\text{h}, M=8\text{h}, P=16\text{h}$) y señala la condición en la trazabilidad para que el equipo añada referencias cuando el proyecto concluya.
- **¿Cómo calibrar los factores de complejidad?**  
  Al crear o editar una propuesta, abra el panel de *Parámetros de Calibración* para modificar los multiplicadores según el contexto del cliente o la experiencia del equipo disponible.
