import { TOPICS, ROLES } from './src/data.js';

/**
 * AUDITOR MATEMÁTICO DE GRAFOS - KOMETA v6
 * Objetivo: Probar matemáticamente la integridad del Grafo de Prerrequisitos (DAG).
 */

console.log("🧐 Iniciando Auditoría Matemática de Estructura...");

let errors = 0;

// 1. Verificación de Categorías
const VALID_CATEGORIES = [
  'conceptos_basicos', 'inteligencia_emocional', 'tecnicas_venta', 
  'producto_mercado', 'crm_analitica', 'gestion_tiempo'
];

TOPICS.forEach(topic => {
  if (!VALID_CATEGORIES.includes(topic.category)) {
    console.error(`❌ [Categoría Inválida] Tema ${topic.id} tiene categoría desconocida: ${topic.category}`);
    errors++;
  }
});

// 2. Detección de Ciclos (Loops) Matemáticos — Algoritmo DFS
function hasCycle() {
  const adj = new Map();
  TOPICS.forEach(t => adj.set(t.id, t.prerequisites));

  const visited = new Set();
  const recStack = new Set();

  function isCyclic(id) {
    if (recStack.has(id)) return true;
    if (visited.has(id)) return false;

    visited.add(id);
    recStack.add(id);

    const neighbors = adj.get(id) || [];
    for (let n of neighbors) {
      if (isCyclic(n)) return true;
    }

    recStack.delete(id);
    return false;
  }

  for (let t of TOPICS) {
    if (isCyclic(t.id)) return true;
  }
  return false;
}

if (hasCycle()) {
  console.error("❌ [GRAVE] Se detectó un BUCLE (Circle) infinito en los prerrequisitos.");
  errors++;
} else {
  console.log("✅ [Grafo DAG] 0 Ciclos detectados. Lógica topológica pura confirmada.");
}

// 3. Integridad de Referencias
TOPICS.forEach(t => {
  t.prerequisites.forEach(preId => {
    if (!TOPICS.find(tp => tp.id === preId)) {
      console.error(`❌ [Referencia Rota] ${t.id} requiere ${preId}, pero ${preId} no existe.`);
      errors++;
    }
  });
});

// 4. Cobertura de Vectores de Role
ROLES.forEach(role => {
  VALID_CATEGORIES.forEach(cat => {
    if (role.targetVector[cat] === undefined) {
      console.error(`❌ [Vector Incompleto] El cargo ${role.id} no tiene peso para la categoría ${cat}.`);
      errors++;
    }
  });
});

console.log("\n========================================");
if (errors === 0) {
  console.log("💎 AUDITORÍA MATEMÁTICA: 100% LIMPIA");
  console.log("Categorías:   OK");
  console.log("Ciclos:       NINGUNO");
  console.log("Referencias:  OK");
  console.log("Vectoress:    COMPLETOS");
} else {
  console.log(`❌ SE ENCONTRARON ${errors} ERRORES MATEMÁTICOS.`);
  process.exit(1);
}
