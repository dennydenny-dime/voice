export enum VoiceArchetype {
  ASSERTIVE = 'Assertive',
  GENTLE = 'Gentle',
  STOIC = 'Stoic',
  ENTHUSIASTIC = 'Enthusiastic'
}

/**
 * Defines available ambient background sounds for immersion.
 */
export type AmbientType = 'dark-drone' | 'soft-rain' | 'heartbeat' | 'clinical-hum';

export interface Persona {
  id: string;
  name: string;
  description: string;
  archetype: VoiceArchetype;
  voiceName: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
  systemInstruction: string;
  color: string;
  isCustom?: boolean;
  memory?: string;
}

export interface TranscriptionItem {
  type: 'user' | 'model';
  text: string;
}