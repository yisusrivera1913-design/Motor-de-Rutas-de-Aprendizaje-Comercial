# SKILL OFICIAL — Kometa Reto B: Motor de Rutas de Aprendizaje Comercial
> **⚠️ REGLA MAESTRA:** Este archivo es la única fuente de verdad. Extraído directamente  
> del PDF oficial de la prueba técnica. Toda propuesta de código o diseño DEBE pasar  
> primero por esta checklist antes de ejecutarse.

---

## 1. CONTEXTO DE NEGOCIO (Inmutable)
- **Empresa:** VentaMax S.A.S. — Tecnología B2B, Software de ventas para PyMEs  
- **Mercado:** Colombia, México, Perú · 150 empleados · Fuerza de ventas: 40 personas  
- **Problema real:** Estandarizar proceso de ventas y subir tasa de cierre del **18% → 30%**

---

## 2. TEMAS DE VENTAS — Fuente de Verdad Exacta
> ❌ NO agregar temas · ❌ NO cambiar nombres · ❌ NO cambiar niveles ni categorías

| Nivel | Categoría | Temas incluidos |
|---|---|---|
| `basico` | `fundamentos` | Qué es vender, tipos de clientes, comunicación efectiva, escucha activa |
| `basico` | `proceso_comercial` | Etapas del embudo, prospección básica, presentación del producto |
| `intermedio` | `tecnicas_venta` | SPIN Selling, venta consultiva, storytelling comercial |
| `intermedio` | `gestion` | CRM básico, pipeline, indicadores KPI |
| `avanzado` | `negociacion` | Manejo de objeciones, cierre de ventas, negociación Harvard |
| `avanzado` | `estrategia` | Account-based sales, forecasting, liderazgo comercial, ventas data-driven |

---

## 3. CARGOS DE VENTAMAX — Fuente de Verdad Exacta
> ❌ NO agregar cargos · ❌ NO cambiar nombres ni perfiles

| Cargo (exacto) | Edad | Experiencia | Perfil del cargo |
|---|---|---|---|
| `Asesor Comercial Jr.` | 22-27 | 0-1 año | Recién egresado, alta motivación, base técnica débil |
| `Asesor Comercial Sr.` | 28-35 | 3-6 años | Domina el proceso, necesita técnicas avanzadas |
| `Key Account Manager` | 32-40 | 5-10 años | Cuentas grandes, necesita estrategia y negociación |
| `Líder Comercial` | 35-45 | 8-15 años | Gestiona equipo, necesita liderazgo y forecasting |
| `Director de Ventas` | 40-55 | +15 años | Visión estratégica, poco tiempo disponible |

---

## 4. FUNCIONALIDADES OBLIGATORIAS (del PDF)
Antes de cualquier entrega, estas 5 funciones deben estar 100% operativas:

- [ ] **F1 — Algoritmo de cruce:** Cruzar temas + cargos basado en reglas o IA
- [ ] **F2 — Selector de cargo:** Interfaz donde el usuario elige su cargo y recibe su ruta
- [ ] **F3 — Visualización de ruta:** Lista ordenada, mapa o diagrama de progresión
- [ ] **F4 — Mínimo 5 temas por ruta:** Ordenados de básico → avanzado según perfil del cargo
- [ ] **F5 — Ajuste dinámico:** El sistema omite temas que el usuario indica que ya domina

---

## 5. CRITERIOS DE EVALUACIÓN (pesos del jurado)

| Criterio | Peso | Qué evalúan |
|---|---|---|
| Lógica de personalización de la ruta | **35%** | Ajuste REAL al perfil del cargo |
| Calidad y cobertura de los datos | **20%** | Temas completos y bien estructurados |
| Interfaz y visualización de la ruta | **20%** | Clara, intuitiva y motivadora |
| Calidad del código | **15%** | Mantenible y escalable |
| Demo funcional | **10%** | Flujo completo con mínimo 2 cargos |

> **💡 Regla de prioridad:** El 35% más pesado es la lógica. Nunca sacrificar la   
> exactitud del algoritmo por estética. Primero que funcione bien, luego que se vea bien.

---

## 6. ENTREGABLES OBLIGATORIOS

- [ ] **E1:** Repositorio Git con README completo (instrucciones para correr localmente)
- [ ] **E2:** Demo funcional desplegada **O** video de 3-5 minutos
- [ ] **E3:** `DECISIONS.md` — Documento de decisiones del algoritmo de cruce (máx. 1 página)

### Restricciones de entrega:
- ❌ No incluir API keys reales en el repositorio
- ❌ No entregas parciales ni extensiones de plazo
- ✅ README debe tener instrucciones de cómo obtener las claves de API necesarias

---

## 7. REGLAS DE DESARROLLO (para la IA / desarrollador)

### 7.1 Stack mínimo requerido (no hay restricción de stack en el PDF)
El PDF **NO especifica stack**. La elección actual (React + Vite + Node.js/Express + Groq) es válida siempre que cumpla los entregables. No cambiar a otro stack sin razón técnica justificada.

### 7.2 Algoritmo — Regla maestra
El algoritmo de cruce debe seguir esta lógica de 2 niveles:
1. **Nivel 1 (Reglas duras):** Filtrar temas según nivel de entrada del cargo. Excluir temas que el usuario marca como "ya dominados". Ordenar: básico → avanzado.
2. **Nivel 2 (IA Opcional):** Enriquecer con profundidad (introductorio/estándar/profundo), horas estimadas, y justificación pedagógica por cargo.

### 7.3 UI — Regla de calidad (20% del score)
- Interfaz debe ser **clara, intuitiva y motivadora** (textual exacto del PDF)
- Flujo mínimo obligatorio: **Pantalla 1** Selector de cargo → **Pantalla 2** Auditoría de temas dominados → **Pantalla 3** Visualización de la ruta generada
- La ruta debe mostrar **al menos 5 temas** ordenados de básico a avanzado

### 7.4 Código — Regla de calidad (15% del score)
- Mantenible y escalable
- Separación de responsabilidades (datos en `data/`, lógica en `services/`, UI en `components/`)
- No mezclar lógica de negocio con lógica de presentación

### 7.5 Datos — Regla de integridad (20% del score)
- Los 6 bloques de temas y los 5 cargos de las secciones 2 y 3 son **inmutables**
- Toda mejora (ej: subtemas, explicaciones prácticas) debe ir en campos **adicionales** del JSON, nunca reemplazando los campos base
- El campo `id` de cada tema debe ser estable y único (no cambia entre generaciones)
