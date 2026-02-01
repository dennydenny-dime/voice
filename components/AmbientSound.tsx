import React, { useEffect, useRef } from 'react';
import { AmbientType } from '../types';

interface AmbientSoundProps {
  type: AmbientType;
  volume?: number;
}

const AmbientSound: React.FC<AmbientSoundProps> = ({ type, volume = 0.15 }) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = audioCtx;
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 2);
    masterGain.connect(audioCtx.destination);
    masterGainRef.current = masterGain;

    const createNoise = (filterType: BiquadFilterType, freq: number) => {
      const bufferSize = 2 * audioCtx.sampleRate;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = audioCtx.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.setValueAtTime(freq, audioCtx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();
      return whiteNoise;
    };

    const createDrone = () => {
      const freqs = [60, 110, 174, 220];
      freqs.forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, audioCtx.currentTime);
        
        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();
        lfo.frequency.setValueAtTime(0.1 + i * 0.05, audioCtx.currentTime);
        lfoGain.gain.setValueAtTime(10, audioCtx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        
        g.gain.setValueAtTime(0.05 / freqs.length, audioCtx.currentTime);
        osc.connect(g);
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, audioCtx.currentTime);
        g.connect(filter);
        filter.connect(masterGain);
        
        osc.start();
        lfo.start();
      });
    };

    const createHeartbeat = () => {
      const playThump = () => {
        const now = audioCtx.currentTime;
        [0, 0.4].forEach(offset => {
          const osc = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(60, now + offset);
          osc.frequency.exponentialRampToValueAtTime(30, now + offset + 0.1);
          g.gain.setValueAtTime(0, now + offset);
          g.gain.linearRampToValueAtTime(0.5, now + offset + 0.02);
          g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.2);
          osc.connect(g);
          g.connect(masterGain);
          osc.start(now + offset);
          osc.stop(now + offset + 0.3);
        });
      };
      const interval = setInterval(playThump, 1200);
      playThump();
      return () => clearInterval(interval);
    };

    let cleanupFn: (() => void) | undefined;

    switch (type) {
      case 'dark-drone':
        createDrone();
        break;
      case 'soft-rain':
        createNoise('lowpass', 1200);
        break;
      case 'heartbeat':
        cleanupFn = createHeartbeat();
        break;
      case 'clinical-hum':
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(50, audioCtx.currentTime);
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0.02, audioCtx.currentTime);
        osc.connect(g);
        g.connect(masterGain);
        osc.start();
        break;
    }

    return () => {
      if (cleanupFn) cleanupFn();
      masterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
      setTimeout(() => audioCtx.close(), 1100);
    };
  }, [type, volume]);

  return null;
};

export default AmbientSound;