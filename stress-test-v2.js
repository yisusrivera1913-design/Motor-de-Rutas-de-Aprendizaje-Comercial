import { generateLearningRoute } from './src/engine.js';
import { ROLES, TOPICS } from './src/data.js';

/**
 * SUITE DE STRESS TEST v6 — PURE LOGIC VALIDATION
 * Objetivo: Validar 50 casos de uso (10 por cargo) y asegurar 0% de incoherencias.
 */

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  logs: []
};

function assert(condition, message) {
  results.total++;
  if (condition) {
    results.passed++;
  } else {
    results.failed++;
    results.logs.push(`[FALLO] ${message}`);
  }
}

console.log("🚀 Iniciando Suite de 50 Stress Tests (Pure Logic v6)...");

ROLES.forEach(role => {
  console.log(`\n--- Probando Cargo: ${role.name} ---`);
  
  for (let i = 1; i <= 10; i++) {
    // Simular diferentes estados de "Maestría" para estresar el grafo
    let mastered = [];
    if (i > 1) {
        // En los tests 2-10, añadimos temas aleatorios como ya dominados
        mastered = TOPICS.slice(0, i * 2).map(t => t.id);
    }

    const { route, error } = generateLearningRoute(role.id, mastered);
    
    // Invariante 1: No debe haber errores de motor
    assert(!error, `Test ${i}: El motor no debe retornar error para ${role.id}.`);
    
    // Invariante 2: Longitud mínima de 5 (Regla F4)
    assert(route.length >= 5 || route.length === TOPICS.filter(t => !mastered.includes(t.id)).length, 
           `Test ${i}: Ruta debe tener al menos 5 temas (obtenidos: ${route.length}).`);

    // Invariante 3: Escudo de Seniority (Lógica Pura)
    if (role.targetLevel >= 3) {
        const hasBasics = route.some(t => t.numLevel === 1);
        assert(!hasBasics, `Test ${i}: Director/Líder NUNCA debe recibir temas de Nivel 1 Basic.`);
    }

    // Invariante 4: Orden Topológico (Básico -> Avanzado)
    let isOrdered = true;
    for (let j = 0; j < route.length - 1; j++) {
        if (route[j].numLevel > route[j+1].numLevel) {
            isOrdered = false;
            break;
        }
    }
    assert(isOrdered, `Test ${i}: La ruta debe estar ordenada por nivel (F4).`);
  }
});

console.log("\n========================================");
console.log(`REPORT FINAL DE AUDITORÍA`);
console.log(`Total Pruebas: ${results.total}`);
console.log(`Pasadas:       ${results.passed} ✅`);
console.log(`Fallidas:      ${results.failed} ❌`);
console.log("========================================");

if (results.failed > 0) {
  console.log("\nDETALLE DE ERRORES:");
  results.logs.forEach(err => console.log(err));
  process.exit(1);
} else {
  console.log("\n💎 LÓGICA PURA MATEMÁTICA CONFIRMADA AL 100%");
  process.exit(0);
}
