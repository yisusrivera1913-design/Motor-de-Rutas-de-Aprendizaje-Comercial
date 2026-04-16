import { generateLearningRoute } from './src/engine.js';
import { ROLES, TOPICS } from './src/data.js';

console.log("==================================================");
console.log("🧪 SUITE DE PRUEBAS LIMITES (STRESS TESTING) - KOMETA");
console.log("==================================================\n");

const runTest = (testNumber, title, role, mastered) => {
    console.log(`\n--- TEST #${testNumber}: ${title} ---`);
    console.log(`👤 Rol: ${role} | 🧠 Dominados ingresados: [${mastered.length > 0 ? mastered.join(', ') : 'Ninguno'}]`);
    
    try {
        const { route, error } = generateLearningRoute(role, mastered);
        
        if (error) {
            console.log(`❌ ERROR CONTROLADO: ${error}`);
        } else if (route.length === 0) {
            console.log(`⚠️ ALERTA: Ruta Vacía (Dominio Total Alcanzado).`);
        } else {
            console.log(`✅ RESULTADO: Generó ${route.length} temas.`);
            route.forEach((t, i) => {
                console.log(`   ${i+1}. [${t.level.toUpperCase()}] ${t.title} (Categoría: ${t.category} | ROI: ${t.impactROI})`);
            });
        }
    } catch (e) {
        console.log(`💥 CRASH CRÍTICO DEL MOTOR: ${e.message}`);
    }
}

// 1. EL NOVATO HONESTO
// Un Jr sin conocimientos. Debería recibir puros fundamentos estrictos.
runTest(1, "El Novato Honesto (Jr desde cero)", 'asesor_jr', []);

// 2. EL JR "SABELOTODO" (FALSO EXPERTO)
// Un Jr que jura en la UI que ya domina TODOS los temas del catálogo. Algoritmo debería devolver 0 temas.
const allTopics = TOPICS.map(t => t.id);
runTest(2, "El Jr Sabelotodo (Miente que sabe todo)", 'asesor_jr', allTopics);

// 3. EL SALTO CUÁNTICO (CAOS GRÁFICO)
// Un Jr marca que sabe "Cierre de Ventas" (Avanzado) pero no marcó "Qué es vender". 
// El DAG debe obligarlo a ver fundamentos ignorando su delirio de grandeza porque el ROI de básicos para un Jr es superior.
runTest(3, "El Salto Cuántico (Conocimiento fragmentado irracional)", 'asesor_jr', ['nego_2']);

// 4. INYECCIÓN DE DATOS BASURA (Hacking Attempt)
// Mandando cursos inventados o scripts. El sistema no debe crashear, debe ignorarlos.
runTest(4, "Inyección de Cursos Fantasmas (Seguridad)", 'asesor_sr', ['fund_1', 'curso_hacker', '<script>alert()</script>', undefined]);

// 5. EL KAM VACÍO (Verificación de Asunción Base)
// Un Key Account Manager no marca NADA dominado. Como es perfil Senior, 
// el sistema debe INFERIR que ya sabe "Fundamentos" (Asunción Base = 0% weight) y darle Avanzados.
runTest(5, "El KAM Vacío (Verificación de Asunción Base de nivel Senior)", 'kam', []);

// 6. EL DIRECTOR DEGRADADO (Fallbacks)
// Un Director de Ventas que ya sabe TODOS los temas de "Estrategia" y "Negociación". 
// Como siempre debemos darle mínimo 5 cursos, el algoritmo (Relaxation) debería bajar al nivel Intermedio para rellenar la cuota con temas secundarios como "Gestión".
runTest(6, "El Director Degradado (Relleno Funcional Hacia Abajo)", 'director_ventas', ['nego_1', 'nego_2', 'nego_3', 'stra_1', 'stra_2', 'stra_3', 'stra_4']);

// 7. EL ASESOR SR INCOMPLETO (Huecos en malla)
// Domina la etapa 1 del embudo, pero no sabe TIPOS DE CLIENTES. El Grafo debe encontrar el hueco básico primero.
runTest(7, "El Asesor Sr con Huecos (Parchando conocimientos)", 'asesor_sr', ['proc_1', 'tech_1']);

// 8. CARGO NULL O INDEFINIDO
// Qué pasa si la UI se rompe y manda null al engine logic?
runTest(8, "Cargo Null o Undefined", null, []);

// 9. EL DIRECTOR AMNÉSICO (Contradicción Matemática)
// Director que marca explícitamente "Fundamentos" como NO dominados (vacío). 
// Al ser Director, el vector es 0. ¿El algoritmo lo obliga a verlos porque están vacíos o aplica la asunción base rígida por su rol?
runTest(9, "El Director con base débil pero rol alto", 'director_ventas', []);

// 10. EL COMPLETISTA A UN PASO
// Le falta solo 1 curso para terminar el mundo de Kometa. ¿Devuelve los 5 por relleno o devuelve 1 porque no hay más temas físicos para rellenar? (Validación de rotura de bucle).
const almostAll = TOPICS.map(t => t.id).filter(id => id !== 'stra_4');
runTest(10, "El Completista A Un Paso (Casi todo dominado)", 'director_ventas', almostAll);

console.log("\n==================================================");
console.log("FIN DE LA SUITE DE STRESS TESTING");
console.log("==================================================");
