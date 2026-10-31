/**
 * COMMIT QUEST — Audio Engine (audio.js)
 * 
 * Implements an authentic 8-bit chiptune audio synthesizer using the Web Audio API.
 * 
 * Advantages for College Multimedia Lab:
 * - 100% offline: Synthesizes waveforms (Square, Triangle, Sawtooth, White Noise) programmatically.
 * - Zero external .mp3/.wav dependencies: immune to 404s or broken file paths.
 * - Demonstrates core multimedia concepts: oscillators, gain nodes, ADSR envelopes, and frequency modulation.
 * - Provides background music, jump, collection, damage, warp, and challenge fanfare effects.
 * - Handles browser autoplay security policies gracefully.
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.isPlayingBGM = false;
        this.bgmTimer = null;
        this.bgmNoteIndex = 0;

        // Chiptune BGM Melody Notes (Frequencies in Hz)
        // Classic uplifting 8-bit retro gaming melody
        this.bgmPattern = [
            { freq: 261.63, dur: 0.18 }, // C4
            { freq: 329.63, dur: 0.18 }, // E4
            { freq: 392.00, dur: 0.18 }, // G4
            { freq: 523.25, dur: 0.25 }, // C5
            { freq: 392.00, dur: 0.18 }, // G4
            { freq: 440.00, dur: 0.18 }, // A4
            { freq: 523.25, dur: 0.25 }, // C5
            { freq: 440.00, dur: 0.18 }, // A4
            { freq: 349.23, dur: 0.18 }, // F4
            { freq: 392.00, dur: 0.18 }, // G4
            { freq: 440.00, dur: 0.18 }, // A4
            { freq: 392.00, dur: 0.25 }, // G4
            { freq: 329.63, dur: 0.18 }, // E4
            { freq: 293.66, dur: 0.18 }, // D4
            { freq: 261.63, dur: 0.35 }  // C4
        ];
    }

    /**
     * Initializes AudioContext upon user gesture (avoids browser autoplay block).
     */
    initAudioContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    }

    /**
     * Toggles sound on and off.
     * @returns {boolean} New mute state
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopBGM();
        } else {
            this.startBGM();
        }
        return this.isMuted;
    }

    // =========================================================================
    // BACKGROUND MUSIC (BGM) LOOP
    // =========================================================================
    startBGM() {
        if (this.isMuted || this.isPlayingBGM) return;
        this.initAudioContext();
        if (!this.ctx) return;

        this.isPlayingBGM = true;
        this.bgmNoteIndex = 0;
        this.scheduleNextBgmNote();
    }

    stopBGM() {
        this.isPlayingBGM = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
        this.bgmNoteIndex = 0;
    }

    scheduleNextBgmNote() {
        if (!this.isPlayingBGM || this.isMuted || !this.ctx) return;

        const note = this.bgmPattern[this.bgmNoteIndex];
        this.playTone(note.freq, "triangle", note.dur * 0.9, 0.04);

        // Advance note index
        this.bgmNoteIndex = (this.bgmNoteIndex + 1) % this.bgmPattern.length;

        // Schedule next note
        this.bgmTimer = setTimeout(() => {
            this.scheduleNextBgmNote();
        }, note.dur * 1000);
    }

    // =========================================================================
    // SOUND EFFECTS (SFX)
    // =========================================================================

    /**
     * Jump SFX: Rising frequency slide on square wave.
     */
    playJump() {
        if (this.isMuted) return;
        this.initAudioContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "square";
        osc.frequency.setValueAtTime(160, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(460, this.ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }

    /**
     * File Collect SFX: High-pitched double chime.
     */
    playCollect() {
        if (this.isMuted) return;
        this.initAudioContext();
        if (!this.ctx) return;

        this.playTone(587.33, "sine", 0.08, 0.1); // D5
        setTimeout(() => {
            this.playTone(880.00, "sine", 0.12, 0.12); // A5
        }, 70);
    }

    /**
     * Commit Crystal SFX: Fast ascending 3-note arpeggio.
     */
    playCrystal() {
        if (this.isMuted) return;
        this.initAudioContext();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((f, idx) => {
            setTimeout(() => {
                this.playTone(f, "triangle", 0.09, 0.1);
            }, idx * 45);
        });
    }

    /**
     * Stash Shield SFX: Shimmering metallic tone.
     */
    playShield() {
        if (this.isMuted) return;
        this.initAudioContext();
        if (!this.ctx) return;

        const freqs = [440, 554, 659, 880];
        freqs.forEach((f, idx) => {
            setTimeout(() => {
                this.playTone(f, "sine", 0.15, 0.08);
            }, idx * 50);
        });
    }

    /**
     * Hazard Collision / Damage SFX: Low crunch sawtooth burst.
     */
    playDamage() {
        if (this.isMuted) return;
        this.initAudioContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + 0.25);

        gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
    }

    /**
     * Git Challenge Correct SFX: Triumphant 4-note victory fanfare.
     */
    playSuccess() {
        if (this.isMuted) return;
        this.initAudioContext();
        if (!this.ctx) return;

        const fanfare = [
            { f: 523.25, d: 0.10 }, // C5
            { f: 659.25, d: 0.10 }, // E5
            { f: 783.99, d: 0.12 }, // G5
            { f: 1046.50, d: 0.35 } // C6
        ];

        let delay = 0;
        fanfare.forEach(n => {
            setTimeout(() => {
                this.playTone(n.f, "square", n.d, 0.08);
            }, delay);
            delay += n.d * 900;
        });
    }

    /**
     * Git Challenge Failure SFX: Double buzz error tone.
     */
    playFailure() {
        if (this.isMuted) return;
        this.initAudioContext();
        if (!this.ctx) return;

        this.playTone(180, "sawtooth", 0.12, 0.12);
        setTimeout(() => {
            this.playTone(130, "sawtooth", 0.22, 0.14);
        }, 130);
    }

    /**
     * Branch Portal Warp SFX: Frequency sweep.
     */
    playWarp() {
        if (this.isMuted) return;
        this.initAudioContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    /**
     * Helper to play an individual synthetic tone with envelope.
     */
    playTone(frequency, type, duration, volume = 0.1) {
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }
}

// Global Sound Engine singleton instance
window.soundEngine = new SoundEngine();
