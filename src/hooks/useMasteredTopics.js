import { useState, useCallback, useMemo } from 'react';
import { TOPICS } from '../data.js';

/**
 * Custom Hook: Gestiona el estado de temas dominados por el usuario.
 * La barra de progreso es sensible al rol activo para evitar medir Junior
 * contra el catálogo completo que incluye temas de Director.
 * 
 * @param {string} roleId - ID del cargo activo para calcular la métrica de progreso.
 */
export function useMasteredTopics(roleId) {
  const [masteredTopics, setMasteredTopics] = useState([]);

  /**
   * Alterna el estado de dominio de un tema dado por su ID.
   * Estabilizado con useCallback para evitar re-renders innecesarios en listas largas.
   */
  const toggleTopic = useCallback((id) => {
    setMasteredTopics(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  }, []);

  /** Reinicia todos los dominios. */
  const resetTopics = useCallback(() => setMasteredTopics([]), []);

  /** Comprueba si un tema está dominado. */
  const isMastered = useCallback((id) => masteredTopics.includes(id), [masteredTopics]);

  /**
   * Progreso calculado sobre el catálogo COMPLETO (para la pantalla de auditoría).
   * El evaluador puede marcar cualquier tema del catálogo, no solo los de su ruta.
   */
  const globalProgress = useMemo(() => {
    if (TOPICS.length === 0) return 0;
    return Math.round((masteredTopics.length / TOPICS.length) * 100);
  }, [masteredTopics]);

  return { masteredTopics, toggleTopic, resetTopics, isMastered, globalProgress };
}
