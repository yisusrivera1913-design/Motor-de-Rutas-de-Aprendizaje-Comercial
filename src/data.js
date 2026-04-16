/**
 * KOMETA — Fuente de Verdad v7 "Profile-First"
 * ============================================================
 * ARQUITECTURA: Perfil → Categorías Obligatorias → Temas
 *
 * Cada cargo tiene:
 *  - focusCategories: Las categorías que SÍ DEBE aprender (del PDF).
 *  - excludeCategories: Las que NO necesita (no le dan ROI real).
 *  - maxTopicLevel: Techo pedagógico (1=Básico, 2=Intermedio, 3=Avanzado).
 *  - targetVector: Pesos de relevancia por categoría (0.0–1.0) para el scoring.
 * ============================================================
 */

// === CATÁLOGO DE TEMAS (según el PDF de VentaMax) ===
export const TOPICS = [
  // --- BÁSICO: Fundamentos ---
  { id: 'fund_1', title: 'Qué es vender',         description: 'Conceptos fundamentales sobre la naturaleza y el propósito de la venta.',        category: 'fundamentos',        level: 'basico',     numLevel: 1, prerequisites: [],                    roiBase: 1.5 },
  { id: 'fund_2', title: 'Tipos de clientes',      description: 'Clasificación y comprensión de los diferentes perfiles de clientes.',             category: 'fundamentos',        level: 'basico',     numLevel: 1, prerequisites: [],                    roiBase: 2.0 },
  { id: 'fund_3', title: 'Comunicación efectiva',  description: 'Técnicas de comunicación para establecer relaciones comerciales sólidas.',        category: 'fundamentos',        level: 'basico',     numLevel: 1, prerequisites: ['fund_1'],             roiBase: 3.5 },
  { id: 'fund_4', title: 'Escucha activa',          description: 'Capacidad de escucha para detectar necesidades reales del cliente.',             category: 'fundamentos',        level: 'basico',     numLevel: 1, prerequisites: ['fund_3'],             roiBase: 4.0 },

  // --- BÁSICO: Proceso comercial ---
  { id: 'proc_1', title: 'Etapas del embudo',          description: 'Comprensión y gestión de las etapas del proceso de venta.',                     category: 'proceso_comercial',  level: 'basico',     numLevel: 1, prerequisites: ['fund_1'],             roiBase: 4.5 },
  { id: 'proc_2', title: 'Prospección básica',          description: 'Métodos para identificar y clasificar clientes potenciales.',                    category: 'proceso_comercial',  level: 'basico',     numLevel: 1, prerequisites: ['proc_1'],             roiBase: 3.8 },
  { id: 'proc_3', title: 'Presentación del producto',   description: 'Técnicas para presentar el valor del producto al cliente.',                      category: 'proceso_comercial',  level: 'basico',     numLevel: 1, prerequisites: ['fund_3', 'proc_1'],  roiBase: 4.2 },

  // --- INTERMEDIO: Técnicas de venta ---
  { id: 'tech_1', title: 'SPIN Selling',             description: 'Metodología de preguntas Situación, Problema, Implicación y Necesidad.',        category: 'tecnicas_venta',     level: 'intermedio', numLevel: 2, prerequisites: ['fund_4', 'proc_2'],  roiBase: 5.0 },
  { id: 'tech_2', title: 'Venta consultiva',          description: 'Enfoque de venta basado en diagnóstico y solución personalizada al cliente.',   category: 'tecnicas_venta',     level: 'intermedio', numLevel: 2, prerequisites: ['fund_2', 'tech_1'],  roiBase: 4.8 },
  { id: 'tech_3', title: 'Storytelling comercial',    description: 'Uso de narrativas persuasivas para conectar emocionalmente con el cliente.',    category: 'tecnicas_venta',     level: 'intermedio', numLevel: 2, prerequisites: ['proc_3'],             roiBase: 3.5 },

  // --- INTERMEDIO: Gestión ---
  { id: 'mngt_1', title: 'CRM básico',         description: 'Gestión de la relación con el cliente mediante herramientas digitales.',          category: 'gestion',            level: 'intermedio', numLevel: 2, prerequisites: ['proc_1'],             roiBase: 3.0 },
  { id: 'mngt_2', title: 'Pipeline',            description: 'Gestión y seguimiento del flujo de oportunidades comerciales.',                  category: 'gestion',            level: 'intermedio', numLevel: 2, prerequisites: ['mngt_1'],             roiBase: 4.1 },
  { id: 'mngt_3', title: 'Indicadores KPI',     description: 'Medición y análisis de indicadores clave de desempeño comercial.',               category: 'gestion',            level: 'intermedio', numLevel: 2, prerequisites: ['mngt_2'],             roiBase: 3.9 },

  // --- AVANZADO: Negociación ---
  { id: 'nego_1', title: 'Manejo de objeciones',   description: 'Técnicas para identificar, gestionar y superar las objeciones del cliente.',   category: 'negociacion',        level: 'avanzado',   numLevel: 3, prerequisites: ['tech_1', 'tech_2'],  roiBase: 5.0 },
  { id: 'nego_2', title: 'Cierre de ventas',        description: 'Estrategias y metodologías para concretar acuerdos comerciales efectivos.',    category: 'negociacion',        level: 'avanzado',   numLevel: 3, prerequisites: ['nego_1'],             roiBase: 5.5 },
  { id: 'nego_3', title: 'Negociación Harvard',     description: 'Método de negociación basado en principios y generación de beneficios mutuos.', category: 'negociacion',       level: 'avanzado',   numLevel: 3, prerequisites: ['nego_2'],             roiBase: 4.8 },

  // --- AVANZADO: Estrategia ---
  { id: 'stra_1', title: 'Account-based sales',    description: 'Estrategia de ventas focalizada en cuentas clave de alto valor para la empresa.',  category: 'estrategia',        level: 'avanzado',   numLevel: 3, prerequisites: ['tech_2', 'mngt_2'],  roiBase: 4.5 },
  { id: 'stra_2', title: 'Forecasting',              description: 'Proyección y análisis de ventas futuras para la toma de decisiones estratégicas.',  category: 'estrategia',        level: 'avanzado',   numLevel: 3, prerequisites: ['mngt_3'],             roiBase: 4.2 },
  { id: 'stra_3', title: 'Liderazgo comercial',      description: 'Gestión, motivación y desarrollo de equipos comerciales de alto rendimiento.',      category: 'estrategia',        level: 'avanzado',   numLevel: 3, prerequisites: ['stra_2'],             roiBase: 4.0 },
  { id: 'stra_4', title: 'Ventas data-driven',       description: 'Toma de decisiones comerciales basada en análisis de datos e inteligencia de ventas.', category: 'estrategia',     level: 'avanzado',   numLevel: 3, prerequisites: ['mngt_3', 'stra_2'],  roiBase: 4.9 },
];

/**
 * === PERFILES DE CARGO (Profile-First Architecture) ===
 *
 * focusCategories: Categorías del PDF que este cargo DEBE aprender.
 * maxTopicLevel:   Techo pedagógico máximo (el perfil manda, no el usuario).
 * targetVector:    Pesos 0–1 para scoring matemático (cuánto importa cada categoría).
 */
export const ROLES = [
  {
    id: 'asesor_jr',
    name: 'Asesor Comercial Junior',
    profile: 'Recién egresado, alta motivación, base técnica débil',
    experience: '0-1 año',
    age: '22-27',
    targetLevel: 1,
    maxTopicLevel: 1, // Solo temas Básicos — su base técnica es débil
    maxRouteSize: 8,
    // PDF: Fundamentos + Proceso comercial
    focusCategories: ['fundamentos', 'proceso_comercial'],
    targetVector: {
      'fundamentos':       1.0,
      'proceso_comercial': 1.0,
      'tecnicas_venta':    0.3,
      'gestion':           0.1,
      'negociacion':       0.0,
      'estrategia':        0.0,
    }
  },
  {
    id: 'asesor_sr',
    name: 'Asesor Comercial Senior',
    profile: 'Domina el proceso, necesita técnicas avanzadas',
    experience: '3-6 años',
    age: '28-35',
    targetLevel: 2,
    maxTopicLevel: 3, // Puede llegar a Avanzado — necesita técnicas avanzadas
    maxRouteSize: 8,
    // PDF: Técnicas de venta (principal) + Gestión
    focusCategories: ['tecnicas_venta', 'gestion', 'negociacion'],
    targetVector: {
      'fundamentos':       0.0, // Ya domina el proceso
      'proceso_comercial': 0.0, // Ya domina el proceso
      'tecnicas_venta':    1.0,
      'gestion':           0.8,
      'negociacion':       0.7,
      'estrategia':        0.3,
    }
  },
  {
    id: 'kam',
    name: 'Key Account Manager',
    profile: 'Cuentas grandes, necesita estrategia y negociación',
    experience: '5-10 años',
    age: '32-40',
    targetLevel: 3,
    maxTopicLevel: 3,
    maxRouteSize: 7,
    // PDF: Negociación + Estrategia (cuentas grandes)
    focusCategories: ['negociacion', 'estrategia', 'tecnicas_venta'],
    targetVector: {
      'fundamentos':       0.0,
      'proceso_comercial': 0.0,
      'tecnicas_venta':    0.7,
      'gestion':           0.5,
      'negociacion':       1.0,
      'estrategia':        1.0,
    }
  },
  {
    id: 'lider_comercial',
    name: 'Líder Comercial',
    profile: 'Gestiona equipo, necesita liderazgo y forecasting',
    experience: '8-15 años',
    age: '35-45',
    targetLevel: 3,
    maxTopicLevel: 3,
    maxRouteSize: 7,
    // PDF: Estrategia (liderazgo + forecasting) + Gestión
    focusCategories: ['estrategia', 'gestion', 'negociacion'],
    targetVector: {
      'fundamentos':       0.0,
      'proceso_comercial': 0.0,
      'tecnicas_venta':    0.3,
      'gestion':           1.0,
      'negociacion':       0.7,
      'estrategia':        1.0,
    }
  },
  {
    id: 'director_ventas',
    name: 'Director de Ventas',
    profile: 'Visión estratégica, poco tiempo disponible',
    experience: '+15 años',
    age: '40-55',
    targetLevel: 3,
    maxTopicLevel: 3,
    maxRouteSize: 6,
    // PDF: Solo Estrategia de alto nivel (poco tiempo disponible)
    focusCategories: ['estrategia', 'negociacion'],
    targetVector: {
      'fundamentos':       0.0,
      'proceso_comercial': 0.0,
      'tecnicas_venta':    0.2,
      'gestion':           0.6,
      'negociacion':       0.8,
      'estrategia':        1.0,
    }
  },
];
