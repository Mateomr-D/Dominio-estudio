/**
 * Datos Semilla Iniciales para Dominio Estudio
 * Construido con proyectos anteriores de la empresa conforme a la Sección 7 del documento
 */

const initialComponents = [
  {
    nombre: 'Autenticación y Roles',
    descripcion: 'Sistema de control de acceso, registro, inicio de sesión seguro, recuperación de credenciales y asignación de roles jerárquicos (RBAC).',
    categoria: 'Seguridad y Usuarios',
    activo: 1,
    tareas: [
      {
        nombre: 'Diseño de esquema de usuarios, roles y permisos en base de datos',
        descripcion: 'Modelado relacional de tablas de usuarios, roles, permisos y llaves foráneas con índices de rendimiento.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'E-Commerce Artesanías 2024', horas: 6.0, tipo: 'real' },
          { proyecto_origen: 'Portal Institucional ISER 2025', horas: 8.0, tipo: 'real' },
          { proyecto_origen: 'App Web Reservas Coworking 2025', horas: 7.0, tipo: 'estimada' }
        ]
      },
      {
        nombre: 'Implementación de endpoints JWT / OAuth2 (login, registro, recuperación)',
        descripcion: 'API REST con cifrado Argon2/Bcrypt, generación de tokens JWT con refresh token y endpoints de recuperación de contraseña.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'E-Commerce Artesanías 2024', horas: 14.0, tipo: 'real' },
          { proyecto_origen: 'Portal Institucional ISER 2025', horas: 18.0, tipo: 'real' },
          { proyecto_origen: 'Sistema ERP Andina 2026', horas: 16.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Vistas y formularios de autenticación responsivos con validaciones',
        descripcion: 'Interfaces en React para login, registro y reset password con feedback de validación en tiempo real.',
        perfil: 'Frontend',
        referencias: [
          { proyecto_origen: 'E-Commerce Artesanías 2024', horas: 12.0, tipo: 'real' },
          { proyecto_origen: 'Portal Institucional ISER 2025', horas: 10.0, tipo: 'real' },
          { proyecto_origen: 'App Web Reservas Coworking 2025', horas: 11.0, tipo: 'estimada' }
        ]
      },
      {
        nombre: 'Pruebas de seguridad, sesiones y control de accesos RBAC',
        descripcion: 'Pruebas de penetración básica, expiración de tokens, inyección SQL y verificación de rutas protegidas.',
        perfil: 'QA',
        referencias: [
          { proyecto_origen: 'E-Commerce Artesanías 2024', horas: 8.0, tipo: 'real' },
          { proyecto_origen: 'Portal Institucional ISER 2025', horas: 6.0, tipo: 'real' }
        ]
      }
    ]
  },
  {
    nombre: 'Panel Administrativo (Dashboard)',
    descripcion: 'Consola central de administración con visualización de métricas, resumen de actividad del negocio y navegación unificada.',
    categoria: 'Administración y Gestión',
    activo: 1,
    tareas: [
      {
        nombre: 'Estructura base del layout administrativo con sidebar y breadcrumbs',
        descripcion: 'Maquetación modular responsiva con temas claro/oscuro, sidebar colapsable y barra superior.',
        perfil: 'Frontend',
        referencias: [
          { proyecto_origen: 'E-Commerce Artesanías 2024', horas: 10.0, tipo: 'real' },
          { proyecto_origen: 'Portal Institucional ISER 2025', horas: 12.0, tipo: 'real' },
          { proyecto_origen: 'App Web Reservas Coworking 2025', horas: 8.0, tipo: 'estimada' }
        ]
      },
      {
        nombre: 'API de métricas y resumen de KPIs para dashboard',
        descripcion: 'Consultas agregadas optimizadas con caché para total de ventas, usuarios activos y actividad reciente.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'E-Commerce Artesanías 2024', horas: 12.0, tipo: 'real' },
          { proyecto_origen: 'Sistema ERP Andina 2026', horas: 15.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Visualización de gráficos analíticos e interactividad',
        descripcion: 'Integración de gráficos de barras, líneas y donas con filtros interactivos de tiempo.',
        perfil: 'Frontend',
        referencias: [
          { proyecto_origen: 'E-Commerce Artesanías 2024', horas: 14.0, tipo: 'real' },
          { proyecto_origen: 'Portal Institucional ISER 2025', horas: 11.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Pruebas de visualización y compatibilidad cross-browser',
        descripcion: 'Verificación en navegadores móviles y de escritorio de gráficos y comportamiento dinámico.',
        perfil: 'QA',
        referencias: [
          { proyecto_origen: 'E-Commerce Artesanías 2024', horas: 6.0, tipo: 'real' },
          { proyecto_origen: 'Portal Institucional ISER 2025', horas: 5.0, tipo: 'real' }
        ]
      }
    ]
  },
  {
    nombre: 'Gestión de Contenidos (CMS)',
    descripcion: 'Módulo de creación, categorización, edición enriquecida y publicación de contenidos informativos.',
    categoria: 'Contenido y Medios',
    activo: 1,
    tareas: [
      {
        nombre: 'CRUD de artículos, páginas y categorías con control de estados',
        descripcion: 'Endpoints y lógica de negocio para borradores, programados y publicados.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'Portal Institucional ISER 2025', horas: 16.0, tipo: 'real' },
          { proyecto_origen: 'E-Commerce Artesanías 2024', horas: 12.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Editor de texto enriquecido (WYSIWYG) y carga de multimedia',
        descripcion: 'Integración de editor visual con subida de imágenes arrastrar-y-soltar y visor de galerías.',
        perfil: 'Frontend',
        referencias: [
          { proyecto_origen: 'Portal Institucional ISER 2025', horas: 14.0, tipo: 'real' },
          { proyecto_origen: 'E-Commerce Artesanías 2024', horas: 10.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Configuración de almacenamiento S3/Cloud Storage para activos',
        descripcion: 'Bucket con CDN, redimensionamiento automático de imágenes y políticas de seguridad.',
        perfil: 'DevOps',
        referencias: [
          { proyecto_origen: 'Portal Institucional ISER 2025', horas: 8.0, tipo: 'real' },
          { proyecto_origen: 'E-Commerce Artesanías 2024', horas: 6.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Validación de flujos de publicación y roles editoriales',
        descripcion: 'Pruebas de permisos diferenciados entre Redactor, Editor y Administrador.',
        perfil: 'QA',
        referencias: [
          { proyecto_origen: 'Portal Institucional ISER 2025', horas: 6.0, tipo: 'real' }
        ]
      }
    ]
  },
  {
    nombre: 'Integración con Pasarela de Pagos',
    descripcion: 'Procesamiento de pagos electrónicos (Wompi, PayU, Stripe), gestión de carritos y liquidación de transacciones.',
    categoria: 'Finanzas y Transacciones',
    activo: 1,
    tareas: [
      {
        nombre: 'Integración con API de pasarela de pagos y creación de checkout seguro',
        descripcion: 'Conexión con SDK oficial, generación de referencias de pago únicas y tokens de transacción.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'E-Commerce Artesanías 2024', horas: 20.0, tipo: 'real' },
          { proyecto_origen: 'Sistema ERP Andina 2026', horas: 24.0, tipo: 'real' },
          { proyecto_origen: 'App Web Reservas Coworking 2025', horas: 18.0, tipo: 'estimada' }
        ]
      },
      {
        nombre: 'Webhook de confirmación de pagos y manejo asíncrono de órdenes',
        descripcion: 'Endpoint seguro con validación de firma HMAC para actualizar estados de pedidos en tiempo real.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'E-Commerce Artesanías 2024', horas: 16.0, tipo: 'real' },
          { proyecto_origen: 'Sistema ERP Andina 2026', horas: 14.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Pantallas de selección de método de pago y comprobante transaccional',
        descripcion: 'Flujo visual guiado con tarjetas de crédito, PSE, transferencias y generación de recibo digital.',
        perfil: 'Frontend',
        referencias: [
          { proyecto_origen: 'E-Commerce Artesanías 2024', horas: 14.0, tipo: 'real' },
          { proyecto_origen: 'App Web Reservas Coworking 2025', horas: 12.0, tipo: 'estimada' }
        ]
      },
      {
        nombre: 'Pruebas en sandbox de pagos: aprobados, rechazados y timeouts',
        descripcion: 'Batería exhaustiva de pruebas con tarjetas de prueba para casos de saldo insuficiente y reintentos.',
        perfil: 'QA',
        referencias: [
          { proyecto_origen: 'E-Commerce Artesanías 2024', horas: 12.0, tipo: 'real' },
          { proyecto_origen: 'Sistema ERP Andina 2026', horas: 10.0, tipo: 'real' }
        ]
      }
    ]
  },
  {
    nombre: 'Módulo de Notificaciones y Correos',
    descripcion: 'Envío automático de correos electrónicos transaccionales y notificaciones push / en aplicación.',
    categoria: 'Comunicaciones',
    activo: 1,
    tareas: [
      {
        nombre: 'Configuración de servicio SMTP / SendGrid y cola de mensajería',
        descripcion: 'Worker en background para envíos asíncronos y reintentos ante caídas del proveedor.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'E-Commerce Artesanías 2024', horas: 8.0, tipo: 'real' },
          { proyecto_origen: 'Portal Institucional ISER 2025', horas: 6.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Plantillas HTML responsivas para correos transaccionales',
        descripcion: 'Diseño accesible de plantillas de bienvenida, confirmación de orden y cambio de contraseña.',
        perfil: 'Frontend',
        referencias: [
          { proyecto_origen: 'E-Commerce Artesanías 2024', horas: 8.0, tipo: 'real' },
          { proyecto_origen: 'App Web Reservas Coworking 2025', horas: 6.0, tipo: 'estimada' }
        ]
      },
      {
        nombre: 'Pruebas de entregabilidad, filtros antispam y vista previa',
        descripcion: 'Validación en Gmail, Outlook y clientes móviles de visualización y enlaces.',
        perfil: 'QA',
        referencias: [
          { proyecto_origen: 'E-Commerce Artesanías 2024', horas: 4.0, tipo: 'real' }
        ]
      }
    ]
  },
  {
    nombre: 'Reportes y Exportación de Datos',
    descripcion: 'Generación de documentos PDF tabulados y exportación a formatos Excel / CSV con filtros.',
    categoria: 'Inteligencia de Negocio',
    activo: 1,
    tareas: [
      {
        nombre: 'Motor de generación de reportes PDF y hojas de cálculo Excel',
        descripcion: 'Servicio en backend que compila plantillas y exporta grandes volúmenes con paginación.',
        perfil: 'Backend',
        referencias: [
          { proyecto_origen: 'Sistema ERP Andina 2026', horas: 14.0, tipo: 'real' },
          { proyecto_origen: 'E-Commerce Artesanías 2024', horas: 10.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Interfaz de usuario para filtros y descarga de reportes',
        descripcion: 'Modales de selección de columnas, rango de fechas y botones con estado de descarga.',
        perfil: 'Frontend',
        referencias: [
          { proyecto_origen: 'Sistema ERP Andina 2026', horas: 8.0, tipo: 'real' },
          { proyecto_origen: 'E-Commerce Artesanías 2024', horas: 6.0, tipo: 'real' }
        ]
      },
      {
        nombre: 'Pruebas de integridad de datos exportados vs base de datos',
        descripcion: 'Verificación de sumatorias, redondeos y coincidencia de registros exportados.',
        perfil: 'QA',
        referencias: [
          { proyecto_origen: 'Sistema ERP Andina 2026', horas: 6.0, tipo: 'real' }
        ]
      }
    ]
  }
];

// Caso de validación histórica conforme a la Sección 10
const historicalValidationProposal = {
  nombre: 'Portal E-Commerce Artesanías y Reservas (Caso de Estudio ISER)',
  referencia_cliente: 'Artesanías del Valle S.A.S. (Ref: DS-PROP-2025-08)',
  tecnologias: 'React, Node.js, Express, PostgreSQL, Tailwind, Docker',
  fecha: '2025-11-15',
  estado: 'Comparada',
  reserva_porcentaje: 10.0,
  factor_baja: 0.8,
  factor_media: 1.0,
  factor_alta: 1.3,
  estimacion_manual: 210.0, // Estimación manual que realizó el personal senior de la empresa
  horas_reales: 232.5,     // Horas reales reportadas tras finalizar el proyecto
  notas: 'Propuesta histórica tomada para la validación del prototipo según Sección 10 del documento de grado. Permite evaluar el error MRE y la reducción de variabilidad frente al juicio de expertos.',
  componentes: [
    { componenteNombre: 'Autenticación y Roles', complejidad: 'media' },
    { componenteNombre: 'Panel Administrativo (Dashboard)', complejidad: 'media' },
    { componenteNombre: 'Gestión de Contenidos (CMS)', complejidad: 'baja' },
    { componenteNombre: 'Integración con Pasarela de Pagos', complejidad: 'alta' }
  ]
};

module.exports = {
  initialComponents,
  historicalValidationProposal
};
