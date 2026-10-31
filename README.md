# COMMIT QUEST
> *Every Commit Counts. Every Branch Tells a Story.*

A retro pixel-art 2D side-scrolling arcade game with an interactive Git learning engine, developed for the **Multimedia Systems Lab**.

---

## 🎮 Technology Stack (STRICT Offline & No Build Tooling)
- **HTML5 & CSS3**: Semantic layouts, CRT scanline styling, and responsive canvas scaling.
- **Vanilla JavaScript (ES6 OOP)**: Straightforward object-oriented programming (classes, inheritance, encapsulation) designed for clarity and ease of academic explanation.
- **Phaser 3**: High-performance 2D arcade physics engine loaded **locally** from `lib/phaser.min.js` (zero CDN, 100% offline).
- **Zero Build Tools**: No npm, no Vite, no Webpack, no backend, no databases.

---

## 🚀 How to Run the Project

### Option A: Using Node.js (Recommended)
1. Open PowerShell or Terminal in the project directory:
   ```powershell
   cd d:\DMW\MS\retro_game
   node server.js
   ```
2. Open your web browser and navigate to:
   ```
   http://localhost:8000
   ```

### Option B: Using VS Code Live Server
1. Open the `retro_game` folder in VS Code.
2. Right-click `index.html` and click **"Open with Live Server"**.

---

## 🕹️ Controls
- **Move Left**: `A` or `Left Arrow`
- **Move Right**: `D` or `Right Arrow`
- **Jump**: `W`, `Up Arrow`, or `Spacebar`
- **Pause / Resume**: `ESC`
- **Terminal Input**: Use keyboard when interacting with checkpoint stations.

---

## 📁 Project Architecture & Directory Structure
```
retro_game/
├── index.html          # Main HTML5 entry point with canvas and terminal containers
├── style.css           # Cyberpunk terminal theme & scanline visuals
├── README.md           # Documentation, run instructions, and controls
├── LAB_DEMO_GUIDE.md   # Complete student guide for oral viva and lab presentation
├── lib/
│   └── phaser.min.js   # Local Phaser 3 distribution (v3.x offline)
├── js/
│   ├── config.js       # Central configuration (physics, scoring, customizations)
│   ├── audio.js        # Web Audio API 8-bit chiptune BGM & SFX synthesizer
│   ├── player.js       # Player OOP entity (movement, jumping, lives, shield, animations)
│   ├── scenes.js       # Phaser scenes (Boot, Main Menu, Instructions, Game, Victory, Pause)
│   ├── game.js         # Phaser game instance bootstrap & scaling
│   ├── objects.js      # Collectibles, hazards, shield, conflict hazards, portals
│   ├── gitEngine.js    # Simulated Git repository engine
│   ├── challenges.js   # Interactive terminal challenge curriculum
│   └── ui.js           # DOM terminal overlay controller & input isolator
└── assets/
    ├── images/         # Custom sprites and graphics
    └── sounds/         # Audio assets directory
```

---

## 🏆 Implementation Milestones
- [x] **Milestone 1**: Project Setup, Local Phaser Initialization, Procedural Pixel Art Generator, Main Menu, Instructions, Basic Level 1 Scene, Player Placeholder, Pause Scene, and Transitions.
- [x] **Milestone 2**: Smooth Player Movement, Platforming Physics, Camera Tracking, Ground Collision.
- [x] **Milestone 3**: Collectibles (File Tokens, Commit Crystals), Hazards (Patrolling Bug Bots), Score/Lives HUD, Timer Mechanics.
- [x] **Milestone 4**: Pure JavaScript Git Engine (repo init, staging, commits, branches, switch, merge, log) & Interactive Terminal Overlay.
- [x] **Milestone 5**: Interactive Terminal Challenges with Step Validation, Command Auto-complete, and Dynamic Feedback.
- [x] **Milestone 6**: Three Complete Levels with Progression:
  - **Level 1**: The Working Directory (`git init`, `git status`)
  - **Level 2**: The Staging Ground (`git add`, `git commit`, `git log`)
  - **Level 3**: The Branching Battlefield (`git branch`, `git switch`, `git merge`, `git push`) -> Victory Screen
- [x] **Milestone 7**: Audio FX & Visual Polish:
  - Procedural Web Audio API 8-Bit Chiptune BGM Synthesizer (Zero external file dependencies)
  - Full SFX Suite: Rising Jump glide, 2-tone File chime, 4-note Crystal arpeggio, Shimmering Stash Shield, Crunch Damage, Triumphant Fanfare, Error Buzz, and Portal Warp
  - HUD Sound Toggle (`🔊 [M]` / `🔇 [M]`) with keyboard shortcut `[M]`
  - Dynamic Sprite Animations: Procedural Idle, Run1/Run2 leg cycles, and Jump stretch
  - Particle Systems: Sparkle bursts for pickups, Jump & Landing dust puffs, and Stash Shield orbital aura
- [x] **Milestone 8**: Final Lab Submission Verification & Customization Options (Ready in `config.js`).
