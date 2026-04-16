export async function getAiSynthesis(roleDetails, routeData) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'tu_nueva_clave_aqui' || apiKey === '') {
    throw new Error('API Key de Gemini no detectada. Por favor, añádela al archivo .env como VITE_GEMINI_API_KEY.');
  }

  const routeItemsString = routeData.map((t, idx) => 
    `- MÓDULO ${idx + 1}: ${t.title} (ID: ${t.id})`
  ).join('\n');

  // CREACIÓN DE HASH ÚNICO PARA CACHÉ SEMÁNTICA (Feature 2)
  // Concatenamos el rol y las rutas para generar un string base y lo codificamos muy simple (base64 o cadena simple).
  const cacheKey = `gemini_cache_${roleDetails.id}_${routeData.map(r => r.id).join('_')}`;
  
  const cachedResponse = sessionStorage.getItem(cacheKey);
  if (cachedResponse) {
    console.log("⚡ [Telemetry] Cache Hit: Devolviendo respuesta desde SessionStorage (0ms)");
    return {
      payload: JSON.parse(cachedResponse),
      telemetry: { source: 'cache' }
    };
  }

  const systemInstructions = `Eres el IA Neural Mentor de Kometa. Tu misión es transformar una lista de módulos de aprendizaje en un "Syllabus Detallado" de estudio de nivel ejecutivo.
Para cada módulo que te entregue el usuario, debes generar un "detailedSummary" con 1 o 2 párrafos de Resumen Ejecutivo. Usa saltos de línea (\\n\\n) si hay más de un párrafo.
Luego, genera exactamente 5 ítems de estudio específicos. Cada ítem debe ser un objeto JSON con un "title" (corto) y una "explanation" explicativa, táctica y profunda de 2 a 3 líneas.

ESTRUCTURA EXACTA DEL JSON DE SALIDA:
{
  "strategy": "Visión global rápida (2 líneas) sobre por qué esta ruta es poderosa.",
  "gapAnalysis": "Breve diagnóstico de 2-3 líneas sobre qué habilidades le faltan al perfil para llegar al siguiente nivel.",
  "modulesContent": [
    {
      "topicId": "ID_DEL_TEMA_PROPORCIONADO",
      "focus": "El objetivo principal de este módulo en 1 oración.",
      "items": [
        { "title": "Nombre del ítem 1", "explanation": "Explicación táctica de 2 a 3 líneas..." },
        { "title": "Nombre del ítem 2", "explanation": "Explicación táctica de 2 a 3 líneas..." }
      ],
      "detailedSummary": "Párrafo 1 de resumen ejecutivog.\\n\\nPárrafo 2 sobre integración."
    }
  ],
  "executiveChallenge": {
    "title": "Un título heroico",
    "description": "Un reto práctico que integre todos estos módulos."
  }
}`;

  const userPrompt = `Cargo: ${roleDetails.name}\nPerfil del Cargo: ${roleDetails.profile}\n\nRuta de Módulos Generada:\n${routeItemsString}\n\nInstrucción: Genera el JSON desglosando los ítems de estudio DENTRO de cada módulo. Sé ultra-específico según el cargo.`;

  // Usamos gemini-flash-latest para mayor estabilidad ante errores 503
  const urlPrimary = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  // Sin fallback a otro modelo (no hay cuota disponible en otros modelos)

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemInstructions }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: { response_mime_type: "application/json", temperature: 0.7 }
    })
  };

  try {
    const response = await fetch(urlPrimary, requestOptions);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Error ${response.status} en Gemini API.`);
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    
    // Guardamos en caché
    sessionStorage.setItem(cacheKey, resultText);

    return {
      payload: JSON.parse(resultText),
      telemetry: { source: 'api_primary' }
    };

  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
}
