import React, { createContext, useState, useMemo, useCallback, useContext } from 'react';
import { ROLES, TOPICS } from '../data';
import { generateLearningRoute } from '../engine';
import { getAiSynthesis } from '../services/geminiService';

// eslint-disable-next-line react-refresh/only-export-components
export const LearningContext = createContext();

export function LearningProvider({ children }) {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(ROLES[0].id);
  const [masteredTopics, setMasteredTopics] = useState([]);
  
  // Estado asincrónico local
  const [isGenerating, setIsGenerating] = useState(false);

  // Estados opcionales de IA (Integración Groq)
  const [aiSynthesis, setAiSynthesis] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const toggleTopic = useCallback((id) => {
    setMasteredTopics(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  }, []);

  const resetTopics = useCallback(() => {
    setMasteredTopics([]);
    setAiSynthesis(null);
    setAiError(null);
  }, []);

  const isMastered = useCallback((id) => masteredTopics.includes(id), [masteredTopics]);

  const globalProgress = useMemo(() => {
    if (TOPICS.length === 0) return 0;
    return Math.round((masteredTopics.length / TOPICS.length) * 100);
  }, [masteredTopics]);

  const activeRoleDetails = useMemo(
    () => ROLES.find(r => r.id === selectedRole),
    [selectedRole]
  );

  const { route: learningPath, error: engineError } = useMemo(
    () => generateLearningRoute(selectedRole, masteredTopics),
    [selectedRole, masteredTopics]
  );

  // Funciones de navegación (limpias, sin prop drilling)
  const nextStep = useCallback(() => {
    // Si vamos del paso 2 al 3, simulamos carga para dar percepción de que AI está operando (Falso Retraso)
    if (step === 2) {
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        setStep(3);
      }, 600); 
    } else {
      setStep(s => Math.min(s + 1, 3));
    }
  }, [step]);
  
  const prevStep = useCallback(() => setStep(s => Math.max(s - 1, 1)), []);

  const handleReset = useCallback(() => {
    resetTopics();
    setStep(1);
  }, [resetTopics]);

  const generateAiMentorSpeech = useCallback(async () => {
    if (!activeRoleDetails || !learningPath) return;
    
    setIsAiLoading(true);
    setAiError(null);
    try {
      // Pasamos masteredTopics para que la IA haga el Gap Analysis
      const response = await getAiSynthesis(activeRoleDetails, learningPath, masteredTopics);
      setAiSynthesis(response); // Ahora guardamos un objeto JSON, no un string
    } catch (err) {
      setAiError(err.message);
    } finally {
      setIsAiLoading(false);
    }
  }, [activeRoleDetails, learningPath, masteredTopics]);

  const value = {
    step,
    nextStep,
    prevStep,
    selectedRole,
    setSelectedRole,
    activeRoleDetails,
    masteredTopics,
    toggleTopic,
    isMastered,
    globalProgress,
    learningPath,
    engineError,
    handleReset,
    isGenerating,
    aiSynthesis,
    isAiLoading,
    aiError,
    generateAiMentorSpeech
  };

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning debe ser usado dentro de un LearningProvider');
  }
  return context;
}
