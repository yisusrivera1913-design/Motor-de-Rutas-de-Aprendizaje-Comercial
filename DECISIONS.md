# Decisiones Técnicas — Motor de Rutas de Aprendizaje Comercial

**Proyecto:** VentaMax S.A.S. — Kometa Reto B | **Candidato:** Jesús | **Fecha:** Abril 2026

---

## 1. Algoritmo de Cruce: Kahn's Topological Sort + Greedy ROI

**Decisión:** Se implementó el algoritmo de Kahn para ordenación topológica sobre un Grafo Acíclico Dirigido (DAG), combinado con selección voraz por ROI en cada paso.

**Flujo del algoritmo (O(V+E)):**
1. Construye una **Lista de Adyacencia** e **In-Degree** solo sobre temas no dominados.
2. Cola de Kahn: extrae nodos con `in-degree = 0` (prerrequisitos satisfechos).
3. En cada paso elige el de **mayor ROI ponderado** → `roiBase × vectorCargo × penalidad_nivel`.
4. "Aprueba" el nodo: actualiza el grafo, desbloqueando sus dependientes.
5. Aplica un **Techo Pedagógico por cargo** (`maxRouteSize`) para no saturar al usuario.
6. Garantiza **mínimo 5 temas** (Regla F4 del PDF) mediante Fallback de Cobertura.
7. Ordena la presentación final: Básico → Avanzado.

**Por qué Kahn vs fuerza bruta:** La versión anterior usaba un `while + filter` anidado O(N²). Con Kahn, la complejidad es O(V+E) — donde V son los temas y E las relaciones de prerrequisito. Escala correctamente si el catálogo crece de 20 a 2000 temas.

---

## 2. Personalización: Vectores de Perfil por Cargo

Cada cargo define un `targetVector` (mapa de categoría → peso 0.0 a 1.0). El motor multiplica el `roiBase` del tema por el peso del cargo en esa categoría. Esto garantiza que "Negociación Harvard" tenga ROI alto para KAM (peso 1.0) y ROI nulo para Asesor Jr. (peso 0.0), eliminándolo de su ruta automaticamente.

---

## 3. Arquitectura Frontend: Zero-Backend, Zero-IA

**Stack:** React 18 + Vite + Framer Motion + CSS nativo (sistema de variables).

- **Sin backend ni LLM:** Todo el cálculo del grafo ocurre en el cliente en <2ms. La "IA" es matemática determinista — predecible, auditable y sin costo de API.
- **SRP estricto:** `engine.js` (lógica) / `data.js` (datos) / `hooks/` (estado) / `components/` (UI) son capas totalmente independientes.
- **Robustez:** El motor valida tipos de entrada y aplica auto-healing (inputs no iterables → array vacío), validado con una suite de 50 stress-tests con Fast-Fail.
