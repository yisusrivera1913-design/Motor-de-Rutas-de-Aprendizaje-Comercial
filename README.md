# 🚀 Kometa Learning Engine — Motor Dinámico de Rutas

**Reto B: Motor de Rutas de Aprendizaje Comercial**  
Desarrollado para **VentaMax S.A.S.**  
*Candidato: Jesús Rivera*

Para este reto técnico, desarrollé una aplicación de E-learning empresarial que procesa el perfil y cargo de un vendedor (desde Junior hasta Director) y le genera una **Ruta de Estudio Dinámica y Personalizada**. La lógica computacional la estructuré validando estrictamente los requerimientos comerciales y reglas de prerrequisitos mediante el algoritmo de Topología de Grafos (*Kahn's Sort Algorithm*).

Adicionalmente, integré de forma nativa la **API de Google Gemini 2.5 Flash** para crear un módulo "Inteligente" opcional capaz de potenciar el análisis de brechas formativas ("Syllabus Ejecutivo") para cada nodo de la ruta.

---

## 💻 Instrucciones para Ejecución Local

Para correr mi proyecto en tu máquina y replicar el entorno de producción, sigue estos pasos:

### 1. Clonación del Repositorio
```bash
git clone https://github.com/yisusrivera1913-design/Motor-de-Rutas-de-Aprendizaje-Comercial.git
cd Motor-de-Rutas-de-Aprendizaje-Comercial
```

### 2. Instalación de Dependencias
Asegúrate de contar con Node.js (v18+) instalado en tu sistema.
```bash
npm install
```

### 3. Configuración de API Keys (Neural Engine)

Decidí utilizar el cerebro de Google Gemini para la generación de resúmenes dinámicos. Sin embargo, aplicando buenas prácticas de ciberseguridad, **NUNCA** subo claves reales a repositorios públicos.

1. **Obtener la Llave Gratuita:** Ingresa a [Google AI Studio](https://aistudio.google.com/app/apikey) y presiona "Create API Key".
2. **Configuración Local:** 
   - En la raíz del proyecto dejé preparado un archivo de plantilla llamado `.env.example`.
   - Renombra el archivo y elimínale la extensión `.example`, de modo que quede bautizado únicamente como `.env`.
   - Dentro del archivo, reemplaza este campo por tu llave real:
   ```env
   # .env
   VITE_GEMINI_API_KEY=ACA_PEGAS_TU_KEY_REAL_DE_GOOGLE
   ```
*(Nota de seguridad: Configuré el `.gitignore` para bloquear automáticamente cualquier rastreo del archivo `.env`).*

### 4. Compilación y Arranque Vía Servidor Web
```bash
npm run dev
```

Abre tu navegador en la URL que indique la consola (usualmente `http://localhost:5173`).

---

## 🧠 Solución Técnica y Toma de Decisiones

Me aseguré de que el motor cumpla de forma matemática con el **100% de los lineamientos oficiales del PDF** entregado por VentaMax:

1. **Seniority Shield (Regla Inquebrantable):** Programé un "blindaje" en el algoritmo que prohíbe explícitamente que ejecutivos de alto rango cursen temas de "Fundamentos". Un KAM tiene su ruta bloqueada a niveles de introducción e irá directo a módulos avanzados.
2. **Cero Inventos Computacionales:** Restringí severamente los inputs de la base de datos local temporal. Los nombres y flujos de los módulos son 100% fidedignos al catálogo provisto de 20 temas exactos, sin "rellenos".
3. **Enterprise UI/UX (Vanilla CSS):** Maqueté la interfaz desde cero mediante un ecosistema CSS nativo propio (Design Tokens en `index.css`) bajo arquitectura "Glassmorphism", garantizando un porte ejecutivo empresarial en la web sin inflar el diseño con frameworks CSS externos (como Tailwind o Bootstrap).
4. **Resiliencia API (Sistema Fallback):** Construí un manejador de contingencias en la capa de red. Si los servidores gratuitos de Google (`Gemini 2.5 Flash`) se bloquean temporalmente por exceso de demanda (Error `503`), el código lo captura y redirecciona silenciosamente toda la computación hacia un micro-modelo ultrarrápido de rescate (`Gemini 3.1 Flash Lite-Preview`), garantizando así que la aplicación jamás colisione frente al usuario.
