import React from 'react';
import { Persona } from '../types';

interface PersonaSelectorProps {
  personas: Persona[];
  onSelect: (persona: Persona) => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ personas, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {personas.map((persona) => (
        <button
          key={persona.id}
          onClick={() => onSelect(persona)}
          className={`text-left p-10 rounded-[40px] border border-zinc-900 transition-all duration-500 hover:border-zinc-700 hover:bg-zinc-900/40 group relative overflow-hidden active:scale-[0.98]`}
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-3xl font-bold italic text-white group-hover:text-zinc-100">{persona.name}</h3>
                {persona.memory && (
                  <span className="text-[9px] uppercase tracking-widest text-blue-400 mt-1 block font-bold">
                    Memory Evolved
                  </span>
                )}
              </div>
              <span className="px-4 py-1.5 bg-zinc-900 text-zinc-500 text-[10px] tracking-widest uppercase border border-zinc-800 rounded-full">
                {persona.archetype}
              </span>
            </div>
            <p className="text-zinc-500 text-lg mb-10 leading-relaxed font-light group-hover:text-zinc-300 transition-colors">
              {persona.description}
            </p>
            <div className="flex items-center text-xs tracking-widest uppercase text-white font-semibold opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
              Initiate Voice Link
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </div>
          <div className={`absolute -bottom-10 -right-10 w-48 h-48 opacity-10 blur-3xl rounded-full transition-all group-hover:opacity-20 ${
            persona.id === 'domineering' ? 'bg-red-500' : 
            (persona.id === 'vulnerable' || persona.id === 'submissive') ? 'bg-indigo-500' : 
            persona.id === 'devoted' ? 'bg-pink-500' : 
            'bg-zinc-500'
          }`}></div>
        </button>
      ))}
    </div>
  );
};

export default PersonaSelector;