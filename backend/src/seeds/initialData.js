/**
 * Datos Semilla Iniciales para Dominio Estudio
 * Construido con los proyectos y estimaciones reales de Dominio Estudio (archivos XLSX / hojas de trabajo):
 * 1. App Educativa ICBF - OIM (572 hrs)
 * 2. Rediseño y Construcción Plataforma Green List IUCN - Drupal (697 hrs)
 * 3. Chatbot Educativo en WhatsApp con n8n y OpenAI (272 hrs)
 * 4. Plataforma Entidades Financieras (540 hrs)
 * 5. Tasking Propuesta Famisanar - Drupal (420 hrs)
 * 6. Portal E-Commerce Artesanías y Reservas (232.5 hrs - Caso ISER)
 */

const initialComponents = [
  {
    nombre: 'Gestión, Análisis y Planeación de la Solución',
    descripcion: 'Revisión de TDR, reuniones iniciales con stakeholders, levantamiento de requerimientos funcionales, definición de alcance y backlog de tareas.',
    categoria: 'Gestión y Análisis',
    activo: 1,
    tareas: [
      {
        nombre: 'Revisión de TDR, documentación técnica y reuniones iniciales con stakeholders',
        descripcion: 'Análisis de términos de referencia, alineación de expectativas, acuerdos de alcance y actas de inicio.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 4.0, tipo: 'real' },
          { proyecto_origen: 'Chatbot Educativo en WhatsApp (n8n + OpenAI)', horas: 4.0, tipo: 'real' },
          { proyecto_origen: 'Tasking Propuesta Famisanar (Drupal)', horas: 8.0, tipo: 'real' },
          { proyecto_origen: 'Plataforma Green List (IUCN - Drupal)', horas: 4.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Levantamiento de requerimientos detallados y flujos funcionales',
        descripcion: 'Definición de historias de usuario, diagramas de flujo de negocio y criterios de aceptación.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 6.0, tipo: 'real' },
          { proyecto_origen: 'Chatbot Educativo en WhatsApp (n8n + OpenAI)', horas: 8.0, tipo: 'real' },
          { proyecto_origen: 'Plataforma Green List (IUCN - Drupal)', horas: 6.0, tipo: 'real' },
          { proyecto_origen: 'Plataforma Entidades Financieras', horas: 20.0, tipo: 'estimada' }
        ]
      },
      {
        nombre: 'Definición de backlog de tareas, cronograma y criterios de aceptación',
        descripcion: 'Estructuración del plan de sprints, asignación de perfiles técnicos y entregables por fase.',
        perfil: 'QA',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 6.0, tipo: 'real' },
          { proyecto_origen: 'Chatbot Educativo en WhatsApp (n8n + OpenAI)', horas: 6.0, tipo: 'real' },
          { proyecto_origen: 'Plataforma Green List (IUCN - Drupal)', horas: 24.0, tipo: 'real' }
        ]
      }
    ]
  },
  {
    nombre: 'Diseño UI/UX, Wireframes y Prototipos',
    descripcion: 'Diseño de interfaz gráfica, wireframes para web y móvil, prototipos interactivos navegables y diseño instruccional.',
    categoria: 'Diseño y Experiencia',
    activo: 1,
    tareas: [
      {
        nombre: 'Diseño de wireframes para aplicaciones móvil y web',
        descripcion: 'Estructura esquemática de navegación, jerarquía visual y distribución de componentes.',
        perfil: 'Diseño UI/UX',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 12.0, tipo: 'real' },
          { proyecto_origen: 'Plataforma Green List (IUCN - Drupal)', horas: 6.0, tipo: 'real' },
          { proyecto_origen: 'Tasking Propuesta Famisanar (Drupal)', horas: 20.0, tipo: 'real' },
          { proyecto_origen: 'Plataforma Entidades Financieras', horas: 40.0, tipo: 'estimada' }
        ]
      },
      {
        nombre: 'Construcción de prototipos navegables en alta fidelidad',
        descripcion: 'Flujos interactivos de usuario con microinteracciones y validación de usabilidad.',
        perfil: 'Diseño UI/UX',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 16.0, tipo: 'real' },
          { proyecto_origen: 'Plataforma Green List (IUCN - Drupal)', horas: 12.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Diseño visual, guía de estilos y adaptación responsive',
        descripcion: 'Paleta de colores, tipografía corporativa, componentes de diseño y adaptación móvil/tablet.',
        perfil: 'Frontend',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 12.0, tipo: 'real' },
          { proyecto_origen: 'Chatbot Educativo en WhatsApp (n8n + OpenAI)', horas: 24.0, tipo: 'real' },
          { proyecto_origen: 'Plataforma Entidades Financieras', horas: 80.0, tipo: 'estimada' }
        ]
      }
    ]
  },
  {
    nombre: 'Arquitectura de Software y Modelado de Datos',
    descripcion: 'Definición de arquitectura técnica (App, API, Microservicios, CMS), modelado entidad-relación y documentación técnica.',
    categoria: 'Arquitectura e Infraestructura',
    activo: 1,
    tareas: [
      {
        nombre: 'Diseño de arquitectura de software (App, API REST, Base de Datos)',
        descripcion: 'Selección de stack tecnológico, diagramas de arquitectura en capas y patrones de diseño.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 4.0, tipo: 'real' },
          { proyecto_origen: 'Chatbot Educativo en WhatsApp (n8n + OpenAI)', horas: 10.0, tipo: 'real' },
          { proyecto_origen: 'Tasking Propuesta Famisanar (Drupal)', horas: 4.0, tipo: 'real' },
          { proyecto_origen: 'Plataforma Green List (IUCN - Drupal)', horas: 2.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Modelado relacional y creación de migraciones de base de datos',
        descripcion: 'Diseño lógico y físico de tablas, llaves foráneas, índices de optimización y scripts de migración.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 12.0, tipo: 'real' },
          { proyecto_origen: 'Plataforma Green List (IUCN - Drupal)', horas: 2.0, tipo: 'real' },
          { proyecto_origen: 'Portal E-Commerce Artesanías 2024', horas: 8.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Documentación técnica de la solución y especificación de endpoints',
        descripcion: 'Contratos OpenAPI/Swagger, documentación de modelos y lineamientos de integración.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 24.0, tipo: 'real' },
          { proyecto_origen: 'Chatbot Educativo en WhatsApp (n8n + OpenAI)', horas: 8.0, tipo: 'real' },
          { proyecto_origen: 'Plataforma Green List (IUCN - Drupal)', horas: 2.0, tipo: 'real' },
          { proyecto_origen: 'Plataforma Entidades Financieras', horas: 20.0, tipo: 'estimada' }
        ]
      }
    ]
  },
  {
    nombre: 'Configuración Básica, Repositorios y Entornos (DevOps)',
    descripcion: 'Creación y configuración de repositorios Git, montaje de ambientes de desarrollo y pruebas, instalación de librerías base.',
    categoria: 'Arquitectura e Infraestructura',
    activo: 1,
    tareas: [
      {
        nombre: 'Creación de repositorios de código, branching y control de versiones',
        descripcion: 'Configuración en GitHub/GitLab/Bitbucket con políticas de ramas y reglas de Pull Request.',
        perfil: 'DevOps',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 4.0, tipo: 'real' },
          { proyecto_origen: 'Plataforma Green List (IUCN - Drupal)', horas: 1.0, tipo: 'real' },
          { proyecto_origen: 'Tasking Propuesta Famisanar (Drupal)', horas: 4.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Preparación y montaje de entornos de desarrollo local y ambiente de QA',
        descripcion: 'Contenerización con Docker, variables de entorno seguras y servidor de pruebas.',
        perfil: 'DevOps',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 4.0, tipo: 'real' },
          { proyecto_origen: 'Plataforma Green List (IUCN - Drupal)', horas: 1.0, tipo: 'real' },
          { proyecto_origen: 'Tasking Propuesta Famisanar (Drupal)', horas: 4.0, tipo: 'real' },
          { proyecto_origen: 'Plataforma Entidades Financieras', horas: 16.0, tipo: 'estimada' }
        ]
      },
      {
        nombre: 'Instalación y configuración de módulos, dependencias y librerías base',
        descripcion: 'Inicialización del proyecto base, setup de dependencias y paquetes de desarrollo.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 6.0, tipo: 'real' },
          { proyecto_origen: 'Plataforma Green List (IUCN - Drupal)', horas: 8.0, tipo: 'real' },
          { proyecto_origen: 'Tasking Propuesta Famisanar (Drupal)', horas: 20.0, tipo: 'real' }
        ]
      }
    ]
  },
  {
    nombre: 'Autenticación, Usuarios y Gestión de Permisos',
    descripcion: 'Módulos de registro, inicio de sesión seguro, autenticación JWT/OAuth, gestión jerárquica de usuarios, perfiles y permisos RBAC.',
    categoria: 'Seguridad y Usuarios',
    activo: 1,
    tareas: [
      {
        nombre: 'Configuración de backend para autenticación, registro y recuperación',
        descripcion: 'Endpoints seguros para login, registro de usuarios, hash de contraseñas y tokens con refresco.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 2.0, tipo: 'real' },
          { proyecto_origen: 'Plataforma Entidades Financieras', horas: 24.0, tipo: 'estimada' },
          { proyecto_origen: 'Portal E-Commerce Artesanías 2024', horas: 14.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Gestión de roles jerárquicos y control de accesos (RBAC)',
        descripcion: 'Lógica de autorización por perfil (Administrador, Docente, Usuario, Evaluador).',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 12.0, tipo: 'real' },
          { proyecto_origen: 'Plataforma Entidades Financieras', horas: 40.0, tipo: 'estimada' }
        ]
      },
      {
        nombre: 'Vistas frontend de registro, inicio de sesión y gestión de perfil',
        descripcion: 'Formularios reactivos con validación instantánea y pantallas de cuenta de usuario.',
        perfil: 'Frontend',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 24.0, tipo: 'real' },
          { proyecto_origen: 'Portal E-Commerce Artesanías 2024', horas: 12.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Registro, auditoría y trazabilidad de actividad del sistema',
        descripcion: 'Logs estructurados de auditoría para operaciones críticas y cambios de estado.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 16.0, tipo: 'real' }
        ]
      }
    ]
  },
  {
    nombre: 'Gestión de Contenidos, CMS y Soluciones Drupal',
    descripcion: 'Especialidad núcleo de Dominio Estudio: arquitectura Drupal, tipos de contenidos, taxonomías, bloques personalizados y vistas corporativas.',
    categoria: 'E-Learning y Contenidos',
    activo: 1,
    tareas: [
      {
        nombre: 'Creación de tipos de contenido y campos estructurados',
        descripcion: 'Modelado de entidades de contenido en Drupal o CMS a la medida con metadatos.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'Plataforma Green List (IUCN - Drupal)', horas: 24.0, tipo: 'real' },
          { proyecto_origen: 'Tasking Propuesta Famisanar (Drupal)', horas: 20.0, tipo: 'real' },
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 48.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Creación de taxonomías y categorización de contenidos',
        descripcion: 'Vocabularios de términos jerárquicos para filtrado y clasificación semántica.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'Tasking Propuesta Famisanar (Drupal)', horas: 8.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Desarrollo de vistas y componentes visuales de contenido',
        descripcion: 'Vistas interactivas de listado, filtros dinámicos, paginación y grids de artículos.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'Plataforma Green List (IUCN - Drupal)', horas: 24.0, tipo: 'real' },
          { proyecto_origen: 'Tasking Propuesta Famisanar (Drupal)', horas: 40.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Desarrollo de tema personalizado y templates base (Theming)',
        descripcion: 'Maquetación de plantillas Twig/React con diseño a la medida y micro-componentes.',
        perfil: 'Frontend',
        referencias: [
          { proyecto_origen: 'Plataforma Green List (IUCN - Drupal)', horas: 48.0, tipo: 'real' },
          { proyecto_origen: 'Tasking Propuesta Famisanar (Drupal)', horas: 28.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Funcionalidad de búsqueda, filtros avanzados y categorización',
        descripcion: 'Motor de búsqueda interna con autocompletado y facetas por categoría.',
        perfil: 'Frontend',
        referencias: [
          { proyecto_origen: 'Plataforma Green List (IUCN - Drupal)', horas: 16.0, tipo: 'real' },
          { proyecto_origen: 'Tasking Propuesta Famisanar (Drupal)', horas: 8.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Migración masiva de contenidos y scripts de transformación',
        descripcion: 'Extracción, transformación y carga (ETL) de contenidos antiguos hacia el nuevo CMS.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'Tasking Propuesta Famisanar (Drupal)', horas: 62.0, tipo: 'real' }
        ]
      }
    ]
  },
  {
    nombre: 'E-Learning, Chatbots IA y Automatización Educativa',
    descripcion: 'Pilar insignia de Dominio Estudio: integración con WhatsApp Business API, flujos con n8n, inteligencia artificial generativa (OpenAI) y paquetes SCORM.',
    categoria: 'E-Learning y Contenidos',
    activo: 1,
    tareas: [
      {
        nombre: 'Configuración de WhatsApp Business API e integración con n8n',
        descripcion: 'Conexión de canal conversacional seguro, webhooks y servidor de automatización n8n.',
        perfil: 'DevOps',
        referencias: [
          { proyecto_origen: 'Chatbot Educativo en WhatsApp (n8n + OpenAI)', horas: 16.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Conexión con OpenAI y configuración de contexto para Agente IA',
        descripcion: 'Ingeniería de prompts, embeddings de material pedagógico y límites de seguridad.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'Chatbot Educativo en WhatsApp (n8n + OpenAI)', horas: 20.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Diseño instruccional y producción de paquetes SCORM',
        descripcion: 'Estructuración pedagógica de cursos, módulos de aprendizaje y paquetes interactivos SCORM.',
        perfil: 'Diseño UI/UX',
        referencias: [
          { proyecto_origen: 'Chatbot Educativo en WhatsApp (n8n + OpenAI)', horas: 60.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Implementación de flujos conversacionales interactivos en n8n',
        descripcion: 'Lógica condicional, captura de datos, bifurcaciones de respuestas y reintentos.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'Chatbot Educativo en WhatsApp (n8n + OpenAI)', horas: 54.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Módulos de evaluación formativa, emisión de insignias y certificados digitales',
        descripcion: 'Quizzes pedagógicos, puntuaciones y generación automática de diplomas en PDF.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'Chatbot Educativo en WhatsApp (n8n + OpenAI)', horas: 24.0, tipo: 'real' },
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 30.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Sincronización de datos offline/online y almacenamiento local',
        descripcion: 'Soporte para uso sin internet con base de datos local y reconciliación al recuperar conexión.',
        perfil: 'Frontend',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 24.0, tipo: 'real' }
        ]
      }
    ]
  },
  {
    nombre: 'Módulos Transaccionales, Simuladores y Productos',
    descripcion: 'Catálogos interactivos de productos o servicios, simuladores de financiamiento/crédito y flujos transaccionales a la medida.',
    categoria: 'Plataformas Transaccionales',
    activo: 1,
    tareas: [
      {
        nombre: 'Módulo de catálogo interactivo de productos y servicios',
        descripcion: 'Filtros dinámicos, fichas técnicas, comparador y cálculo de precios.',
        perfil: 'Frontend',
        referencias: [
          { proyecto_origen: 'Plataforma Entidades Financieras', horas: 80.0, tipo: 'estimada' },
          { proyecto_origen: 'Portal E-Commerce Artesanías 2024', horas: 20.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Módulo simulador de plan de financiamiento y amortización',
        descripcion: 'Algoritmo de cálculo de cuotas, tasas de interés, seguros y visualización gráfica del plan.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'Plataforma Entidades Financieras', horas: 80.0, tipo: 'estimada' }
        ]
      },
      {
        nombre: 'Módulo de radicación de solicitud y formulario de crédito',
        descripcion: 'Validación en múltiples pasos, adjunto de documentos y guardado temporal de borrador.',
        perfil: 'Frontend',
        referencias: [
          { proyecto_origen: 'Plataforma Entidades Financieras', horas: 80.0, tipo: 'estimada' }
        ]
      },
      {
        nombre: 'Integración con pasarela de pagos y liquidación de transacciones',
        descripcion: 'Checkout electrónico, webhooks de conciliación y notificaciones de pago.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'Portal E-Commerce Artesanías 2024', horas: 36.0, tipo: 'real' },
          { proyecto_origen: 'App Web Reservas Coworking 2025', horas: 30.0, tipo: 'estimada' }
        ]
      }
    ]
  },
  {
    nombre: 'Aseguramiento de Calidad, Pruebas y Seguridad (QA)',
    descripcion: 'Diseño de planes de prueba, pruebas funcionales cross-browser/móvil, pruebas de carga y estrés, escaneo de vulnerabilidades y certificación.',
    categoria: 'Calidad y Seguridad',
    activo: 1,
    tareas: [
      {
        nombre: 'Diseño y estructuración del plan maestro de pruebas',
        descripcion: 'Matriz de cobertura de casos de prueba, criterios de severidad y escenarios de aceptación.',
        perfil: 'QA',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 8.0, tipo: 'real' },
          { proyecto_origen: 'Tasking Propuesta Famisanar (Drupal)', horas: 16.0, tipo: 'real' },
          { proyecto_origen: 'Plataforma Green List (IUCN - Drupal)', horas: 8.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Ejecución de pruebas funcionales y validación de flujos de usuario',
        descripcion: 'Verificación exhaustiva de funcionalidades, formularios, enlaces y reglas de negocio.',
        perfil: 'QA',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 10.0, tipo: 'real' },
          { proyecto_origen: 'Tasking Propuesta Famisanar (Drupal)', horas: 20.0, tipo: 'real' },
          { proyecto_origen: 'Chatbot Educativo en WhatsApp (n8n + OpenAI)', horas: 8.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Pruebas de carga, estrés y rendimiento concurrente',
        descripcion: 'Simulación de peticiones simultáneas, medición de latencias y consumo de memoria/CPU.',
        perfil: 'QA',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 8.0, tipo: 'real' },
          { proyecto_origen: 'Portal E-Commerce Artesanías 2024', horas: 6.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Escaneo de vulnerabilidades, pruebas de seguridad y corrección de incidencias',
        descripcion: 'Verificación contra OWASP Top 10, inyecciones, saneamiento de entradas y headers HTTP.',
        perfil: 'QA',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 8.0, tipo: 'real' },
          { proyecto_origen: 'Tasking Propuesta Famisanar (Drupal)', horas: 24.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Ajustes, corrección de defectos y certificación de pruebas',
        descripcion: 'Resolución de bugs reportados por QA y emisión de informe de certificación final.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 30.0, tipo: 'real' },
          { proyecto_origen: 'Plataforma Green List (IUCN - Drupal)', horas: 32.0, tipo: 'real' },
          { proyecto_origen: 'Tasking Propuesta Famisanar (Drupal)', horas: 28.0, tipo: 'real' }
        ]
      }
    ]
  },
  {
    nombre: 'Despliegue, Publicación y Capacitación',
    descripcion: 'Paso a producción, despliegue en servidor productivo, publicación en tiendas de aplicaciones, manuales de usuario y transferencia técnica.',
    categoria: 'Despliegue y Capacitación',
    activo: 1,
    tareas: [
      {
        nombre: 'Configuración y despliegue del sistema en servidor de producción',
        descripcion: 'Montaje de base de datos productiva, certificados SSL, CDN, backups automáticos y monitoreo.',
        perfil: 'DevOps',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 4.0, tipo: 'real' },
          { proyecto_origen: 'Plataforma Green List (IUCN - Drupal)', horas: 4.0, tipo: 'real' },
          { proyecto_origen: 'Tasking Propuesta Famisanar (Drupal)', horas: 4.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Compilación multiplataforma y publicación en tiendas (Play Store / App Store)',
        descripcion: 'Generación de bundles firmados, cumplimiento de políticas de privacidad y assets para tiendas.',
        perfil: 'DevOps',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 12.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Elaboración de manual de usuario y guía de administración',
        descripcion: 'Documento detallado paso a paso con capturas de pantalla para usuarios finales y administradores.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 12.0, tipo: 'real' },
          { proyecto_origen: 'Plataforma Green List (IUCN - Drupal)', horas: 24.0, tipo: 'real' },
          { proyecto_origen: 'Tasking Propuesta Famisanar (Drupal)', horas: 16.0, tipo: 'real' },
          { proyecto_origen: 'Chatbot Educativo en WhatsApp (n8n + OpenAI)', horas: 12.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Sesiones de capacitación técnica y transferencia de código fuente',
        descripcion: 'Talleres formativos a los administradores del cliente y entrega formal de repositorios.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'App Educativa ICBF - OIM', horas: 10.0, tipo: 'real' },
          { proyecto_origen: 'Plataforma Green List (IUCN - Drupal)', horas: 6.0, tipo: 'real' },
          { proyecto_origen: 'Chatbot Educativo en WhatsApp (n8n + OpenAI)', horas: 8.0, tipo: 'real' }
        ]
      }
    ]
  }
];

// Lista de propuestas históricas de Dominio Estudio para precargar y validar
const realHistoricalProposals = [
  {
    nombre: 'App Educativa Móvil y Web (ICBF - OIM)',
    referencia_cliente: 'ICBF / Organización Internacional para las Migraciones (OIM)',
    tecnologias: 'React Native, Node.js, Express, PostgreSQL, Sincronización Offline, Docker',
    fecha: '2024-08-20',
    estado: 'Comparada',
    reserva_porcentaje: 8.0,
    factor_baja: 0.8,
    factor_media: 1.0,
    factor_alta: 1.3,
    estimacion_manual: 572.0, // Estimación manual registrada en la planilla XLSX
    horas_reales: 588.0,     // Horas reales ejecutadas
    notas: 'Estimación técnica oficial de Dominio Estudio tomada de la planilla "ESTIMACIÓN DE TIEMPOS APP EDUCATIVA ICBF - OIM". Cubre APP móvil, API backend, sincronización offline, seguridad y despliegue.',
    componentes: [
      { componenteNombre: 'Gestión, Análisis y Planeación de la Solución', complejidad: 'media' },
      { componenteNombre: 'Diseño UI/UX, Wireframes y Prototipos', complejidad: 'media' },
      { componenteNombre: 'Arquitectura de Software y Modelado de Datos', complejidad: 'media' },
      { componenteNombre: 'Configuración Básica, Repositorios y Entornos (DevOps)', complejidad: 'media' },
      { componenteNombre: 'Autenticación, Usuarios y Gestión de Permisos', complejidad: 'media' },
      { componenteNombre: 'E-Learning, Chatbots IA y Automatización Educativa', complejidad: 'alta' },
      { componenteNombre: 'Aseguramiento de Calidad, Pruebas y Seguridad (QA)', complejidad: 'media' },
      { componenteNombre: 'Despliegue, Publicación y Capacitación', complejidad: 'media' }
    ]
  },
  {
    nombre: 'Rediseño y Construcción Plataforma Green List (IUCN)',
    referencia_cliente: 'Unión Internacional para la Conservación de la Naturaleza (IUCN) - Ref: GL-2025',
    tecnologias: 'Drupal 10, PHP, MySQL, Theming personalizado Twig, Docker, Nginx',
    fecha: '2025-02-14',
    estado: 'Comparada',
    reserva_porcentaje: 10.0,
    factor_baja: 0.8,
    factor_media: 1.0,
    factor_alta: 1.3,
    estimacion_manual: 697.0, // Estimación manual de la planilla XLSX
    horas_reales: 715.0,
    notas: 'Estimación histórica de Dominio Estudio para la plataforma internacional IUCN Green List construida sobre Drupal con módulos especializados, vistas de estándares globales y soporte.',
    componentes: [
      { componenteNombre: 'Gestión, Análisis y Planeación de la Solución', complejidad: 'media' },
      { componenteNombre: 'Diseño UI/UX, Wireframes y Prototipos', complejidad: 'media' },
      { componenteNombre: 'Gestión de Contenidos, CMS y Soluciones Drupal', complejidad: 'alta' },
      { componenteNombre: 'Aseguramiento de Calidad, Pruebas y Seguridad (QA)', complejidad: 'media' },
      { componenteNombre: 'Despliegue, Publicación y Capacitación', complejidad: 'media' }
    ]
  },
  {
    nombre: 'Chatbot Educativo en WhatsApp con Inteligencia Artificial',
    referencia_cliente: 'Alianza Educativa Virtual - Ref: CHAT-IA-2025',
    tecnologias: 'WhatsApp Business API, n8n Automation, OpenAI GPT-4, Node.js, Webhooks',
    fecha: '2025-06-10',
    estado: 'Comparada',
    reserva_porcentaje: 8.0,
    factor_baja: 0.8,
    factor_media: 1.0,
    factor_alta: 1.3,
    estimacion_manual: 272.0, // Estimación manual registrada en la planilla XLSX
    horas_reales: 284.0,
    notas: 'Proyecto pionero de Dominio Estudio de chatbot pedagógico en WhatsApp, con orquestación en n8n, diseño instruccional, paquetes SCORM y evaluación formativa mediante IA.',
    componentes: [
      { componenteNombre: 'Gestión, Análisis y Planeación de la Solución', complejidad: 'baja' },
      { componenteNombre: 'E-Learning, Chatbots IA y Automatización Educativa', complejidad: 'alta' },
      { componenteNombre: 'Aseguramiento de Calidad, Pruebas y Seguridad (QA)', complejidad: 'media' },
      { componenteNombre: 'Despliegue, Publicación y Capacitación', complejidad: 'baja' }
    ]
  },
  {
    nombre: 'Plataforma para Entidades Financieras',
    referencia_cliente: 'Entidad de Financiamiento y Crédito - Ref: FIN-2024-03',
    tecnologias: 'React, Node.js, Simulador Financiero, Microservicios, MySQL, Docker',
    fecha: '2024-11-05',
    estado: 'Comparada',
    reserva_porcentaje: 8.0,
    factor_baja: 0.8,
    factor_media: 1.0,
    factor_alta: 1.3,
    estimacion_manual: 540.0, // Estimación de la planilla XLSX
    horas_reales: 565.0,
    notas: 'Solución integral financiera con módulos de usuarios, catálogo de productos, simulador de crédito y personalización gráfica completa.',
    componentes: [
      { componenteNombre: 'Gestión, Análisis y Planeación de la Solución', complejidad: 'media' },
      { componenteNombre: 'Diseño UI/UX, Wireframes y Prototipos', complejidad: 'alta' },
      { componenteNombre: 'Autenticación, Usuarios y Gestión de Permisos', complejidad: 'media' },
      { componenteNombre: 'Módulos Transaccionales, Simuladores y Productos', complejidad: 'alta' },
      { componenteNombre: 'Despliegue, Publicación y Capacitación', complejidad: 'media' }
    ]
  },
  {
    nombre: 'Tasking y Desarrollo Web Drupal Famisanar',
    referencia_cliente: 'EPS Famisanar - Ref: PROP-FAMISANAR-2025',
    tecnologias: 'Drupal, PHP, MySQL, Migración de Contenidos, Pruebas de Seguridad',
    fecha: '2025-09-18',
    estado: 'Comparada',
    reserva_porcentaje: 8.0,
    factor_baja: 0.8,
    factor_media: 1.0,
    factor_alta: 1.3,
    estimacion_manual: 420.0, // Estimación manual del tasking
    horas_reales: 438.0,
    notas: 'Tasking detallado de 34 tareas técnicas para la plataforma de Famisanar cubriendo arquitectura, personalización de vistas, migración masiva de contenidos y seguridad.',
    componentes: [
      { componenteNombre: 'Gestión, Análisis y Planeación de la Solución', complejidad: 'baja' },
      { componenteNombre: 'Gestión de Contenidos, CMS y Soluciones Drupal', complejidad: 'alta' },
      { componenteNombre: 'Aseguramiento de Calidad, Pruebas y Seguridad (QA)', complejidad: 'media' },
      { componenteNombre: 'Despliegue, Publicación y Capacitación', complejidad: 'media' }
    ]
  },
  {
    nombre: 'Portal E-Commerce Artesanías y Reservas (Caso ISER)',
    referencia_cliente: 'Artesanías del Valle S.A.S. (Ref: DS-PROP-2025-08)',
    tecnologias: 'React, Node.js, Express, PostgreSQL, Pasarela de Pagos, Tailwind, Docker',
    fecha: '2025-11-15',
    estado: 'Comparada',
    reserva_porcentaje: 10.0,
    factor_baja: 0.8,
    factor_media: 1.0,
    factor_alta: 1.3,
    estimacion_manual: 210.0, // Estimación manual senior
    horas_reales: 232.5,     // Horas reales ejecutadas
    notas: 'Caso de prueba histórico definido para la validación del Objetivo Específico 3 de la propuesta de trabajo de grado.',
    componentes: [
      { componenteNombre: 'Autenticación, Usuarios y Gestión de Permisos', complejidad: 'media' },
      { componenteNombre: 'Módulos Transaccionales, Simuladores y Productos', complejidad: 'alta' },
      { componenteNombre: 'Gestión de Contenidos, CMS y Soluciones Drupal', complejidad: 'baja' },
      { componenteNombre: 'Aseguramiento de Calidad, Pruebas y Seguridad (QA)', complejidad: 'media' }
    ]
  }
];

// Lista de proyectos históricos predefinidos para autocompletar o seleccionar
const allHistoricalProjectsList = [
  'App Educativa ICBF - OIM',
  'Plataforma Green List (IUCN - Drupal)',
  'Chatbot Educativo en WhatsApp (n8n + OpenAI)',
  'Tasking Propuesta Famisanar (Drupal)',
  'Plataforma Entidades Financieras',
  'Portal E-Commerce Artesanías 2024',
  'Portal Institucional ISER 2025',
  'App Web Reservas Coworking 2025',
  'Sistema ERP Andina 2026'
];

module.exports = {
  initialComponents,
  realHistoricalProposals,
  allHistoricalProjectsList
};
