# COMMIT QUEST — Lab Demonstration & Oral Viva Guide
> **Multimedia Systems Lab Evaluation — Complete Project Reference**

---

## 1. Project Summary & Academic Pitch
- **Game Title**: COMMIT QUEST
- **Tagline**: *Every Commit Counts. Every Branch Tells a Story.*
- **Concept**: A retro 2D arcade platformer that doubles as an educational Git simulation. The player plays as a software engineer trapped inside a corrupt Git repository who must navigate platform levels, discover command protocols, dodge bug hazards, and solve Git terminal challenges to restore the repository.
- **Strict Tech Stack**:
  - HTML5 & Vanilla CSS3 (CRT scanline effects, flexbox letterboxing)
  - Pure JavaScript (ES6 OOP: Classes, Encapsulation, State Machines)
  - Local **Phaser 3** (`lib/phaser.min.js`) — 100% offline, zero CDN dependencies
  - Local zero-dependency Node.js HTTP server (`node server.js`)
  - Web Audio API (real-time procedural chiptune synthesis)

---

## 2. Architecture & File Breakdown

```
retro_game/
├── index.html          # HTML5 mount point; loads local scripts in dependency order
├── style.css           # Retro cyberpunk theme, canvas letterboxing, CRT scanline styling
├── server.js           # Zero-dependency Node.js static server (port 8000)
├── README.md           # Instructions, controls, milestone verification
├── LAB_DEMO_GUIDE.md   # This student demonstration & oral exam guide
├── lib/
│   └── phaser.min.js   # Local Phaser 3 distribution (1.18 MB)
└── js/
    ├── config.js       # Central configuration: physics, scoring, instructor customization
    ├── audio.js        # Web Audio API 8-bit chiptune BGM & sound effects engine
    ├── gitEngine.js    # Decoupled simulated Git repository engine
    ├── challenges.js   # Pedagogical curriculum manager across Levels 1, 2, and 3
    ├── ui.js           # Interactive DOM terminal controller & input isolator
    ├── player.js       # Player entity class (movement, jumping, lives, shield, animations)
    ├── objects.js      # File tokens, crystals, bug bots, shield, conflict hazards, portals
    ├── scenes.js       # Phaser scenes (Boot, MainMenu, Instructions, Game, Victory, Pause)
    └── game.js         # Phaser.Game bootstrap and canvas scaling
```

---

## 3. Core Technical Concepts (Java/OOP Developer Translation)

### A. The Game Update Loop (`GameScene.update()`)
- **How it works**: Runs roughly 60 times per second ($60\,\text{FPS}$).
- **Flow**:
  1. Checks if the terminal modal is open. If open, player movement input is ignored.
  2. If closed, invokes `this.player.update(this.cursors, this.wasd)`.
  3. Iterates over all active enemies (`this.bugs.forEach(bug => bug.update())`) to update patrol limits.

### B. Player Movement & Ground Detection (`Player.update()`)
- **Horizontal**: Checks `A` / `D` or Left / Right arrow keys to apply horizontal velocity (`body.setVelocityX(±speed)`).
- **Ground Detection**: Uses Phaser's Arcade Physics flags:
  ```javascript
  const isGrounded = body.blocked.down || body.touching.down;
  ```
  This guarantees that players cannot jump mid-air (no double-jumping glitch).
- **Jumping**: If `wantsToJump && isGrounded`, applies upward velocity (`body.setVelocityY(-480)`), plays synthetic jump audio, stretches sprite height by $15\%$, and emits dust puff particles.
- **Landing**: Detects state transition from `!wasGrounded && isGrounded` to apply a squash tween and dust particles.

### C. Pure JavaScript Git Engine (`GitEngine`)
- **Why it matters**: It is **not** a dummy regex or hardcoded string checker. It simulates actual Git repository state:
  - `isInitialized`: Boolean tracking `.git` folder existence.
  - `workingDirectory`: Set of untracked files (`index.html`, `style.css`, etc.).
  - `stagingArea`: Set of staged files populated via `git add`.
  - `commits`: Array of immutable commit objects with SHA hashes, timestamps, messages, and parent pointers.
  - `branches`: Array of branch names; tracks `currentBranch` and HEAD pointer.
- **Parsing**: Tokenizes input arguments while preserving quoted messages (`-m "commit message"`).

### D. Input Isolation between DOM Terminal and Phaser (`TerminalUI`)
- **Common Bug Prevented**: In typical web games, typing `a`, `d`, `w`, or `space` into an input box causes the game character to jump and run off the screen.
- **Solution**:
  ```javascript
  // When opening terminal:
  scene.input.keyboard.enabled = false;
  // Keystrokes in input field stop propagation:
  inputField.addEventListener("keydown", (e) => e.stopPropagation());
  // When closing terminal:
  scene.input.keyboard.enabled = true;
  ```

### E. Procedural Web Audio API Synthesis (`SoundEngine`)
- **Multimedia Highlight**: Rather than loading audio files which can fail offline or throw CORS errors, audio is synthesized directly:
  - **Square Wave Oscillator**: Authentic 8-bit game console sound (Jumps, Victory fanfare).
  - **Triangle Wave Oscillator**: Warm melodic tones for chiptune background music.
  - **Sawtooth Oscillator**: Raw crunchy sound for damage collisions and error buzzes.
  - **Sine Wave Oscillator**: Smooth chimes for file pickups and portal sweeps.

---

## 4. Key Questions & Answers for Lab Evaluation

**Q1: How does the game ensure it works 100% offline without CDNs or downloads?**  
*Answer*:
1. Phaser 3 is stored locally at `lib/phaser.min.js`.
2. All pixel-art character sprites, circuit platforms, collectible tokens, bug bots, and terminals are generated procedurally onto offscreen HTML5 canvases during `BootScene`.
3. Background music and sound effects are synthesized mathematically via the Web Audio API.
4. Static files are served via our local `node server.js` script.

**Q2: How is the Git curriculum structured across the 3 levels?**  
*Answer*:
- **Level 1 (The Working Directory)**: Concept of an uninitialized directory & untracked files. Requires `git init` and `git status`.
- **Level 2 (The Staging Ground)**: Concept of the two-stage commit process. Requires `git add .`, `git commit -m "..."`, and `git log --oneline`.
- **Level 3 (The Branching Battlefield)**: Concept of isolated development, branch switching, fast-forward merging, and remote push. Requires `git branch feature`, `git switch feature`, `git merge feature`, and `git push`.

**Q3: How does the game encourage learning instead of just giving answers away?**  
*Answer*:
- During the platforming level, the player discovers **Knowledge Tokens** and reads **In-World Holographic Data Beacons** displaying command syntax.
- When reaching the terminal, the terminal presents a real-world software development objective (`"Initialize an empty Git repository in this working directory"`). The player must apply what they discovered in the level. If stuck, typing `hint` displays a syntax reminder.

**Q4: How can the instructor customize the game parameters?**  
*Answer*:
All gameplay constants and instructor customization settings are centralized in [js/config.js](file:///d:/DMW/MS/retro_game/js/config.js). The instructor can modify starting lives, extra lives, bonus time, scoring multipliers, difficulty presets, and even toggle an invincibility cheat mode for grading.

---

## 5. Quick Demonstration Checklist

1. **Launch**:
   ```powershell
   cd d:\DMW\MS\retro_game
   node server.js
   ```
   Open `http://localhost:8000`.
2. **Main Menu**: Show title pulsing, background Git matrix animation, difficulty toggle (`EASY`/`NORMAL`/`HARD`), and Instructions.
3. **Platforming**:
   - Move with `A`/`D`, jump with `Space`/`W` (point out dust puffs and squash/stretch).
   - Collect a File Token & point out the floating toast: `📖 PROTOCOL DISCOVERED: 'git init'`.
   - Point out the hovering in-world `[DATA BEACON]` signs.
   - Point out patrolling Bug Bots and the HUD bar (Lives, Score, Timer, Sound toggle).
4. **Terminal Challenge**:
   - Step on the Checkpoint Terminal.
   - Point out that typing in the terminal does not move the player.
   - Type `git init` and `git status` to clear Level 1.
5. **Level 2 & Level 3**:
   - Show the Stash Shield power-up (`S`) creating a golden orbital barrier.
   - Show the Branch Portals (`⇄`) and Merge Conflict hazards (`!!!`).
   - Complete Level 3 with `git branch`, `git switch`, `git merge`, and `git push`.
6. **Victory Screen**:
   - Show the final scorecard and Git mastery badge, pointing out that background music cleanly terminates.
