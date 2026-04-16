import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, AlertCircle, Award, Clock, ChevronLeft, TrendingUp, BookOpen, Zap, BrainCircuit, Loader2, AlertTriangle, Target, Lightbulb, Trophy, ShieldCheck } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { RouteNodeBadge } from './RouteNodeBadge';

/**
 * RouteVisualizer — Componente de presentación puro.
 * Nutre de datos desde el Contexto (Cero props anidadas).
 * Integración IA Generativa (Groq) con DASHBOARD NEURAL v4.
 */
export function RouteVisualizer({ variants }) {
  const {
    activeRoleDetails, learningPath, engineError, handleReset, prevStep,
    aiSynthesis, isAiLoading, aiError, generateAiMentorSpeech, isUsingRescue
  } = useLearning();

  const routeStats = useMemo(() => {
    if (!learningPath || learningPath.length === 0) return null;
    const byLevel = learningPath.reduce((acc, t) => {
      const safelvl = t.level?.toLowerCase() || 'basico';
      acc[safelvl] = (acc[safelvl] || 0) + 1;
      return acc;
    }, {});
    const avgROI = (learningPath.reduce((sum, t) => sum + parseFloat(t.impactROI || 0), 0) / learningPath.length).toFixed(1);
    return { byLevel, avgROI };
  }, [learningPath]);

  return (
    <motion.section 
      key="step3"
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="step-content"
    >
      <header className="route-page-header">
        <h2 className="section-title">
          <Map size={28} className="text-gradient" aria-hidden="true" />
          Ruta de Progresión: {activeRoleDetails?.name}
        </h2>
        <span className="route-badge-main" aria-live="polite">
          {learningPath?.length} Temas Recomendados
        </span>
      </header>
      
      {engineError ? (
        <div className="error-state" role="alert">
          <AlertCircle size={48} aria-hidden="true" />
          <h3>Fallo en el Algoritmo</h3>
          <p>{engineError}</p>
          <button className="btn-secondary" onClick={handleReset}>Reiniciar Configuración</button>
        </div>

      ) : learningPath?.length === 0 ? (
        <div className="empty-state" role="status">
          <Award size={64} className="text-gradient" aria-hidden="true" />
          <h3>¡Nivel de Experto Alcanzado!</h3>
          <p>Has marcado dominio total sobre todos los temas requeridos para {activeRoleDetails?.name}.</p>
          <button className="btn-primary" onClick={handleReset}>
            Volver a Empezar
          </button>
        </div>

      ) : (
        <article className="route-presentation" aria-label="Ruta de Aprendizaje Generada">

          <div className="route-meta-panel" aria-label="Perfil del Cargo">
            <div className="meta-pill">
              <Target size={14} className="pill-icon" />
              <div className="pill-content">
                <span className="pill-label">ENFOQUE</span>
                <span className="pill-value">{activeRoleDetails?.profile}</span>
              </div>
            </div>
            <div className="meta-pill">
              <Award size={14} className="pill-icon" />
              <div className="pill-content">
                <span className="pill-label">EXPERIENCIA</span>
                <span className="pill-value">{activeRoleDetails?.experience}</span>
              </div>
            </div>
            <div className="meta-pill">
              <BrainCircuit size={14} className="pill-icon" />
              <div className="pill-content">
                <span className="pill-label">EDAD</span>
                <span className="pill-value">{activeRoleDetails?.age} años</span>
              </div>
            </div>
          </div>

          {routeStats && (
            <div className="route-stats-panel" aria-label="Resumen de la ruta">

              <div className="stat-card">
                <TrendingUp size={18} className="stat-icon" aria-hidden="true" />
                <div className="stat-body">
                  <span className="stat-value">{routeStats.avgROI}</span>
                  <span className="stat-label">ROI Promedio</span>
                </div>
              </div>
              <div className="stat-card">
                <BookOpen size={18} className="stat-icon" aria-hidden="true" />
                <div className="stat-body">
                  <span className="stat-value">{learningPath.length}</span>
                  <span className="stat-label">Temas Clave</span>
                </div>
              </div>
              <div className="stat-card">
                <Zap size={18} className="stat-icon" aria-hidden="true" />
                <div className="stat-body">
                  <span className="stat-value">{routeStats.byLevel['avanzado'] || 0}</span>
                  <span className="stat-label">Temas Avanzados</span>
                </div>
              </div>
            </div>
          )}

          <div className="route-timeline" role="list">
            {learningPath?.map((topic, index) => {
              const aiModuleData = aiSynthesis?.modulesContent?.find(m => m.topicId === topic.id);
              return (
                <RouteNodeBadge 
                  key={topic.id} 
                  topic={topic} 
                  index={index} 
                  aiContent={aiModuleData}
                  isRescue={isUsingRescue}
                />
              );
            })}
          </div>

          {/* ————————————————————————————————
              SECCIÓN IA NEURAL v4 (DASHBOARD)
          ——————————————————————————————————*/}
          <div className="ai-mentor-section" aria-label="Mentor Neural de IA">

            {!aiSynthesis && !isAiLoading && (
              <motion.button
                className="btn-ai-mentor premium-glow"
                onClick={generateAiMentorSpeech}
                disabled={isAiLoading}
                aria-label="Generar análisis de ruta con IA Generativa"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <BrainCircuit size={20} aria-hidden="true" />
                Generar ítems por módulo con IA (Opcional)
                <span className="ai-badge-premium">Gemini 2.5</span>
              </motion.button>
            )}

            <AnimatePresence mode="wait">
              {isAiLoading && (
                <motion.div
                  key="loading"
                  className="ai-loading-state"
                  role="status"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="ai-loading-pulse-container">
                    <div className="ai-pulse-ring"></div>
                    <BrainCircuit size={32} className="ai-pulse-icon" aria-hidden="true" />
                  </div>
                  <div className="ai-loading-text-group">
                    <p className="ai-loading-headline">Conectando con Neural Engine...</p>
                    <p className="ai-loading-sub">Generando sub-ítems estratégicos de estudio.</p>
                  </div>
                  <div className="ai-skeleton-lines">
                    <div className="skeleton-line" style={{ width: '80%' }}></div>
                    <div className="skeleton-line" style={{ width: '60%' }}></div>
                    <div className="skeleton-line" style={{ width: '90%' }}></div>
                  </div>
                </motion.div>
              )}

              {isUsingRescue && (
                <motion.div
                  key="rescue"
                  className="ai-rescue-alert"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <ShieldCheck size={20} className="text-success" />
                  <div className="rescue-text">
                    <p><strong>Escudo Determinista Activado</strong></p>
                    <p>La IA experimenta latencia. El motor local ha inyectado datos de respaldo para asegurar tu experiencia.</p>
                  </div>
                </motion.div>
              )}

              {aiError && !isUsingRescue && (
                <motion.div
                  key="error"
                  className="ai-error-state"
                  role="alert"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <AlertTriangle size={24} aria-hidden="true" />
                  <p>Interrupción en el enlace Neural: {aiError}</p>
                  <button className="btn-secondary btn-sm" onClick={generateAiMentorSpeech}>Reintentar Enlace</button>
                </motion.div>
              )}

              {aiSynthesis && !isAiLoading && (
                <motion.div
                  key="dashboard"
                  className="ai-neural-dashboard"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <header className="dashboard-header">
                    <div className="header-icon"><BrainCircuit size={24} /></div>
                    <div className="header-text">
                      <h3>Diagnóstico Estratégico Neural</h3>
                      <p>Sintetizado para {activeRoleDetails?.name}</p>
                    </div>
                    <div className={`header-tag source-${aiSynthesis.source}`}>
                      {aiSynthesis.source === 'api_primary' && "🤖 Gemini 2.0 (LIVE)"}
                      {aiSynthesis.source === 'fallback'    && "⚡ Gemini 1.5 (BACKUP)"}
                      {aiSynthesis.source === 'cache'       && "🚀 CACHE HIT (0ms)"}
                      {aiSynthesis.source === 'rescue'      && "🛡️ MOTOR DETERMINISTA"}
                    </div>
                  </header>

                  <div className="dashboard-grid">
                    {/* Sección 1: Visión de Carrera */}
                    <motion.section 
                      className="dashboard-card main-vision"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="card-lbl"><Target size={16} /> Visión de Carrera</div>
                      <p>{aiSynthesis.strategy}</p>
                    </motion.section>

                    {/* Sección 2: Gap Analysis (Brechas) */}
                    <motion.section 
                      className="dashboard-card gap-analysis"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="card-lbl"><Lightbulb size={16} /> Diagnóstico de Brechas</div>
                      <p>{aiSynthesis.gapAnalysis || "Análisis de brechas optimizado basado en el perfil de cargo seleccionado."}</p>
                    </motion.section>

                    {/* Sección 3: Reto Ejecutivo Final */}
                    <motion.section 
                      className="dashboard-card executive-challenge"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="card-lbl"><Trophy size={16} /> El Reto Ejecutivo de VentaMax</div>
                      <h4>{aiSynthesis.executiveChallenge?.title}</h4>
                      <p>{aiSynthesis.executiveChallenge?.description}</p>
                    </motion.section>
                  </div>

                  <footer className="dashboard-footer">
                    <button className="btn-link" onClick={generateAiMentorSpeech}>
                      ↺ Regenerar Diagnóstico Neural
                    </button>
                  </footer>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </article>
      )}

      <footer className="step-actions-footer">
        <button 
          className="btn-secondary" 
          onClick={prevStep}
          aria-label="Regresar a Auditoría"
        >
          <ChevronLeft size={18} aria-hidden="true" /> Ajustar Auditoría
        </button>
        <div className="footer-links">
          <button className="btn-link" onClick={handleReset} aria-label="Reiniciar toda la evaluación">
            Reiniciar todo
          </button>
        </div>
      </footer>
    </motion.section>
  );
}
