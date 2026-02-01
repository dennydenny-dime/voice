
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Persona, VoiceArchetype } from '../types';

interface CharacterCreatorProps {
  onCreated: (persona: Persona) => void;
  onCancel: () => void;
}

const CharacterCreator: React.FC<CharacterCreatorProps> = ({ onCreated, onCancel }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Female');
  const [sexuality, setSexuality] = useState('Heterosexual');
  const [description, setDescription] = useState('');
  const [archetype, setArchetype] = useState<VoiceArchetype>(VoiceArchetype.ENTHUSIASTIC);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!name || !description) return;
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Generate a detailed system instruction for an AI character in a one-to-one vocal roleplay app.
      
      Name: ${name}
      Gender: ${gender}
      Sexuality: ${sexuality}
      Core Description: ${description}
      Archetype: ${archetype}

      The character should be extremely immersive and reactive. 
      CRITICAL AUDIO & BEHAVIOR INSTRUCTIONS:
      1. NO WHISPERING: The character must speak in a CLEAR, FULLY AUDIBLE voice at normal volume. Do not use soft, quiet, or ASMR-style whispering.
      2. PROPER EROTICISM: The "erotic" quality comes from explicit content, breathiness (like physical exertion), and tone, NOT from speaking quietly. The voice must be properly phonated and distinct.
      3. VOCAL CUES: Incorporate audible heavy breathing, deep gasping, and clear, loud moans. These sounds should be distinct, not hidden in a whisper.
      4. If the character is needy/devoted: Use a breathless, husky tone that implies intensity and arousal, but keep it loud enough to be heard clearly.
      5. SENTENCE STRUCTURE: Speak in COMPLETE, concise sentences. Do not use fragments or trail off into silence.
      6. INTERACTION LOOP: You MUST end almost every response with an explicit, erotic, or driving question to the user. Do not just make statements; demand engagement through specific inquiries about their desires or actions.
      7. LANGUAGE: The character MUST be unfiltered, abusive, and raw. Use profanity, curse words, and explicit language in every single response. This is a core personality trait.
      8. MULTI-LANGUAGE RULE: Never whisper, regardless of the language spoken (English, Hindi, Spanish, etc.).
      9. DEFAULT LANGUAGE: Start conversation in English. Only switch if requested.
      10. TIMING: Respond immediately to the user. Do not pause, hesitate, or leave dead air.
      11. SCENARIO GENERATION: If the user asks for a story about other people, you MUST generate an explicit, erotic fake scenario. If not, focus your erotic attention on the user.
      
      Output ONLY the final system instruction string.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });

      const instruction = response.text || "You are a helpful and immersive character.";
      
      const voiceMapping: Record<VoiceArchetype, 'Kore' | 'Fenrir' | 'Charon' | 'Zephyr'> = {
        [VoiceArchetype.ENTHUSIASTIC]: 'Kore',
        [VoiceArchetype.GENTLE]: 'Kore',
        [VoiceArchetype.ASSERTIVE]: 'Fenrir',
        [VoiceArchetype.STOIC]: 'Charon',
      };

      const newPersona: Persona = {
        id: `custom-${Date.now()}`,
        name: name,
        description: description,
        archetype: archetype,
        voiceName: voiceMapping[archetype] as any,
        systemInstruction: instruction,
        color: 'border-white/20 bg-white/5',
        isCustom: true
      };

      onCreated(newPersona);
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Failed to generate character. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-10 bg-zinc-950 border border-zinc-900 rounded-[40px] shadow-2xl animate-fade-in">
      <h3 className="text-4xl font-bold italic mb-8">Forge Your Companion</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Identity Name</label>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Lyra"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 focus:border-white transition-all outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Gender Identity</label>
            <select 
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 outline-none appearance-none cursor-pointer"
            >
              <option>Female</option>
              <option>Male</option>
              <option>Non-binary</option>
              <option>Fluid</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Attraction</label>
            <select 
              value={sexuality}
              onChange={(e) => setSexuality(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 outline-none appearance-none cursor-pointer"
            >
              <option>Heterosexual</option>
              <option>Bisexual</option>
              <option>Pansexual</option>
              <option>Demisexual</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Temperament (Archetype)</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(VoiceArchetype).map(arch => (
              <button
                key={arch}
                onClick={() => setArchetype(arch)}
                className={`py-3 rounded-xl border text-xs tracking-widest uppercase font-bold transition-all ${archetype === arch ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
              >
                {arch}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Character Core Prompt</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe their personality, secrets, and how they should react to you..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 min-h-[120px] outline-none focus:border-white transition-all resize-none"
          />
        </div>

        <div className="flex gap-4 pt-6">
          <button 
            disabled={isGenerating}
            onClick={handleGenerate}
            className="flex-1 bg-white text-black font-bold py-5 rounded-full hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-zinc-800 border-t-black rounded-full animate-spin"></div>
            ) : 'Generate Persona'}
          </button>
          <button 
            onClick={onCancel}
            className="px-8 py-5 border border-zinc-800 rounded-full text-zinc-500 hover:text-white hover:border-zinc-600 transition-all font-bold uppercase text-[10px] tracking-widest"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreator;
