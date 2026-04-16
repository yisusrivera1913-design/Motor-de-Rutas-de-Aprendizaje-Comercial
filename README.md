# Kometa Learning Engine — Motor Dinámico de Rutas

**Reto B: Motor de Rutas de Aprendizaje Comercial**  
Desarrollado para **VentaMax S.A.S.**  
*Candidato: Jesús*

Un motor de recomendación pedagógica que utiliza **Kahn's Topological Sort** y **Greedy ROI Selection** (Sin necesidad de agentes IA externos) para generar rutas de aprendizaje empresarial deterministas, escalables e infalibles.

---

## 🚀 Demo Local y Setup

Este proyecto se construyó bajo arquitectura **Zero-Backend** (Todo el procesamiento de grafos ocurre en caliente en el cliente) garantizando privacidad B2B y latencia menor a 2 milisegundos.

### Instalación Inmediata

1.  **Clona o extrae el proyecto.**
2.  **Instala los módulos:**
    ```bash
    npm install
    ```
3.  **Lanza el motor:**
    ```bash
    npm run dev
    ```

> ⚙️ **Stack:** React 18, Vite, Framer Motion, Nativo CSS (Variables HSL/Rem Architecture). Sin frameworks UI inflados.

---

## 🧠 Arquitectura Escalable (Por qué no hay IA)

El requerimiento era generar rutas perfectas basadas en prerrequisitos (Topología) e Impacto Comercial (ROI). Para lograr **100% de predictibilidad y evitar alucinaciones LLM**, se optó por un algoritmo estricto de **Teoría de Grafos**:

*   **Listas de Adyacencia:** Extraídas dinámicamente de `data.js`.
*   **In-Degree Tracking:** Un tema avanzado (ej: *Cierre de Ventas*) tiene `in-degree` > 0 hasta que el usuario domine sus pre-requisitos (ej: *Comunicación Asertiva*).
*   **Greedy Fallback:** En caso de empate topológico, el nodo de mayor ROI calibrado al vector del rol actual es inyectado primero.

(Para más detalles técnicos y Big-O Notation, referirse a `DECISIONS.md`).

---

## ♿ Excelencia Técnica: Accesibilidad & Performance

*   **A11y:** Navegable al 100% a través del teclado y VoiceOver. `tabIndex=0`, `onKeyDown` y estructuras ARIA aplicadas exhaustivamente (Pruébalo usando solo la tecla Tab).
*   **Optimizaciones:** Implementación dura de `React.memo`, uso de contexto puro para mitigar *Prop Drilling* y renderizado atómico.
*   **Sistemas Fluidos:** Migración total a medidas relativas (`rem`) para asegurar que la app respete el tamaño base del Sistema Operativo de usuarios invidentes o con visión reducida.

---

## 🛡️ Auditoría y Stress Testing (Coverage)

Se inyectaron 2 bancos de prueba para forzar el quiebre de la aplicación. ¡Ninguno lo logró!

1.  **Engine Stress Test:** `node ./stress-test.js`
    Mete datos sucios (`null`, array vacío, arrays mixtos) comprobando los fallbacks (*Auto-Healing*). Todas pasan.
2.  **Enterprise Architecture Audit (Las 50 Reglas):** `node ./auditor.js`
    100% libre de variables mutables genéricas (`var`), tipado inseguro (`==`), abusos de renderizado y strings mágicos de base de datos.
