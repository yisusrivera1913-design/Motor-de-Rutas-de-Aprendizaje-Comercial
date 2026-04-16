import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Layers, CheckCircle2 } from 'lucide-react';

// eslint-disable-next-line react-refresh/only-export-components
export const UI_DICTIONARY = {
  levels: {
    basico: 'basico',
    intermedio: 'intermedio',
    avanzado: 'avanzado'
  }
};

/**
 * RouteNodeBadge — v5 con Inteligencia de Módulo Profundo
 * Ahora puede renderizar sub-ítems generados por la IA de Groq.
 */
export const RouteNodeBadge = memo(({ topic, index, aiContent, isRescue }) => {
  const [isAiExpanded, setIsAiExpanded] = useState(false);
  const safeLevelClass = UI_DICTIONARY.levels[topic.level?.toLowerCase()] || 'basico';

  return (
    <motion.div 
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.12 }}
      className={`route-item-modern ${aiContent ? 'has-ai-content' : ''}`}
      role="listitem"
    >
      <div className="node-indicator" data-level={safeLevelClass} aria-hidden="true">
        <div className="node-line" />
        <div className="node-circle">{index + 1}</div>
      </div>

      <div className="node-card-modern" tabIndex={0}>
        <header className="node-card-header">
          <div>
            <span className={`node-level-tag ${safeLevelClass}`}>
              {topic.level.charAt(0).toUpperCase() + topic.level.slice(1)}
            </span>
            <h3>{topic.title}</h3>
          </div>
          <div className="roi-tag" aria-label={`ROI: ${topic.impactROI}`}>
            <ArrowUpRight size={14} aria-hidden="true" />
            ROI: {topic.impactROI}
          </div>
        </header>
        
        <div className="node-card-body">
          <p className="node-reasoning">{topic.reasoning}</p>
          
          {aiContent && (
            <button 
              className={`ai-toggle-btn ${isAiExpanded ? 'active' : ''} ${isRescue ? 'rescue-mode' : ''}`}
              onClick={() => setIsAiExpanded(!isAiExpanded)}
              aria-expanded={isAiExpanded}
            >
              <Layers size={14} />
              {isAiExpanded 
                ? 'Ocultar Detalle' 
                : isRescue 
                  ? '🛡️ Ver Plan de Estudio'
                  : '✨ Ver Profundización Neural (IA)'
              }
            </button>
          )}
          
          {/* SECCIÓN IA: Sub-ítems de estudio detallados */}
          <AnimatePresence>
            {aiContent && isAiExpanded && (
              <motion.div 
                className="ai-module-deepdive"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.4 }}
              >
                <div className="ai-deep-label">Resumen Ejecutivo Neural</div>
                
                {aiContent.detailedSummary && (
                  <div className="ai-detailed-summary">
                    {aiContent.detailedSummary.split('\n').filter(p => p.trim() !== '').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                )}

                <div className="ai-deep-label" style={{ marginTop: '1.5rem' }}>Programa de Estudio ({aiContent.items?.length || 5} Módulos)</div>
                <ul className="ai-items-list">
                  {aiContent.items.map((item, i) => {
                    const title = typeof item === 'string' ? item : item.title;
                    const explanation = typeof item === 'string' ? '' : item.explanation;
                    
                    return (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                        className="ai-item-complex"
                      >
                        <CheckCircle2 size={16} className="ai-item-icon" />
                        <div className="ai-item-content">
                          <span className="ai-item-title">{title}</span>
                          {explanation && <p className="ai-item-explanation">{explanation}</p>}
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="node-card-footer">
          <div className="node-meta-group">
            <span className="node-meta-item" aria-label={`Profundidad: ${topic.depth}`}>
              <Layers size={12} aria-hidden="true" /> {topic.depth}
            </span>
          </div>
          <span className="category-label">
            {topic.category.replace('_', ' ')}
          </span>
        </footer>
      </div>
    </motion.div>
  );
});

RouteNodeBadge.displayName = 'RouteNodeBadge';
