// Synthesizes 8-bit chiptune audio via Web Audio API
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.isPlayingBGM = false;
        this.bgmTimer = null;
        this.bgmNoteIndex = 0;

        this.bgmPattern = [
            { freq: 261.63, dur: 0.18 },
            { freq: 329.63, dur: 0.18 },
            { freq: 392.00, dur: 0.18 },
            { freq: 523.25, dur: 0.25 },
            { freq: 392.00, dur: 0.18 },
            { freq: 440.00, dur: 0.18 },
            { freq: 523.25, dur: 0.25 },
            { freq: 440.00, dur: 0.18 },
            { freq: 349.23, dur: 0.18 },
            { freq: 392.00, dur: 0.18 },
            { freq: 440.00, dur: 0.18 },
            { freq: 392.00, dur: 0.25 },
            { freq: 329.63, dur: 0.18 },
            { freq: 293.66, dur: 0.18 },
            { freq: 261.63, dur: 0.35 }
        ];
    }

    initAudioContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopBGM();
        } else {
            this.startBGM();
        }
        return this.isMuted;
    }

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
        this.bgmNoteIndex = (this.bgmNoteIndex + 1) % this.bgmPattern.length;

        this.bgmTimer = setTimeout(() => {
            this.scheduleNextBgmNote();
        }, note.dur * 1000);
    }

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

    playCollect() {
        if (this.isMuted) return;
        this.initAudioContext();
        if (!this.ctx) return;

        this.playTone(587.33, "sine", 0.08, 0.1);
        setTimeout(() => {
            this.playTone(880.00, "sine", 0.12, 0.12);
        }, 70);
    }

    playCrystal() {
        if (this.isMuted) return;
        this.initAudioContext();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((f, idx) => {
            setTimeout(() => {
                this.playTone(f, "triangle", 0.09, 0.1);
            }, idx * 45);
        });
    }

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

    playSuccess() {
        if (this.isMuted) return;
        this.initAudioContext();
        if (!this.ctx) return;

        const fanfare = [
            { f: 523.25, d: 0.10 },
            { f: 659.25, d: 0.10 },
            { f: 783.99, d: 0.12 },
            { f: 1046.50, d: 0.35 }
        ];

        let delay = 0;
        fanfare.forEach(n => {
            setTimeout(() => {
                this.playTone(n.f, "square", n.d, 0.08);
            }, delay);
            delay += n.d * 900;
        });
    }

    playFailure() {
        if (this.isMuted) return;
        this.initAudioContext();
        if (!this.ctx) return;

        this.playTone(180, "sawtooth", 0.12, 0.12);
        setTimeout(() => {
            this.playTone(130, "sawtooth", 0.22, 0.14);
        }, 130);
    }

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

window.soundEngine = new SoundEngine();
