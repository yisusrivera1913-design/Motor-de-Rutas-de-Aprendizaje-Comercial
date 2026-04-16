# 🚀 Kometa Learning Engine — Motor Dinámico de Rutas

**Reto B: Motor de Rutas de Aprendizaje Comercial**  
Desarrollado para **VentaMax S.A.S.**  
*Candidato: Jesús Rivera*

Una aplicación de E-learning empresarial que procesa el estado de conocimiento de un vendedor (Junior a VIP) y le genera una **Ruta de Estudio Dinámica y Personalizada** validada estrictamente por requerimientos comerciales y reglas de prerrequisitos (Kahn's Sort Algorithm). 

Además, este proyecto incluye integración nativa con la **API de Google Gemini 2.5 Flash** para potenciar el análisis de brechas formativas ("Syllabus Ejecutivo").

---

## 💻 Instrucciones para Ejecución Local

Para correr el proyecto en tu máquina y replicar el entorno de producción, sigue estos pasos:

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

El proyecto utiliza Google Gemini para la generación de Syllabus expandidos, sin embargo, **NUNCA** debes subir claves reales al código fuente público.

1. **Obtener la Llave Gratuita:** Ingresa a [Google AI Studio](https://aistudio.google.com/app/apikey) y presiona "Create API Key".
2. **Configuración Local:** 
   - En la raíz del proyecto encontrarás un archivo de plantilla llamado `.env.example`.
   - Renombra el archivo y quítale la extensión `.example`, de modo que el archivo quede bautizado únicamente como `.env`.
   - Dentro del archivo, reemplaza la directiva de seguridad por tu llave real:
   ```env
   # .env
   VITE_GEMINI_API_KEY=ACA_PEGAS_TU_KEY_REAL_DE_GOOGLE
   ```
*(Nota: El archivo `.env` está automáticamente ignorado por el sistema en el archivo `.gitignore` para protección de la infraestructura comercial).*

### 4. Compilación y Arranque Vía Servidor de Desarrollo
```bash
npm run dev
```

Abre tu navegador en la URL que indique la consola (usualmente `http://localhost:5173`).

---

## 🧠 Solución Técnica: Profile-First Architecture

El motor fue reforzado para cumplir al **100% con los lineamientos oficiales extraídos del PDF** de VentaMax.

1. **Seniority Shield (Regla Inquebrantable):** El algoritmo "apantalla" y prohíbe que ejecutivos o gerentes cursen temas de "Fundamentos". Un KAM irá en ruta directa a módulos avanzados (Account-based sales, Negociación Harvard).
2. **Cero Inventos:** La data de entrenamiento (Silla de `data.js`) fue limpiada exhaustiva y quirúrgicamente. Todos los nombres de módulos son fidedignos al catálogo provisto de VentaMax de 20 temas exactos. 
3. **Enterprise UI/UX (Zero Tailwind):** El diseño fue creado de cero mediante un framework CSS nativo (Design Tokens en `index.css`) bajo arquitectura "Glassmorphism" garantizando un porte ejecutivo.
4. **Resiliencia API:** Si los servidores gratuitos de Google (`Gemini 2.5 Flash`) arrojan código `503 Error` por altísima demanda, la aplicación no colisiona. En su lugar, el sistema detecta el estrangulamiento y usa un "Back-end Subrutine Fallback" enviando la solicitud al ultra rápido y ligero `Gemini 3.1 Flash Lite-Preview` (`15 RPM`) de manera absolutamente abstracta y silenciosa para el usuario.
