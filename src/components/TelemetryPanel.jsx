import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearning } from '../context/LearningContext';

export function TelemetryPanel() {
  const { telemetryLogs } = useLearning();
  const [isOpen, setIsOpen] = useState(false);

  // Botón ultra discreto para abrir la telemetría
  if (!isOpen) {
    return (
      <button 
        className="telemetry-trigger-btn"
        onClick={() => setIsOpen(true)}
        title="Ver métricas del motor de inferencia"
      >
        <span>⚡ Admin Telemetry</span>
      </button>
    );
  }

  // Cálculos rápidos de % para demostración
  const totalCalls = telemetryLogs.cacheHits + telemetryLogs.apiCalls + telemetryLogs.fallbacks + telemetryLogs.engineRescues;
  const savings = totalCalls > 0 ? Math.round(((telemetryLogs.cacheHits + telemetryLogs.engineRescues) / totalCalls) * 100) : 0;

  return (
    <motion.div 
      className="telemetry-panel glass-panel"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="telemetry-header">
        <h4><span className="icon-pulse">🔴</span> Engine Observability</h4>
        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
      </div>

      <div className="telemetry-metrics">
        <div className="metric-box" title="Ahorro de API por caché local">
          <span className="metric-label">Cache Hits</span>
          <span className="metric-value success">{telemetryLogs.cacheHits}</span>
        </div>
        <div className="metric-box" title="Peticiones exitosas a Google Gemini">
          <span className="metric-label">API Primary (IA)</span>
          <span className="metric-value primary">{telemetryLogs.apiCalls}</span>
        </div>
        <div className="metric-box" title="Recuperación por alta demanda (Fallback)">
          <span className="metric-label">API Fallbacks</span>
          <span className="metric-value warning">{telemetryLogs.fallbacks}</span>
        </div>
        <div className="metric-box resaltar" title="Rescate por motor determinista ante fallo de red total">
          <span className="metric-label">Engine Rescues 🛡️</span>
          <span className="metric-value rescue">{telemetryLogs.engineRescues}</span>
        </div>
      </div>

      <div className="telemetry-footer">
        <p>Resiliencia del Sistema: <strong>{savings}%</strong></p>
      </div>
    </motion.div>
  );
}
