export async function getAiSynthesis(roleDetails, routeData) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'tu_nueva_clave_aqui' || apiKey === '') {
    throw new Error('API Key de Gemini no detectada. Por favor, añádela al archivo .env como VITE_GEMINI_API_KEY.');
  }

  const routeItemsString = routeData.map((t, idx) => 
    `- MÓDULO ${idx + 1}: ${t.title} (ID: ${t.id})`
  ).join('\n');

  const systemInstructions = `Eres el IA Neural Mentor de Kometa. Tu misión es transformar una lista de módulos de aprendizaje en un "Syllabus Detallado" de estudio de nivel ejecutivo.
Para cada módulo que te entregue el usuario, debes generar un "detailedSummary" con 1 o 2 párrafos de Resumen Ejecutivo. Usa saltos de línea (\\n\\n) si hay más de un párrafo.
Luego, genera exactamente 5 ítems de estudio específicos. Cada ítem debe ser un objeto JSON con un "title" (corto) y una "explanation" explicativa, táctica y profunda de 2 a 3 líneas.

ESTRUCTURA EXACTA DEL JSON DE SALIDA:
{
  "strategy": "Visión global rápida (2 líneas) sobre por qué esta ruta es poderosa.",
  "modulesContent": [
    {
      "topicId": "ID_DEL_TEMA_PROPORCIONADO",
      "focus": "El objetivo principal de este módulo en 1 oración.",
      "items": [
        { "title": "Nombre del ítem 1", "explanation": "Explicación táctica de 2 a 3 líneas..." },
        { "title": "Nombre del ítem 2", "explanation": "Explicación táctica de 2 a 3 líneas..." },
        { "title": "Nombre del ítem 3", "explanation": "Explicación táctica de 2 a 3 líneas..." },
        { "title": "Nombre del ítem 4", "explanation": "Explicación táctica de 2 a 3 líneas..." },
        { "title": "Nombre del ítem 5", "explanation": "Explicación táctica de 2 a 3 líneas..." }
      ],
      "detailedSummary": "Párrafo 1 de resumen ejecutivo.\\n\\nPárrafo 2 sobre integración."
    }
  ],
  "executiveChallenge": {
    "title": "Un título heroico",
    "description": "Un reto práctico que integre todos estos módulos."
  }
}`;

  const userPrompt = `Cargo: ${roleDetails.name}\nPerfil del Cargo: ${roleDetails.profile}\n\nRuta de Módulos Generada:\n${routeItemsString}\n\nInstrucción: Genera el JSON desglosando los ítems de estudio DENTRO de cada módulo. Sé ultra-específico según el cargo.`;

  const url25 = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const urlFallback = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`;

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
    // Intento primario con Gemini 2.5 Flash
    let response = await fetch(url25, requestOptions);

    // Fallback: Si los servidores de 2.5 están saturados (503), intentamos con el entorno hiper-rápido de Gemini 3.1 Flash Lite
    if (response.status === 503) {
      console.warn("⚠️ Gemini 2.5 experimentando alta demanda (503). Activando puente seguro hacia Gemini 3.1 Flash Lite...");
      response = await fetch(urlFallback, requestOptions);
    }

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Error crítico en Gemini API.');
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    return JSON.parse(resultText);

  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
}
