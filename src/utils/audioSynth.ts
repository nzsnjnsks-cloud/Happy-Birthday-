// Web Audio API Fluent Romantic Song Synthesizer & Audio Player

export interface SongPreset {
  id: string;
  name: string;
  bpm: number;
  rootScale: number[];
  progression: {
    rootFreq: number;
    chordNotes: number[]; // relative frequencies for arpeggios
    melodyNotes: number[]; // melody line
  }[];
}

// Fluent romantic song compositions
export const ROMANTIC_SONG_PRESETS: SongPreset[] = [
  {
    id: 'golden-hour',
    name: 'Golden Hour Romance (Piano & Strings)',
    bpm: 76,
    rootScale: [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88], // C Major
    progression: [
      {
        rootFreq: 130.81, // C3
        chordNotes: [261.63, 329.63, 392.0, 523.25, 659.25, 523.25, 392.0, 329.63],
        melodyNotes: [523.25, 0, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25],
      },
      {
        rootFreq: 98.0, // G2
        chordNotes: [196.0, 246.94, 293.66, 392.0, 493.88, 392.0, 293.66, 246.94],
        melodyNotes: [392.0, 0, 493.88, 587.33, 659.25, 587.33, 493.88, 392.0],
      },
      {
        rootFreq: 110.0, // A2 (Am)
        chordNotes: [220.0, 261.63, 329.63, 440.0, 523.25, 440.0, 329.63, 261.63],
        melodyNotes: [659.25, 0, 587.33, 523.25, 440.0, 523.25, 587.33, 659.25],
      },
      {
        rootFreq: 87.31, // F2 (Fmaj7)
        chordNotes: [174.61, 220.0, 261.63, 329.63, 440.0, 329.63, 261.63, 220.0],
        melodyNotes: [523.25, 587.33, 659.25, 783.99, 659.25, 523.25, 392.0, 523.25],
      },
    ],
  },
  {
    id: 'moonlight-serenade',
    name: 'Moonlight Serenade (Lyrical Ballad)',
    bpm: 68,
    rootScale: [277.18, 311.13, 349.23, 369.99, 415.3, 466.16, 523.25], // Db Major
    progression: [
      {
        rootFreq: 138.59, // Db3
        chordNotes: [277.18, 349.23, 415.3, 554.37, 698.46, 554.37, 415.3, 349.23],
        melodyNotes: [554.37, 0, 698.46, 830.61, 698.46, 554.37, 415.3, 554.37],
      },
      {
        rootFreq: 116.54, // Bb2 (Bbm7)
        chordNotes: [233.08, 277.18, 349.23, 466.16, 554.37, 466.16, 349.23, 277.18],
        melodyNotes: [830.61, 0, 698.46, 554.37, 466.16, 554.37, 698.46, 830.61],
      },
      {
        rootFreq: 92.5, // Gb2 (Gbmaj9)
        chordNotes: [185.0, 233.08, 277.18, 369.99, 466.16, 369.99, 277.18, 233.08],
        melodyNotes: [698.46, 0, 554.37, 466.16, 415.3, 466.16, 554.37, 698.46],
      },
      {
        rootFreq: 103.83, // Ab2 (Ab dominant)
        chordNotes: [207.65, 261.63, 311.13, 415.3, 523.25, 415.3, 311.13, 261.63],
        melodyNotes: [622.25, 0, 523.25, 466.16, 415.3, 466.16, 523.25, 554.37],
      },
    ],
  },
  {
    id: 'warm-acoustic',
    name: 'Warm Sunset Glow (Acoustic Chords)',
    bpm: 80,
    rootScale: [293.66, 329.63, 369.99, 392.0, 440.0, 493.88, 554.37], // D Major
    progression: [
      {
        rootFreq: 146.83, // D3
        chordNotes: [293.66, 369.99, 440.0, 587.33, 739.99, 587.33, 440.0, 369.99],
        melodyNotes: [587.33, 0, 739.99, 880.0, 739.99, 587.33, 440.0, 587.33],
      },
      {
        rootFreq: 123.47, // B2 (Bm)
        chordNotes: [246.94, 293.66, 369.99, 493.88, 587.33, 493.88, 369.99, 293.66],
        melodyNotes: [739.99, 0, 587.33, 493.88, 440.0, 493.88, 587.33, 739.99],
      },
      {
        rootFreq: 98.0, // G2 (Gadd9)
        chordNotes: [196.0, 246.94, 293.66, 392.0, 440.0, 392.0, 293.66, 246.94],
        melodyNotes: [587.33, 0, 493.88, 440.0, 392.0, 440.0, 493.88, 587.33],
      },
      {
        rootFreq: 110.0, // A2 (Asus4 to A)
        chordNotes: [220.0, 293.66, 329.63, 440.0, 554.37, 440.0, 329.63, 293.66],
        melodyNotes: [554.37, 0, 493.88, 440.0, 369.99, 440.0, 493.88, 587.33],
      },
    ],
  },
];

class RomanticMusicController {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.65;
  private masterGain: GainNode | null = null;
  private reverbDelay: DelayNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private customAudio: HTMLAudioElement | null = null;
  private customAudioUrl: string | null = null;
  private onStateChange: ((state: { isPlaying: boolean; currentTime: number; duration: number; presetId: string }) => void) | null = null;
  private currentTime: number = 0;
  private duration: number = 240; // 4 min cycle
  private currentPresetIndex: number = 0;
  private timerId: number | null = null;
  private stepIndex: number = 0;
  private currentMeasure: number = 0;

  public setListener(listener: (state: { isPlaying: boolean; currentTime: number; duration: number; presetId: string }) => void) {
    this.onStateChange = listener;
  }

  private notify() {
    if (this.onStateChange) {
      this.onStateChange({
        isPlaying: this.isPlaying,
        currentTime: this.currentTime,
        duration: this.duration,
        presetId: this.getCurrentPreset().id,
      });
    }
  }

  public getCurrentPreset(): SongPreset {
    return ROMANTIC_SONG_PRESETS[this.currentPresetIndex] || ROMANTIC_SONG_PRESETS[0];
  }

  public setPreset(presetId: string) {
    const idx = ROMANTIC_SONG_PRESETS.findIndex((p) => p.id === presetId);
    if (idx !== -1) {
      this.currentPresetIndex = idx;
      // If playing custom audio, stop it to play chosen preset
      if (this.customAudio) {
        this.customAudio.pause();
      }
      this.stepIndex = 0;
      this.currentMeasure = 0;
      this.notify();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    if (this.customAudio) {
      this.customAudio.volume = this.volume;
    }
  }

  public loadCustomAudio(file: File) {
    if (this.customAudioUrl) {
      URL.revokeObjectURL(this.customAudioUrl);
    }
    this.customAudioUrl = URL.createObjectURL(file);
    if (!this.customAudio) {
      this.customAudio = new Audio();
    }
    this.customAudio.src = this.customAudioUrl;
    this.customAudio.volume = this.volume;

    this.customAudio.onloadedmetadata = () => {
      this.duration = this.customAudio?.duration || 240;
      this.notify();
    };

    this.customAudio.ontimeupdate = () => {
      if (this.customAudio) {
        this.currentTime = this.customAudio.currentTime;
        this.notify();
      }
    };

    this.customAudio.onended = () => {
      this.isPlaying = false;
      this.currentTime = 0;
      this.notify();
    };
  }

  private initAudioNodes() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }

    if (!this.masterGain) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;

      // Acoustic Lowpass Filter for warm, silky tone
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.value = 2800; // Warm acoustic presence
      this.filter.Q.value = 1.0;

      // Cathedral / Living Room Ambience Delay
      this.reverbDelay = this.ctx.createDelay();
      this.reverbDelay.delayTime.value = 0.32;

      const delayFeedback = this.ctx.createGain();
      delayFeedback.gain.value = 0.28;

      // Connect delay feedback loop
      this.reverbDelay.connect(delayFeedback);
      delayFeedback.connect(this.reverbDelay);
      this.reverbDelay.connect(this.masterGain);

      // Connect filter directly to master and to delay
      this.filter.connect(this.masterGain);
      this.filter.connect(this.reverbDelay);

      this.masterGain.connect(this.ctx.destination);
    }
  }

  // Play a single lyrical tone with smooth attack and decay
  private playTone(freq: number, startTime: number, duration: number, type: OscillatorType = 'triangle', gainLevel = 0.08, hasVibrato = false) {
    if (!this.ctx || !this.filter || freq <= 0) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    if (hasVibrato) {
      // Gentle expressive vibrato
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(5.2, startTime); // 5.2 Hz gentle vibrato
      lfoGain.gain.setValueAtTime(2.5, startTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(startTime + 0.15); // Start vibrato slightly after note strike
      lfo.stop(startTime + duration);
    }

    // Natural acoustic envelope: quick gentle attack, sustained body, long warm tail
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(gainLevel, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(gainLevel * 0.7, startTime + duration * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.filter);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  }

  private scheduleNextMeasures() {
    if (!this.isPlaying || !this.ctx) return;

    const preset = this.getCurrentPreset();
    const beatDuration = 60 / preset.bpm;
    const sixteenth = beatDuration / 2; // 8 notes per measure
    const now = this.ctx.currentTime;

    const currentChordData = preset.progression[this.currentMeasure % preset.progression.length];

    // 1. Warm Acoustic Bass Note on measure start
    this.playTone(currentChordData.rootFreq, now, beatDuration * 3.8, 'sine', 0.18, false);
    this.playTone(currentChordData.rootFreq * 2, now + 0.02, beatDuration * 2.5, 'triangle', 0.09, false);

    // 2. Fluent Arpeggio Accompaniment (8 eighth-notes across the measure)
    currentChordData.chordNotes.forEach((noteFreq, idx) => {
      const noteTime = now + idx * sixteenth;
      // Staggered arpeggiated piano notes with gentle dynamic curve
      const dynamics = idx === 0 || idx === 4 ? 0.08 : 0.055;
      this.playTone(noteFreq, noteTime, sixteenth * 1.8, 'triangle', dynamics, false);
    });

    // 3. Expressive Melody Line over the chords
    currentChordData.melodyNotes.forEach((melodyFreq, idx) => {
      if (melodyFreq > 0) {
        const melodyTime = now + idx * sixteenth;
        // Lyrical singing tone with vibrato
        this.playTone(melodyFreq, melodyTime, sixteenth * 2.2, 'sine', 0.09, true);
        // Soft harmonic overtone
        this.playTone(melodyFreq * 2, melodyTime + 0.02, sixteenth * 1.4, 'triangle', 0.02, false);
      }
    });

    this.currentMeasure++;
    this.currentTime = (this.currentTime + Math.round(beatDuration * 4)) % this.duration;
    this.notify();

    // Schedule next measure
    const timeUntilNext = beatDuration * 4 * 1000;
    this.timerId = window.setTimeout(() => {
      if (this.isPlaying) {
        this.scheduleNextMeasures();
      }
    }, timeUntilNext - 50);
  }

  public play() {
    if (this.customAudio && this.customAudioUrl) {
      this.customAudio.play().then(() => {
        this.isPlaying = true;
        this.notify();
      }).catch((err) => {
        console.warn('Custom audio playback error:', err);
      });
      return;
    }

    this.initAudioNodes();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this.notify();

    // Begin fluent melody stream
    this.scheduleNextMeasures();
  }

  public pause() {
    this.isPlaying = false;
    if (this.customAudio) {
      this.customAudio.pause();
    }
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.notify();
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public seek(seconds: number) {
    this.currentTime = seconds;
    if (this.customAudio) {
      this.customAudio.currentTime = seconds;
    }
    this.notify();
  }

  public destroy() {
    this.pause();
    if (this.customAudioUrl) {
      URL.revokeObjectURL(this.customAudioUrl);
    }
    if (this.ctx) {
      this.ctx.close();
    }
  }
}

export const musicPlayer = new RomanticMusicController();
