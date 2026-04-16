import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RoleSelector } from './components/RoleSelector';
import { DomainAuditor } from './components/DomainAuditor';
import { RouteVisualizer } from './components/RouteVisualizer';
import { LearningProvider, useLearning } from './context/LearningContext';

/** Variantes de animación compartidas por todos los screens. */
const pageVariants = {
  initial: { opacity: 0, x: 20 },
  enter:   { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -20 },
};

/**
 * AppContent recibe el Context automáticamente.
 * El orquestador ya no pasa ni 1 sola prop.
 */
function AppContent() {
  const { step } = useLearning();

  return (
    <div className="app-container">
      {/* HEADER SEMÁNTICO */}
      <header className="header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-gradient">Kometa</span> Rutas de Aprendizaje
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Motor de personalización comercial para VentaMax S.A.S.
        </motion.p>

        {/* NAVEGACIÓN DE PASOS */}
        <nav className="step-indicator" aria-label="Progreso de configuración">
          {['Cargo', 'Dominio', 'Ruta'].map((label, idx) => {
            const num = idx + 1;
            return (
              <React.Fragment key={label}>
                {idx > 0 && (
                  <div
                    className={`step-line ${step >= num ? 'active' : ''}`}
                    aria-hidden="true"
                  />
                )}
                <div
                  className={`step ${step >= num ? 'active' : ''}`}
                  aria-current={step === num ? 'step' : undefined}
                >
                  <span>{num}</span>
                  <label>{label}</label>
                </div>
              </React.Fragment>
            );
          })}
        </nav>
      </header>

      {/* CONTENIDO PRINCIPAL — Inyección de Componentes limpios sin Props */}
      <main className="glass-panel main-content">
        <AnimatePresence mode="wait">
          {step === 1 && <RoleSelector key="s1" variants={pageVariants} />}
          {step === 2 && <DomainAuditor key="s2" variants={pageVariants} />}
          {step === 3 && <RouteVisualizer key="s3" variants={pageVariants} />}
        </AnimatePresence>
      </main>

      <footer className="global-footer">
        <p>© 2026 VentaMax S.A.S. • Motor de Rutas de Aprendizaje • Jesús - Kometa AI Reto B</p>
      </footer>
    </div>
  );
}

/** Wrapper de Root para inyectar el Provider global */
export default function App() {
  return (
    <LearningProvider>
      <AppContent />
    </LearningProvider>
  );
}
