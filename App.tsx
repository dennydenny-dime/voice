import React, { useState, useCallback, useEffect } from 'react';
import { Persona } from './types';
import { PERSONAS } from './constants';
import PersonaSelector from './components/PersonaSelector';
import LiveChat from './components/LiveChat';
import Header from './components/Header';
import CharacterCreator from './components/CharacterCreator';

const App: React.FC = () => {
  const [customPersonas, setCustomPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Load custom personas from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('custom_personas_memory');
    if (saved) {
      try {
        setCustomPersonas(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load custom personas", e);
      }
    }
  }, []);

  // Save custom personas to local storage
  const saveCustomPersonas = (updated: Persona[]) => {
    setCustomPersonas(updated);
    localStorage.setItem('custom_personas_memory', JSON.stringify(updated));
  };

  const handleStartSession = useCallback((persona: Persona) => {
    setSelectedPersona(persona);
    setIsSessionActive(true);
    setIsCreating(false);
  }, []);

  const handleEndSession = useCallback(() => {
    setIsSessionActive(false);
    setSelectedPersona(null);
  }, []);

  const handleUpdateMemory = useCallback((personaId: string, newMemory: string) => {
    const updated = customPersonas.map(p => 
      p.id === personaId ? { ...p, memory: newMemory } : p
    );
    saveCustomPersonas(updated);
    
    // Also update selected persona if it's the one active
    if (selectedPersona?.id === personaId) {
      setSelectedPersona(prev => prev ? { ...prev, memory: newMemory } : null);
    }
  }, [customPersonas, selectedPersona]);

  const handleCreatePersona = useCallback((persona: Persona) => {
    const updated = [...customPersonas, persona];
    saveCustomPersonas(updated);
    handleStartSession(persona);
  }, [customPersonas, handleStartSession]);

  const handleBack = useCallback(() => {
    if (isSessionActive) {
      handleEndSession();
    } else if (isCreating) {
      setIsCreating(false);
    }
  }, [isSessionActive, isCreating, handleEndSession]);

  const allPersonas = [...PERSONAS, ...customPersonas];

  return (
    <div className="flex flex-col min-h-screen bg-black text-zinc-100 font-sans selection:bg-indigo-500/30">
      <Header onBack={(isSessionActive || isCreating) ? handleBack : undefined} />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        {!isSessionActive && !isCreating && (
          <div className="animate-fade-in">
            <div className="mb-16 text-center">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 italic tracking-tight text-white">
                Vocal Intensity <span className="text-zinc-500 font-light not-italic">Sandbox</span>
              </h2>
              <p className="text-zinc-400 text-xl max-w-2xl mx-auto leading-relaxed mb-10">
                Connect one-to-one with advanced vocal personas. Now with evolved cognitive memory.
              </p>
              
              <button 
                onClick={() => setIsCreating(true)}
                className="group relative inline-flex items-center gap-4 px-10 py-5 bg-zinc-900 border border-zinc-800 rounded-full hover:border-white transition-all hover:bg-zinc-800"
              >
                <span className="text-xs uppercase tracking-[0.2em] font-bold">Generate Custom Entity</span>
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </div>
              </button>
            </div>
            <PersonaSelector personas={allPersonas} onSelect={handleStartSession} />
          </div>
        )}

        {isCreating && !isSessionActive && (
          <CharacterCreator 
            onCreated={handleCreatePersona} 
            onCancel={() => setIsCreating(false)} 
          />
        )}

        {isSessionActive && selectedPersona && (
          <LiveChat 
            persona={selectedPersona} 
            onEnd={handleEndSession}
            onUpdateMemory={handleUpdateMemory}
          />
        )}
      </main>

      <footer className="py-8 border-t border-zinc-900 text-center text-zinc-600 text-sm tracking-widest uppercase">
        Vocal Synthesis &bull; Cognitive Memory &bull; Live API
      </footer>
    </div>
  );
};

export default App;