import React, { createContext, useState, useMemo, useCallback, useContext, useEffect } from 'react';
import { ROLES, TOPICS } from '../data';
import { generateLearningRoute } from '../engine';
import { getAiSynthesis } from '../services/geminiService';

// eslint-disable-next-line react-refresh/only-export-components
export const LearningContext = createContext();

// ============================================================
// BIBLIOTECA DE CONTENIDO DETERMINISTA
// Constante pura a nivel de módulo — no se recrea en renders.
// Organizada por: categoría → nivel → ítems de estudio.
// ============================================================
const RESCUE_ITEM_LIBRARY = {
  fundamentos: {
    basico: [
      { title: "Psicología del comprador",    baseExplanation: "Comprende los motivadores de compra reales: confianza, urgencia y valor percibido. Sin esto, ninguna técnica funciona." },
      { title: "La propuesta de valor",        baseExplanation: "Articular claramente qué diferencia a VentaMax de la competencia es el primer paso del proceso comercial." },
      { title: "Comunicación adaptativa",      baseExplanation: "Cambia tu estilo de comunicación según el perfil del cliente: analítico, expresivo, dominante o amable." },
      { title: "Lenguaje no verbal",           baseExplanation: "El 55% de la comunicación es corporal. Posturas, contacto visual y gestos definen si el cliente confía en ti desde el primer minuto." },
      { title: "Rapport comercial",            baseExplanation: "Técnicas para crear empatía en los primeros 90 segundos de una reunión comercial, base de toda relación de largo plazo." },
    ],
    intermedio: [
      { title: "Inteligencia emocional",       baseExplanation: "Gestiona tus emociones y las del cliente bajo presión. Los mejores vendedores de VentaMax mantienen la calma ante el rechazo." },
      { title: "Anclas mentales de precio",    baseExplanation: "Técnica cognitiva para posicionar el precio antes de presentarlo, reduciendo la resistencia inicial del cliente." },
      { title: "Escucha profunda (nivel 3)",   baseExplanation: "Ir más allá de las palabras: detectar emociones, preocupaciones implícitas y motivaciones no declaradas del cliente." },
      { title: "Preguntas de alto rendimiento",baseExplanation: "El vendedor que pregunta mejor, vende mejor. Formula preguntas que revelan la verdadera necesidad." },
      { title: "Narrativa de valor",           baseExplanation: "Construye casos de éxito internos de VentaMax que puedas usar como prueba social durante la reunión." },
    ]
  },
  proceso_comercial: {
    basico: [
      { title: "Mapa del cliente ideal (ICP)", baseExplanation: "Define el perfil exacto del cliente al que debes dirigir tu energía, evitando prospectos de bajo potencial." },
      { title: "Secuencia omnicanal",          baseExplanation: "Combina LinkedIn, correo y llamada en una secuencia de 5 pasos que triplica la tasa de respuesta de prospectos fríos." },
      { title: "El correo que abre puertas",   baseExplanation: "Estructura de 4 líneas (gancho, relevancia, propuesta, CTA) que genera reuniones en frío con decisores clave." },
      { title: "Gestión del tiempo comercial", baseExplanation: "Bloqueo de tiempo por actividad: prospección, seguimiento, cierre. El vendedor exitoso no improvisa su agenda." },
      { title: "Manejo del Gatekeeper",        baseExplanation: "Estrategias éticas para llegar al decisor real a través de asistentes y recepcionistas en grandes cuentas." },
    ],
    intermedio: [
      { title: "Diagnóstico BANT+",            baseExplanation: "Califica cada oportunidad: Presupuesto, Autoridad, Necesidad, Tiempo y Fit cultural con VentaMax." },
      { title: "Demo centrada en problemas",   baseExplanation: "Transforma la presentación del producto en una sesión de resolución de problemas específicos del cliente." },
      { title: "Propuesta ejecutiva 1-pager",  baseExplanation: "Estructura de propuesta de una página que el decisor puede leer en 3 minutos y compartir internamente." },
      { title: "Seguimiento sin molestar",     baseExplanation: "Sistema de toques de seguimiento que mantiene el deal vivo sin generar incomodidad en el prospecto." },
      { title: "Mapeo de stakeholders",        baseExplanation: "Identifica todos los influenciadores en la decisión de compra y diseña una estrategia de abordaje para cada uno." },
    ]
  },
  tecnicas_venta: {
    intermedio: [
      { title: "Las 4 preguntas SPIN",         baseExplanation: "Situación (contexto), Problema (dolor), Implicación (consecuencias) y Necesidad (visión de solución). En ese orden." },
      { title: "Venta de soluciones",          baseExplanation: "Cambia el foco de características a resultados de negocio. El cliente compra el futuro, no el producto." },
      { title: "El método Challenger",         baseExplanation: "Enseña algo nuevo al cliente sobre su negocio, tensiona su statu quo y ofrece la solución. Aumenta el cierre un 45%." },
      { title: "Storytelling con datos",       baseExplanation: "Combina estadísticas de VentaMax con narrativas emocionales. Los datos convencen, las historias mueven a la acción." },
      { title: "Valor vs. precio",             baseExplanation: "Cuando el cliente pide descuento, el vendedor consultivo ofrece valor adicional. Aprende a reencuadrar la conversación." },
    ],
    avanzado: [
      { title: "Social Selling en LinkedIn",   baseExplanation: "500+ contactos estratégicos y SSI alto genera el doble de oportunidades inbound que el vendedor promedio." },
      { title: "Venta basada en insights",     baseExplanation: "Llega a cada reunión con un insight del sector que el cliente no conoce. Posiciónate como asesor, no vendedor." },
      { title: "Co-creación de soluciones",    baseExplanation: "Involucra al cliente en el diseño de la propuesta. Los clientes compran lo que ayudan a crear." },
      { title: "Cierre por preferencias",      baseExplanation: "Técnica avanzada: preguntas cuál opción prefieren en lugar de pedir la venta. El cierre es una consecuencia natural." },
      { title: "Upselling estratégico",        baseExplanation: "La cuenta más fácil de ganar es la que ya tienes. Identifica oportunidades de expansión dentro del cliente activo." },
    ]
  },
  gestion: {
    intermedio: [
      { title: "CRM como motor de ventas",     baseExplanation: "El vendedor que usa el CRM religiosamente cierra un 29% más. Aprende los campos críticos y la cadencia de actualización." },
      { title: "Scoring de leads",             baseExplanation: "Configura reglas de puntuación para priorizar los prospectos más calientes y no desperdiciar tiempo en oportunidades frías." },
      { title: "Pipeline en semáforo",         baseExplanation: "Verde: deal avanzando. Amarillo: estancado +2 semanas. Rojo: riesgo de perder. Revisa cada deal semanalmente." },
      { title: "Forecast ejecutivo",           baseExplanation: "Presenta el estado del pipeline a dirección: compromisos firmes, probabilidades y riesgos en una sola tabla." },
      { title: "KPIs duales",                  baseExplanation: "Mide actividades (llamadas, demos) Y resultados (cierres, ARR). Los KPIs completos evitan sorpresas al final del mes." },
    ],
    avanzado: [
      { title: "Revenue Operations (RevOps)",  baseExplanation: "Alinea ventas, marketing y servicio al cliente en torno a métricas compartidas de crecimiento de ingresos." },
      { title: "Análisis de win/loss",         baseExplanation: "Entender por qué se ganan y pierden deals es la fuente de mejora más valiosa. Implementa entrevistas post-venta sistemáticas." },
      { title: "Optimización del ciclo",       baseExplanation: "Identifica en qué etapa se caen más deals y diseña intervenciones específicas para reducir el tiempo de cierre." },
      { title: "Gestión de cuota",             baseExplanation: "Distribuye la cuota de forma motivadora considerando territorio, potencial y el histórico de cada vendedor." },
      { title: "Playbook comercial",           baseExplanation: "Documenta las mejores prácticas del equipo en un playbook que convierte nuevos vendedores en el 40% menos de tiempo." },
    ]
  },
  negociacion: {
    avanzado: [
      { title: "Las 3 posiciones",             baseExplanation: "Apertura (ambiciosa), objetivo (realista) y BATNA (mejor alternativa si no hay acuerdo). Las tres deben estar claras antes de negociar." },
      { title: "Objeciones falsas",            baseExplanation: "El 70% de las objeciones son cortinas de humo. Distingue la objeción real de la que esconde el verdadero freno de compra." },
      { title: "Silencio estratégico",         baseExplanation: "Después de presentar el precio, el primero que habla pierde. El silencio es una herramienta de poder en la negociación." },
      { title: "Anclaje de precio",            baseExplanation: "La primera cifra mencionada define el rango mental de toda la negociación. Aprende a anclar alto con justificación sólida." },
      { title: "Concesiones escalonadas",      baseExplanation: "Cada concesión debe ser menor a la anterior y siempre condicional. Da algo, pide algo a cambio. Nunca cedas gratis." },
    ]
  },
  estrategia: {
    avanzado: [
      { title: "Account planning 360°",        baseExplanation: "Plan de 12 meses por cuenta clave: mapa de decisores, oportunidades de expansión, riesgos y recursos necesarios." },
      { title: "Churn y retención",            baseExplanation: "Recuperar un cliente cuesta 7 veces más que retenerlo. Identifica señales de abandono 90 días antes de que ocurran." },
      { title: "Diseño de territorio",         baseExplanation: "Segmenta cuentas por potencial, asigna tiempo estratégicamente y mide la cobertura total de tu territorio." },
      { title: "Forecasting predictivo",       baseExplanation: "Modelos de predicción con +85% de precisión basados en datos históricos para soportar decisiones de dirección." },
      { title: "Coaching 1:1 (GROW)",          baseExplanation: "La cadencia de coaching semanal con estructura GROW (Goal-Reality-Options-Will) aumenta la cuota del equipo un 19%." },
    ]
  }
};

/**
 * Resuelve los ítems de estudio para un tema given.
 * Función pura: misma entrada → misma salida. Sin efectos secundarios.
 * @param {Object} topic - Tema de la ruta de aprendizaje
 * @param {string} roleName - Nombre del cargo (para personalización mínima)
 * @returns {Array} Lista de 5 ítems de estudio
 */
function resolveRescueItems(topic, roleName) {
  const catLib = RESCUE_ITEM_LIBRARY[topic.category];
  const items = catLib?.[topic.level] || catLib?.[Object.keys(catLib || {})[0]];

  if (!items) return [
    { title: `Fundamentos de ${topic.title}`,   explanation: `${topic.description} Dominar este tema es clave para ${roleName} en VentaMax.` },
    { title: "Aplicación práctica",             explanation: `Ejercicios reales para implementar ${topic.title} en el ciclo comercial de VentaMax.` },
    { title: "Métricas de dominio",             explanation: `KPIs para medir el progreso: tasa de aplicación, resultados observables y tiempo de adopción.` },
    { title: "Errores frecuentes",              explanation: `Los 3 errores más comunes al aplicar ${topic.title} y cómo evitarlos desde el primer intento.` },
    { title: "Integración con la ruta",         explanation: `Cómo conectar ${topic.title} con los otros módulos para crear un sistema de ventas coherente.` },
  ];

  // Personalización mínima: añadir el nombre del cargo a la explicación del primer ítem
  return items.map((item, i) => ({
    title: item.title,
    explanation: i === 0
      ? `[${roleName}] ${item.baseExplanation}`
      : item.baseExplanation
  }));
}

export function LearningProvider({ children }) {
  // Feature 3: HIDRATACIÓN DE ESTADO GLOBALS (Persistence via LocalStorage)
  const [step, setStep] = useState(() => parseInt(localStorage.getItem('kmt_step')) || 1);
  const [selectedRole, setSelectedRole] = useState(() => localStorage.getItem('kmt_role') || ROLES[0].id);
  const [masteredTopics, setMasteredTopics] = useState(() => {
    const saved = localStorage.getItem('kmt_topics');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Feature 4: TELEMETRÍA GLOBAL (Observabilidad Interna)
  const [telemetryLogs, setTelemetryLogs] = useState({
    cacheHits: 0,
    apiCalls: 0,
    fallbacks: 0,
    engineRescues: 0 // <-- Nueva métrica de Escudo Determinista
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSynthesis, setAiSynthesis] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [isUsingRescue, setIsUsingRescue] = useState(false); // <-- Flag para avisar a la UI

  // Hook Secundario: Grabado persistente en cada cambio
  useEffect(() => {
    localStorage.setItem('kmt_step', step.toString());
    localStorage.setItem('kmt_role', selectedRole);
    localStorage.setItem('kmt_topics', JSON.stringify(masteredTopics));
  }, [step, selectedRole, masteredTopics]);

  const toggleTopic = useCallback((id) => {
    setMasteredTopics(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  }, []);

  const resetTopics = useCallback(() => {
    setMasteredTopics([]);
    setAiSynthesis(null);
    setAiError(null);
    setIsUsingRescue(false);
    setTelemetryLogs({ cacheHits: 0, apiCalls: 0, fallbacks: 0, engineRescues: 0 });
  }, []);

  const isMastered = useCallback((id) => masteredTopics.includes(id), [masteredTopics]);

  const globalProgress = useMemo(() => {
    if (TOPICS.length === 0) return 0;
    return Math.round((masteredTopics.length / TOPICS.length) * 100);
  }, [masteredTopics]);

  const activeRoleDetails = useMemo(
    () => ROLES.find(r => r.id === selectedRole),
    [selectedRole]
  );

  const { route: learningPath, error: engineError } = useMemo(
    () => generateLearningRoute(selectedRole, masteredTopics),
    [selectedRole, masteredTopics]
  );

  // RESET AUTOMÁTICO: Si la ruta cambia (temas dominados o rol), el análisis anterior
  // ya no es válido — se limpia para que el usuario genere uno nuevo coherente.
  useEffect(() => {
    setAiSynthesis(null);
    setAiError(null);
    setIsUsingRescue(false);
  }, [selectedRole, masteredTopics]);

  // --- MOTOR DETERMINISTA DE RESPALDO (ESCUDO) ---
  // Función pura: depende solo de `path`, `role` y `masteredTopics`.
  // ITEM_LIBRARY está fuera del componente — no contamina el closure.
  const generateStaticFallback = useCallback((path, role) => {
    console.warn("🛡️ [Engine] Activando Motor Determinista de Rescate...");

    const masteredCount = TOPICS.filter(t => masteredTopics.includes(t.id)).length;
    const uniqueCategories = [...new Set(path.map(t => t.category.replace('_', ' ')))];

    return {
      strategy: `Ruta personalizada para ${role?.name} con ${path.length} módulos de alto impacto (${role?.experience} de experiencia). El motor detectó ${masteredCount} temas dominados previamente y optimizó la ruta hacia las brechas reales de desempeño.`,
      gapAnalysis: `Para ${role?.name} (${role?.profile}), el análisis determinista identificó brechas en: ${uniqueCategories.join(', ')}. Las categorías con mayor peso ROI en el vector de perfil son las priorizadas en esta ruta.`,
      modulesContent: path.map(topic => ({
        topicId: topic.id,
        focus: `${topic.description} Relevancia crítica para el perfil ${role?.name}.`,
        items: resolveRescueItems(topic, role?.name),
        detailedSummary: [
          topic.description,
          `Módulo de nivel ${topic.level.toUpperCase()} — ROI base: ${topic.roiBase}/5.5 para el cargo ${role?.name}.`,
          `Prerequisitos: ${topic.prerequisites.length > 0 ? topic.prerequisites.join(', ') : 'ninguno (módulo de entrada)'}. Ya cubiertos en tu ruta, garantizando aprendizaje progresivo sin brechas.`
        ].join('\n\n')
      })),
      executiveChallenge: {
        title: `Reto Ejecutivo VentaMax — ${role?.name}`,
        description: `Integra los ${path.length} módulos en una simulación completa: de la prospección al cierre, demostrando dominio de ${path.map(t => t.title).join(', ')}. Presenta resultados ante dirección de VentaMax con métricas reales.`
      }
    };
  }, [masteredTopics]);

  const nextStep = useCallback(() => {
    if (step === 2) {
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        setStep(3);
      }, 600); 
    } else {
      setStep(s => Math.min(s + 1, 3));
    }
  }, [step]);
  
  const prevStep = useCallback(() => setStep(s => Math.max(s - 1, 1)), []);

  const handleReset = useCallback(() => {
    resetTopics();
    setStep(1);
    localStorage.clear();
  }, [resetTopics]);

  const generateAiMentorSpeech = useCallback(async () => {
    if (!activeRoleDetails || !learningPath) return;
    
    setIsAiLoading(true);
    setAiError(null);
    setIsUsingRescue(false);

    try {
      const response = await getAiSynthesis(activeRoleDetails, learningPath);
      setAiSynthesis({
        ...response.payload,
        source: response.telemetry.source // Guardamos 'cache', 'api_primary' o 'fallback'
      }); 

      setTelemetryLogs(prev => {
        const next = { ...prev };
        if (response.telemetry.source === 'cache') next.cacheHits += 1;
        if (response.telemetry.source === 'api_primary') next.apiCalls += 1;
        if (response.telemetry.source === 'fallback') next.fallbacks += 1;
        return next;
      });

    } catch (err) {
      console.warn("⚠️ Gemini no disponible:", err.message, "— Activando Escudo Determinista.");
      const fallbackData = generateStaticFallback(learningPath, activeRoleDetails);
      setAiSynthesis({ ...fallbackData, source: 'rescue' });
      setIsUsingRescue(true);
      setTelemetryLogs(prev => ({ ...prev, engineRescues: prev.engineRescues + 1 }));

    } finally {
      setIsAiLoading(false);
    }
  }, [activeRoleDetails, learningPath, generateStaticFallback]);

  const value = {
    step,
    nextStep,
    prevStep,
    selectedRole,
    setSelectedRole,
    activeRoleDetails,
    masteredTopics,
    toggleTopic,
    isMastered,
    globalProgress,
    learningPath,
    engineError,
    handleReset,
    isGenerating,
    aiSynthesis,
    isAiLoading,
    aiError,
    generateAiMentorSpeech,
    telemetryLogs,
    isUsingRescue // <-- Propagado para aviso visual
  };

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning debe ser usado dentro de un LearningProvider');
  }
  return context;
}
