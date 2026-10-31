# Commit Quest (v1.0.0)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#)
[![Tech: HTML5 / Vanilla JS](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20ES6-orange.svg)](#)
[![Engine: Phaser 3](https://img.shields.io/badge/Engine-Phaser%203.x-blue.svg)](#)
[![Audio: Web Audio API](https://img.shields.io/badge/Audio-Web%20Audio%20API-9cf.svg)](#)
[![Deployment: Vercel](https://img.shields.io/badge/Deployment-Vercel%20Ready-black.svg)](#)

> **"Every Commit Counts. Every Branch Tells a Story."**

**Commit Quest** is an educational, retro pixel-art 2D side-scrolling platformer that gamifies learning Git version control. Trapped inside a corrupted digital repository, players navigate platforming hazards, collect code knowledge tokens, and interact with a simulated bash terminal to execute genuine Git state transitions.

Developed as a showcase project for the **Multimedia Systems Laboratory**.

---

## 🎮 Key Highlights & Features

- **Realistic Git Simulation Engine**:
  - Independent, pure JavaScript state machine simulating the complete Git lifecycle.
  - Implements an uninitialized state, working tree, staging area, immutable commit history tree with SHA hashes, branch management, and remote sync.
  - Real command parser supporting `git init`, `git status`, `git add`, `git commit -m`, `git log --oneline`, `git branch`, `git switch`, `git merge`, and `git push`.
- **Dual Gameplay Systems**:
  - **Arcade Platformer**: Responsive physics, jumping mechanics with ground detection, collision bounds, dynamic squash & stretch, patrolling Bug Bots, floating Commit Crystals, and Stash Shields.
  - **Interactive Terminal Overlay**: Isolated DOM terminal modal preventing keystroke leakage into game physics, with command history buffer (`↑`/`↓`), auto-completion (`Tab`), and educational hints.
- **Synthesized 8-Bit Multimedia**:
  - Real-time sound synthesis via native **Web Audio API** (Square, Triangle, Sawtooth, and Sine wave generators).
  - Procedural chiptune background music (BGM) and 8 distinct sound effects (SFX) with zero external audio assets.
- **100% Offline & Zero Dependencies**:
  - Built without bundlers (no Vite, Webpack, or npm dependencies).
  - Procedurally generated pixel-art textures using off-screen HTML5 canvases during initialization.

---

## 🕹️ Controls

| Action | Controls |
| :--- | :--- |
| **Move Left / Right** | `A` / `D` or `←` / `→` (Left/Right Arrows) |
| **Jump** | `W`, `Spacebar`, or `↑` (Up Arrow) |
| **Open Terminal** | Step onto the Checkpoint Station at the end of each sector |
| **Audio Toggle** | `M` (or click `🔊 AUDIO [M]` in the HUD) |
| **Pause / Resume** | `ESC` |
| **Terminal Navigation** | `↑` / `↓` for history, `Tab` for auto-complete, `hint` for guidance |

---

## 📚 Curriculum & Sector Progression

```
[Level 1: Working Directory] ──> [Level 2: Staging Ground] ──> [Level 3: Branching Battlefield] ──> [Victory]
        git init                         git add .                         git branch feature
        git status                       git commit -m                     git switch feature
                                         git log --oneline                 git merge & git push
```

1. **Level 1: The Working Directory**:
   - Focus: Repository initialization, untracked files vs. working directory state.
   - Core Commands: `git init`, `git status`.
2. **Level 2: The Staging Ground**:
   - Focus: Staging area mechanics, snapshot preservation, commit messages, and history inspection.
   - Core Commands: `git add .`, `git commit -m "..."`, `git log --oneline`.
3. **Level 3: The Branching Battlefield**:
   - Focus: Branch creation, context switching, conflict avoidance, fast-forward merge resolution, and remote synchronization.
   - Core Commands: `git branch`, `git switch`, `git merge`, `git push`.

---

## 🛠️ Architecture & Tech Stack

```
retro_game/
├── index.html          # Application mount point and viewport layout
├── style.css           # CRT scanline effects, styling, and letterboxing
├── server.js           # Zero-dependency local Node.js static server
├── vercel.json         # Vercel deployment and routing configuration
├── README.md           # Professional project documentation
├── lib/
│   └── phaser.min.js   # Local Phaser 3 distribution (100% offline)
└── js/
    ├── config.js       # Central configuration: physics, scoring, instructor customization
    ├── audio.js        # Web Audio API 8-bit chiptune synthesizer engine
    ├── gitEngine.js    # Decoupled Git repository state machine
    ├── challenges.js   # Pedagogical curriculum manager
    ├── ui.js           # Interactive terminal DOM controller & input isolator
    ├── player.js       # Player entity class (physics, animation, health)
    ├── objects.js      # Collectibles, hazards, shield, conflict hazards, portals
    ├── scenes.js       # Phaser scenes (Boot, Main Menu, Instructions, Game, Victory, Pause)
    └── game.js         # Phaser.Game initialization and scale configuration
```

---

## 🚀 Running Locally

The application runs directly in any modern browser without build tooling or npm packages.

### Method 1: Using Node.js (Included)
```powershell
node server.js
```
Navigate to `http://localhost:8000/`.

### Method 2: Using VS Code Live Server
1. Open the project folder in VS Code.
2. Right-click `index.html` &rarr; **"Open with Live Server"**.

### Method 3: Using Python
```powershell
python -m http.server 8000
```

---

## ⚙️ Instructor Customization

All scoring, level timers, difficulty settings, and grading demonstration cheats are centralized in [js/config.js](js/config.js):

```javascript
customization: {
    difficulty: "NORMAL",                 // "EASY", "NORMAL", "HARD"
    startingLives: 3,                     // Overrides player starting lives
    extraLives: 0,                        // Additional bonus lives
    bonusTimeSeconds: 0,                  // Additional time for challenges
    scoringMultiplier: 1.0,               // Global score multiplier
    specialCollectiblesMultiplier: 1.0,   // Point multiplier for crystals/shields
    extraHazardsEnabled: false,           // Toggle additional obstacles
    invincibleCheat: false                // Toggle true for live grading demos
}
```

---

## 📄 License

This project is licensed under the MIT License — see the repository for details.
