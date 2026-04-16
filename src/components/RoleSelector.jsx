import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ChevronRight } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { ROLES } from '../data';

export function RoleSelector({ variants }) {
  const { selectedRole, setSelectedRole, nextStep } = useLearning();

  const handleKeyDown = (e, roleId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedRole(roleId);
    }
  };

  return (
    <motion.section 
      key="step1"
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="step-content"
    >
      <header>
        <h2 className="section-title">
          <GraduationCap size={28} className="text-gradient" aria-hidden="true" /> 
          Paso 1: Define tu Perfil Comercial
        </h2>
        <p className="step-description">Selecciona el cargo que mejor representa tu rol actual. El algoritmo calibrará la dificultad y relevancia de los temas automáticamente.</p>
      </header>
      
      <div className="role-grid" role="radiogroup" aria-label="Selección de Cargo">
        {ROLES.map((role, idx) => {
          const isActive = selectedRole === role.id;
          return (
            <motion.div 
              key={role.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`role-card ${isActive ? 'active' : ''}`}
              role="radio"
              aria-checked={isActive}
              tabIndex={0}
              onClick={() => setSelectedRole(role.id)}
              onKeyDown={(e) => handleKeyDown(e, role.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="role-card-header">
                <h3>{role.name}</h3>
                <span className="experience-tag">{role.experience} • {role.age} años</span>
              </div>
              <p>{role.profile}</p>
              {isActive && <motion.div layoutId="glow" className="selected-glow" aria-hidden="true" />}
            </motion.div>
          );
        })}
      </div>

      <div className="actions">
        <button 
          className="btn-primary" 
          onClick={nextStep} 
          id="next-to-step2"
          aria-label="Continuar a Auditoría de Conocimiento"
        >
          Continuar Auditoría <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </motion.section>
  );
}
