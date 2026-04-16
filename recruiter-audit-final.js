import { generateLearningRoute } from './src/engine.js';
import { ROLES, TOPICS } from './src/data.js';

/**
 * RECRUITER AUDIT FINAL — 100 CASOS DE PRUEBA (20 POR CARGO)
 * El "Stamp of Approval" para el Jefe y el Reclutador.
 */

let totalTests = 0;
let totalPassed = 0;
let logs = [];

console.log("🔥 INICIANDO AUDITORÍA DE ESTRÉS FINAL: 100 CASOS...");

ROLES.forEach(role => {
    for (let i = 1; i <= 20; i++) {
        totalTests++;
        
        // Simular un reclutador que marca temas al azar (Fuzzing)
        const randomMastery = TOPICS
            .filter(() => Math.random() > 0.7)
            .map(t => t.id);

        const { route, error } = generateLearningRoute(role.id, randomMastery);

        let testPassed = true;
        let reasons = [];

        // Validar que no hay error
        if (error) { testPassed = false; reasons.push(`Error: ${error}`); }
        
        // Validar Min 5 temas (si el catálogo lo permite)
        if (route.length < 5) {
            const possibleCount = TOPICS.length - randomMastery.length;
            if (possibleCount >= 5) {
                testPassed = false;
                reasons.push(`Ruta corta (${route.length} temas) habiendo disponibilidad.`);
            }
        }

        // Validar Seniority Shield
        if (role.targetLevel >= 3) {
            const containsBasics = route.some(t => t.numLevel === 1);
            if (containsBasics) {
                testPassed = false;
                reasons.push(`Director/Líder recibió temas BÁSICOS.`);
            }
        }

        // Validar Tope Ergónomico
        if (route.length > role.maxRouteSize) {
            testPassed = false;
            reasons.push(`Superó el maxRouteSize (${route.length} > ${role.maxRouteSize})`);
        }

        if (testPassed) {
            totalPassed++;
        } else {
            logs.push(`[FALLO] ${role.name} - Test ${i}: ${reasons.join(' | ')}`);
        }
    }
});

console.log("\n==================================================");
console.log(`REPORT FINAL DE INDESTRUCTIBILIDAD (100 CASOS)`);
console.log(`Tests Ejecutados: ${totalTests}`);
console.log(`Éxito Total:     ${totalPassed} / 100 ✅`);
console.log("==================================================");

if (totalPassed === 100) {
    console.log("\n💎 EL CÓDIGO ES PERFECTO. APTO PARA PRODUCCIÓN.");
    process.exit(0);
} else {
    console.log("\n⚠️ SE ENCONTRARON INCONSISTENCIAS:");
    logs.forEach(l => console.log(l));
    process.exit(1);
}
