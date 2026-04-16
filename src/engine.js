import { TOPICS, ROLES } from './data.js';

/**
 * MOTOR DE RUTAS v7 — "Profile-First" Architecture
 * ====================================================
 * PRINCIPIO: El Perfil del cargo es el ÚNICO juez de qué temas
 * pueden aparecer en una ruta. La Auditoría del usuario solo sirve
 * para saltarse temas que YA CONOCE dentro de su universo permitido.
 *
 * GARANTÍA de Cobertura: El motor asegura que cada categoría marcada
 * como `focusCategories` del cargo tenga al menos un representante en la ruta.
 * ====================================================
 */

/** Validación de roleId */
function validateRole(roleId) {
  if (!roleId || typeof roleId !== 'string') {
    return { valid: false, role: null, error: 'roleId debe ser un string no vacío.' };
  }
  const role = ROLES.find(r => r.id === roleId);
  if (!role) {
    return { valid: false, role: null, error: `Cargo "${roleId}" no encontrado.` };
  }
  return { valid: true, role, error: null };
}

function computeDepth(roleLvl, topicLvl) {
  const diff = roleLvl - topicLvl;
  if (diff > 0) return 'Profundo (Optimización)';
  if (diff < 0) return 'Introductorio';
  return 'Estándar';
}

const PEDAGOGICAL_JUSTIFICATIONS = {
  fundamentos:        'Fundamentos esenciales para la alineación del lenguaje comercial de VentaMax.',
  proceso_comercial:  'Dominio del flujo táctico de ventas, desde el embudo hasta la presentación.',
  tecnicas_venta:     'Metodologías de venta consultiva para el incremento del cierre efectivo.',
  gestion:            'Optimización operativa mediante CRM, pipeline y control de KPIs.',
  negociacion:        'Técnicas avanzadas para el manejo de objeciones y cierres complejos.',
  estrategia:         'Visión estratégica de alto nivel, forecasting y liderazgo data-driven.',
};

/**
 * Scoring de Relevancia — Matemática Pura.
 * Combina: Peso por categoría × ROI Base × Penalización por distancia de nivel.
 */
function scoreNode(topic, role) {
  const vectorWeight = role.targetVector[topic.category] ?? 0;
  if (vectorWeight === 0) return 0;

  const diff = topic.numLevel - role.targetLevel;

  // Penalización dinámica según distancia de nivel
  let stagePenalty = 1.0;
  if (diff > 0) {
    stagePenalty = diff >= 2 ? 0.4 : 0.7;
  } else if (diff < 0) {
    // Ligero castigo para temas "ya conocidos" que sirven de puente
    stagePenalty = 0.85;
  }

  return (topic.roiBase * 10) * vectorWeight * stagePenalty;
}

/**
 * GENERA LA RUTA DE APRENDIZAJE PERSONALIZADA.
 *
 * @param {string} roleId - ID del cargo de VentaMax.
 * @param {string[]} masteredTopicIds - IDs marcados como dominados en la Auditoría.
 * @returns {{ route: object[], error: string|null }}
 */
export function generateLearningRoute(roleId, masteredTopicIds = []) {
  const { valid, role, error } = validateRole(roleId);
  if (!valid) return { route: [], error };

  if (!Array.isArray(masteredTopicIds)) masteredTopicIds = [];

  // ============================================================
  // PASO 1: Construir el universo de candidatos
  // ============================================================
  // El universo parte de TODOS los temas. Luego eliminamos lo que:
  //  a) Supera el techo pedagógico del perfil (maxTopicLevel).
  //  b) El empleado ya marcó como dominado en la Auditoría.
  //  c) El motor infiere que ya sabe por trayectoria (Seniority Shield).

  const inferredMastery = new Set(masteredTopicIds);
  const levelCeiling = role.maxTopicLevel ?? 3;

  TOPICS.forEach(topic => {
    // a) Techo pedagógico: el perfil manda sobre lo que el usuario clica
    if (topic.numLevel > levelCeiling) {
      inferredMastery.add(topic.id);
      return;
    }

    const isExecutive = role.targetLevel >= 3;
    const isSenior    = role.targetLevel >= 2;
    const w           = role.targetVector[topic.category] ?? 0;

    // b) Categoría irrelevante: peso 0 → no le aporta nada
    if (w === 0) {
      inferredMastery.add(topic.id);
      return;
    }

    // c) SENIORITY SHIELD para Ejecutivos (KAM / Líder / Director — Nivel 3)
    //    Con 5-15 años de experiencia ya dominaron Básicos e Intermedios.
    //    → Solo reciben temas AVANZADOS. Sin excepciones.
    if (isExecutive && topic.numLevel <= 2) {
      inferredMastery.add(topic.id);
      return;
    }

    // d) SENIORITY SHIELD para Seniors (Asesor Sr — Nivel 2)
    //    Con 3-6 años ya dominaron los Básicos en sus áreas fuertes.
    if (isSenior && !isExecutive && topic.numLevel === 1 && w > 0.3) {
      inferredMastery.add(topic.id);
      return;
    }
  });

  // ============================================================
  // PASO 2: Construir el Grafo de Dependencias (DAG)
  // ============================================================
  const candidates = TOPICS.filter(t => !inferredMastery.has(t.id));
  const inDegree = new Map();
  const adjList  = new Map();

  candidates.forEach(t => {
    inDegree.set(t.id, 0);
    adjList.set(t.id, []);
  });

  candidates.forEach(t => {
    t.prerequisites.forEach(prqId => {
      // Un prerrequisito bloquea solo si no está en la maestría inferida
      if (!inferredMastery.has(prqId) && inDegree.has(prqId)) {
        adjList.get(prqId).push(t.id);
        inDegree.set(t.id, (inDegree.get(t.id) || 0) + 1);
      }
    });
  });

  // ============================================================
  // PASO 3: Selección Greedy (Kahn's Algorithm + ROI Sort)
  // ============================================================
  const route    = [];
  const topicMap = new Map(candidates.map(t => [t.id, t]));
  let available  = [...inDegree.entries()]
    .filter(([, d]) => d === 0)
    .map(([id]) => id);

  const limit = role.maxRouteSize || 8;

  while (available.length > 0 && route.length < limit) {
    // Orden greedy por score ROI descendente
    available.sort((a, b) =>
      scoreNode(topicMap.get(b), role) - scoreNode(topicMap.get(a), role)
    );

    const currentId = available.shift();
    const topic     = topicMap.get(currentId);
    const score     = scoreNode(topic, role);

    if (score > 0) {
      route.push({
        ...topic,
        impactROI: score.toFixed(1),
        depth:     computeDepth(role.targetLevel, topic.numLevel),
        reasoning: topic.description || '',
      });
    }

    // Liberar bloqueos de dependencias
    (adjList.get(currentId) || []).forEach(depId => {
      const newDeg = inDegree.get(depId) - 1;
      inDegree.set(depId, newDeg);
      if (newDeg === 0) available.push(depId);
    });
  }

  // ============================================================
  // PASO 4: GARANTÍA DE COBERTURA POR focusCategories
  // ============================================================
  // Si el perfil tiene categorías obligatorias, verificar que al menos
  // un tema de cada una esté en la ruta. Si no, se fuerza su inclusión.
  const focusCats      = role.focusCategories || [];
  const routeCats      = new Set(route.map(t => t.category));
  const existingIds    = new Set(route.map(t => t.id));

  for (const cat of focusCats) {
    if (!routeCats.has(cat) && route.length < limit) {
      // Buscar el mejor tema de esa categoría no incluido aún
      const bestForCat = TOPICS
        .filter(t =>
          t.category === cat &&
          !inferredMastery.has(t.id) &&
          !existingIds.has(t.id)
        )
        .map(t => ({ ...t, score: scoreNode(t, role) }))
        .sort((a, b) => b.score - a.score)[0];

      if (bestForCat) {
        route.push({
          ...bestForCat,
          impactROI: bestForCat.score.toFixed(1),
          depth:     computeDepth(role.targetLevel, bestForCat.numLevel),
          reasoning: bestForCat.description || '',
        });
        existingIds.add(bestForCat.id);
      }
    }
  }

  // ============================================================
  // PASO 5: Fallback — Mínimo 5 temas garantizados
  // ============================================================
  if (route.length < 5) {
    const allExistingIds = new Set(route.map(t => t.id));
    const extras = TOPICS
      .filter(t => !inferredMastery.has(t.id) && !allExistingIds.has(t.id))
      .map(t => ({ ...t, score: scoreNode(t, role) }))
      .filter(t => t.score > 0)
      .sort((a, b) => b.score - a.score);

    for (const ec of extras) {
      if (route.length >= 5) break;
      route.push({
        ...ec,
        impactROI: ec.score.toFixed(1),
        depth:     computeDepth(role.targetLevel, ec.numLevel),
        reasoning: ec.description || '',
      });
    }
  }

  // Orden final pedagógico: Básico → Intermedio → Avanzado
  route.sort((a, b) => a.numLevel - b.numLevel);

  return { route, error: null };
}
