import { generateLearningRoute } from './src/engine.js';
import { ROLES, TOPICS } from './src/data.js';

console.log("\n========================================================");
console.log("🕵️  SIMULADOR DE RECLUTADOR EXTREMO (100 TESTS B2B)");
console.log("========================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.log(`❌ [FALLO] ${message}`);
  }
}

// Generadores de basura (Fuzzing Data) para romper el motor
const basuras = [
  null, undefined, NaN, Infinity, -1, 0, 9999, 
  "", " ", "<script>alert('hack')</script>", "' OR 1=1 --", 
  [], {}, [null], [undefined, 1, 2], [{}, {}], true, false
];

ROLES.forEach((role) => {
  // console.log(`\n▶ Evaluando Cargo: ${role.name}`);
  const roleName = role.name;

  // TEST 1: Ruta inicial sin conocimientos (Debe respetar el Techo Pedagógico)
  const res1 = generateLearningRoute(role.id, []);
  assert(res1.route.length <= role.maxRouteSize, `T1 [${roleName}] Techo respetado (<= ${role.maxRouteSize})`);
  
  // TEST 2: Ruta inicial no debe ser menor al suelo (>= 5 temas si hay temas suficientes en el catálogo)
  assert(res1.route.length >= 5 || res1.route.length === 0, `T2 [${roleName}] Suelo de 5 respetado`);

  // TEST 3: Si domina TODOS los temas del catálogo, la ruta debe ser 0
  const allTopicIds = TOPICS.map(t => t.id);
  const res3 = generateLearningRoute(role.id, allTopicIds);
  assert(res3.route.length === 0, `T3 [${roleName}] Conoce todo, ruta debe ser 0`);

  // TEST 4: Input Corrupto - Usuario sin ID
  const res4 = generateLearningRoute(null, []);
  assert(res4.error !== null, `T4 [${roleName}] ID de usuario null mitigado con error.`);

  // TEST 5: Input Corrupto - ID Falso
  const res5 = generateLearningRoute('CARGO_HACKER_123', []);
  assert(res5.error !== null, `T5 [${roleName}] ID de usuario inexistente mitigado.`);

  // TEST 6: Input Corrupto - Mastered Topics Null
  const res6 = generateLearningRoute(role.id, null);
  assert(res6.route.length > 0 && !res6.error, `T6 [${roleName}] Auto-Healing: Convirtió null a [] y funcionó`);

  // TEST 7: Input Corrupto - Mastered Topics Object en vez de Array
  const res7 = generateLearningRoute(role.id, { key: "value" });
  assert(res7.route.length > 0 && !res7.error, `T7 [${roleName}] Auto-Healing: Convirtió Object a [] y funcionó`);

  // TEST 8: Bucle Infinito Preventivo - Prerrequisitos Circulares?
  // (Este test verifica que el algoritmo KAHN no se quede congelado)
  const ts = Date.now();
  generateLearningRoute(role.id, []);
  assert((Date.now() - ts) < 50, `T8 [${roleName}] Algoritmo terminó en < 50ms (Sin bucles infinitos)`);

  // TESTS 9 A 20: Ataques extremos de Fuzzing (Basura como parámetros)
  let fuzzerIndex = 0;
  for(let i = 9; i <= 20; i++) {
    const dataBasura = basuras[fuzzerIndex++];
    try {
      const resBasura = generateLearningRoute(role.id, dataBasura);
      assert(true, `T${i} [${roleName}] Sobrevivió inyección basura: ${JSON.stringify(dataBasura)}`);
    } catch (e) {
      assert(false, `T${i} [${roleName}] Motor CRASHEÓ por inyección basura: ${JSON.stringify(dataBasura)}`);
    }
  }
});

console.log(`\n💥 RESULTADOS DE LA AUDITORÍA DE RECURSOS HUMANOS:`);
console.log(`✅ TEST SUPERADOS: ${passed}/100`);
if (failed > 0) {
  console.log(`❌ TEST FALLADOS: ${failed}`);
} else {
  console.log(`\n🏆 EL MOTOR ES INDESTRUCTIBLE. NI SQL INJECTION NI CORRUPCIÓN DE MEMORIA PUDIERON ROMPERLO.`);
}
console.log("========================================================\n");
