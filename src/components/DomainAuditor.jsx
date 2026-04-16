import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Award, ChevronLeft, Target, Loader2 } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { TOPICS } from '../data';
import { UI_DICTIONARY } from './RouteNodeBadge'; // Reutilizamos diccionario de seguridad

export function DomainAuditor({ variants }) {
  const { 
    isMastered, toggleTopic, globalProgress, 
    nextStep, prevStep, isGenerating 
  } = useLearning();

  const handleKeyDown = (e, topicId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTopic(topicId);
    }
  };

  return (
    <motion.section 
      key="step2"
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="step-content"
    >
      <header>
        <h2 className="section-title">
          <CheckCircle2 size={28} className="text-gradient" aria-hidden="true" /> 
          Paso 2: Auditoría de Conocimientos
        </h2>
        <p className="step-description">Marca los temas que dominas con maestría. Optimizaremos tu ruta eliminando redundancias.</p>
      </header>

      <div className="progress-card" role="region" aria-label="Progreso general del catálogo">
        <div className="progress-header">
          <div className="progress-info">
            <Award size={20} className="text-gradient" aria-hidden="true" />
            <span>Nivel de Dominio Acreditado (Catálogo Global)</span>
          </div>
          <span className="progress-percentage">{globalProgress}%</span>
        </div>
        <div className="progress-bar-container" aria-hidden="true">
          <motion.div 
            className="progress-fill" 
            initial={{ width: 0 }}
            animate={{ width: `${globalProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
      
      <div className="topics-grid-large" role="group" aria-label="Lista de temas a evaluar">
        {TOPICS.map((topic, idx) => {
          const mastered = isMastered(topic.id);
          const safeLevelClass = UI_DICTIONARY.levels[topic.level?.toLowerCase()] || 'basico';
          
          return (
            <motion.div 
              key={topic.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.02 }}
              className={`topic-card ${mastered ? 'selected' : ''}`}
              role="checkbox"
              aria-checked={mastered}
              tabIndex={0}
              onClick={() => toggleTopic(topic.id)}
              onKeyDown={(e) => handleKeyDown(e, topic.id)}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            >
              <div aria-hidden="true" className={`topic-checkbox ${mastered ? 'checked' : ''}`}>
                <AnimatePresence>
                  {mastered && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <CheckCircle2 size={16} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="topic-info">
                <h4>{topic.title}</h4>
                <span className={`badge-small ${safeLevelClass}`}>{topic.level}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="actions">
        <button 
          className="btn-secondary" 
          onClick={prevStep}
          aria-label="Volver a Perfil"
          disabled={isGenerating}
        >
          <ChevronLeft size={18} aria-hidden="true" /> Perfil
        </button>
        <button 
          className="btn-primary" 
          onClick={nextStep} 
          id="generate-route"
          aria-label={isGenerating ? "Generando ruta matemáticamente" : "Generar ruta de aprendizaje"}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>Calculando DAG <Loader2 size={18} className="animate-spin" aria-hidden="true" /></>
          ) : (
            <>Ver Mi Ruta de Éxito <Target size={18} aria-hidden="true" /></>
          )}
        </button>
      </div>
    </motion.section>
  );
}
