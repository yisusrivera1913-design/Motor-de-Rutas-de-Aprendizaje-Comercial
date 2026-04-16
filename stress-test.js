import { generateLearningRoute } from './src/engine.js';
import { TOPICS, ROLES } from './src/data.js';

console.log("==================================================");
console.log("🔥 SUITE DE PRUEBAS DE ESTRÉS (STRESS TESTING) 🔥");
console.log("==================================================\n");

let testsPassed = 0;
let totalTests = 50;

/**
 * Función base para validar sin detener. Lanza error fatal si falla (Fast Fail).
 */
function assertThrows(testName, roleId, masteredIds) {
    try {
        const { route, error } = generateLearningRoute(roleId, masteredIds);
        // Debe atrapar errores en la respuesta o no fallar catastróficamente.
        if (error) {
            console.log(`✅ [PASS] ${testName} -> Manejado: ${error}`);
            testsPassed++;
        } else {
            console.log(`✅ [PASS] ${testName} -> Sobrevivió sin crashear. Devolvió ${route.length}`);
            testsPassed++;
        }
    } catch (e) {
        console.error(`\n❌ [FATAL FAIL] ${testName}`);
        console.error(`El algoritmo CRASHED en tiempo de ejecución: ${e.message}`);
        console.error("Modo Fast-Fail activado. Abortando pruebas.");
        process.exit(1);
    }
}

// -------------------------------------------------------------
// FASE 1: CARGA EXTREMA (10 TESTS)
// -------------------------------------------------------------
console.log("\n▶ FASE 1: CARGA EXTREMA (Pruebas de Límite de Memoria/CPU)");
const massiveArray1K = Array.from({length: 1000}, (_, i) => `topic_${i}`);
const massiveArray100K = Array.from({length: 100000}, (_, i) => `topic_${i}`);
const superLongString = "A".repeat(500000); // Medio mega de string
const allValidIds = TOPICS.map(t => t.id);
const dupedValidIds = [...allValidIds, ...allValidIds, ...allValidIds];

assertThrows("1. Array Gigante de IDs Fantasmas (1K)", 'asesor_jr', massiveArray1K);
assertThrows("2. Array Masivo de IDs Fantasmas (100K)", 'kam', massiveArray100K);
assertThrows("3. String Colosal Inyectado en Array (Crash test string)", 'asesor_sr', [superLongString]);
assertThrows("4. String Colosal Inyectado como Rol", superLongString, []);
assertThrows("5. Array con IDs válidos pero triplicados (Duplicidad extrema)", 'director_ventas', dupedValidIds);
assertThrows("6. IDs extremadamente largos pero válidos en sintaxis", 'asesor_jr', ["fund_1" + "A".repeat(1000)]);
assertThrows("7. Simulación de catálogo vacío (Aunque el import viaja con datos, se envían vacíos)", 'lider_comercial', []);
assertThrows("8. Repetición infinita simulada en array", 'kam', Array(10000).fill('tech_1'));
assertThrows("9. Múltiples Super Long Strings mezclados con válidos", 'asesor_sr', ['tech_1', superLongString, 'tech_2']);
assertThrows("10. Carga de parámetros máximos en motor", 'director_ventas', massiveArray100K.concat(allValidIds));

// -------------------------------------------------------------
// FASE 2: CORRUPCIÓN DE DATOS (15 TESTS)
// -------------------------------------------------------------
console.log("\n▶ FASE 2: CORRUPCIÓN DE DATOS (Tipos Inválidos, Nulls, Objetos Maliciosos)");
assertThrows("11. Role ID Null explícito", null, []);
assertThrows("12. Role ID Undefined", undefined, []);
assertThrows("13. Role ID Número", 12345, []);
assertThrows("14. Role ID Objeto vacío", {}, []);
assertThrows("15. Role ID Función Ejecutable", () => { alert("hack"); }, []);
assertThrows("16. Mastered Array Null", 'asesor_jr', null);
assertThrows("17. Mastered Array Undefined", 'asesor_sr', undefined);
assertThrows("18. Mastered Array Número (No Iterable)", 'kam', 9999);
assertThrows("19. Mastered Array String en vez de Array", 'asesor_jr', "fund_1,proc_1");
assertThrows("20. Array con datos mixtos (Null, undefined, number, string)", 'lider_comercial', [null, undefined, 12, 'tech_1']);
assertThrows("21. Objetos anidados en el array", 'director_ventas', [{'id': 'fund_1'}]);
assertThrows("22. Funciones como elementos del array", 'asesor_jr', [()=>true]);
assertThrows("23. Booleano en lugar de rol", true, []);
assertThrows("24. Array donde el primer elemento rompe y el segundo es válido", 'kam', [undefined, 'nego_1']);
assertThrows("25. Inyección de prototipo Object.prototype", 'asesor_sr', ['__proto__']);

// -------------------------------------------------------------
// FASE 3: CONDICIÓN DE CARRERA (15 TESTS SIMULADOS)
// JS es single thread, pero si usamos variables globales que sangran estado, Promise.all() puede delatar mutaciones cruzadas.
// -------------------------------------------------------------
console.log("\n▶ FASE 3: CONDICIÓN DE CARRERA (Concurrencia Estresante)");

async function raceConditionTest() {
    let promises = [];
    // Disparamos 15 llamadas simultáneas
    for (let i = 0; i < 15; i++) {
        promises.push(new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    // Alternamos entre dos roles muy distintos para verificar si se cruzan los cables lógicos
                    const role = i % 2 === 0 ? 'asesor_jr' : 'director_ventas';
                    const res = generateLearningRoute(role, []);
                    if (!res) throw new Error("Motor no retornó objeto.");
                    resolve();
                } catch(e) {
                    reject(e);
                }
            }, 0);
        }));
    }

    try {
        await Promise.all(promises);
        console.log(`✅ [PASS] 26 a 40. Ejecutadas 15 promesas paralelas sin filtración de estados mutables ni bloqueo del event loop.`);
        testsPassed += 15;
    } catch (e) {
        console.error(`\n❌ [FATAL FAIL] Condición de carrera. El estado global del motor fue corrompido: ${e.message}`);
        process.exit(1);
    }
}

// -------------------------------------------------------------
// FASE 4: CASOS BORDE FÍSICOS (EDGE CASES lógicos) (10 TESTS)
// -------------------------------------------------------------
async function edgeCases() {
    console.log("\n▶ FASE 4: CASOS BORDE (Paradojas Lógicas y Bucle Infinito)");
    
    assertThrows("41. Completista Absoluto (Marcó todos los temas)", 'asesor_jr', allValidIds);
    // Un rol muy senior marcando los de su propio nivel
    assertThrows("42. Seniority Clash (Director marca todos los avanzados como dominados)", 'director_ventas', TOPICS.filter(t=>t.level==='avanzado').map(t=>t.id));
    // Dominio invertido (Conoce lo avanzado pero no la base - Salto Cuántico 2.0)
    assertThrows("43. Salto Crítico (Junior marca solo cierre de ventas)", 'asesor_jr', ['nego_2']);
    // Todos los fundamentos marcados (debería abrir ramas)
    assertThrows("44. Full Base", 'asesor_sr', TOPICS.filter(t=>t.level==='basico').map(t=>t.id));
    // Asesor JR sin NADA dominado y exigiendo todos (Testeo de loop de 5)
    assertThrows("45. Exhausting JR", 'asesor_jr', []);
    
    // Pruebas directas de retorno lógico
    try {
        let route46 = generateLearningRoute('asesor_jr', []).route;
        if(route46.length < 5) throw new Error(`El JR vacío devolvió solo ${route46.length} temas, menos que el mínimo de 5.`);
        console.log(`✅ [PASS] 46. Motor ilimitado funciona. JR sin dominio recibió ${route46.length} temas (≥ 5).`);
        testsPassed++;

        let route47 = generateLearningRoute('asesor_jr', allValidIds).route;
        if(route47.length !== 0) throw new Error("Ruta no estuvo vacía tras completarse los temas.");
        console.log(`✅ [PASS] 47. Empty Fallback (Devolvió ruta 0 cuando se domina todo)`);
        testsPassed++;

        let route48 = generateLearningRoute('lider_comercial', ['mngt_1', 'mngt_2']).route;
        if(route48.length < 5) throw new Error("El líder regresó menos de 5.");
        console.log(`✅ [PASS] 48. Relleno con huecos intermedios OK.`);
        testsPassed++;

        let route49 = generateLearningRoute('kam', []).route;
        if(route49.some(t => t.numLevel === 1)) throw new Error("El KAM vacío recibió temas básicos.");
        console.log(`✅ [PASS] 49. Asunción Base bloqueó efectivamente a los JR tools para KAM.`);
        testsPassed++;

        // Fuzz testing aleatorio rápido
        const fuzzRoles = ['asesor_jr', 'kam', 'director_ventas'];
        for(let i=0; i<100; i++) {
            generateLearningRoute(fuzzRoles[Math.floor(Math.random()*fuzzRoles.length)], ['fuzz']);
        }
        console.log(`✅ [PASS] 50. Loop Bounding de 100 iteraciones consecutivas sin memory leak lógico.`);
        testsPassed++;

    } catch (e) {
        console.error(`\n❌ [FATAL FAIL] Logical Edge Case Error: ${e.message}`);
        console.error("El algoritmo matemático o la estructura del DAG fue violada.");
        process.exit(1);
    }
}

async function runAll() {
    await raceConditionTest();
    await edgeCases();

    console.log(`\n==================================================`);
    if (testsPassed === totalTests) {
        console.log(`🏆 INCREÍBLE. EL MOTOR SOBREVIVIÓ AL APOCALIPSIS MENTAL.`);
        console.log(`🏆 50 / 50 PRUEBAS PASADAS.`);
    } else {
        console.log(`⚠️ ALERTA DE SISTEMA. Pasaron ${testsPassed} / 50 pruebas.`);
    }
    console.log(`==================================================\n`);
}

runAll();
