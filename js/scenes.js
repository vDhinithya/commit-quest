/**
 * COMMIT QUEST — Scene Controllers (scenes.js)
 * 
 * Manages the distinct game screens and states using Phaser 3 Scene architecture.
 * Implemented with clear OOP classes:
 * 1. BootScene: Generates procedural pixel-art assets and sets up global caches.
 * 2. MainMenuScene: Interactive title screen with start, instructions, and difficulty options.
 * 3. InstructionsScene: Teaches controls, Git concepts, and mission objectives.
 * 4. GameScene: Core platformer gameplay scene (handles Level 1, 2, and 3 progression).
 * 5. VictoryScene: Displayed upon completing all Git challenges and restoring the repository.
 * 6. PauseScene: Modal overlay for resuming, restarting, or quitting.
 */

// =============================================================================
// 1. BOOT SCENE — PROCEDURAL PIXEL-ART TEXTURE GENERATOR
// =============================================================================
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: "BootScene" });
    }

    create() {
        this.generatePixelArtTextures();
        this.scene.start("MainMenuScene");
    }

    /**
     * Generates all retro pixel-art sprites using offscreen canvases.
     * Guaranteed 100% offline functionality without external downloads.
     */
    generatePixelArtTextures() {
        // --- 1. Developer Player Sprite: IDLE (32x44 px) ---
        const drawBaseDev = (ctx, leg1Offset, leg2Offset, visorGlow = false) => {
            // Hoodie / Body (Cyan-blue developer hoodie)
            ctx.fillStyle = "#1f6feb";
            ctx.fillRect(6, 14, 20, 18);

            // Head / Skin
            ctx.fillStyle = "#ffdfba";
            ctx.fillRect(8, 4, 16, 12);

            // Hair / Cap (Dark retro cap)
            ctx.fillStyle = "#238636";
            ctx.fillRect(6, 2, 20, 6);

            // Terminal Cyber Visor (Glowing green)
            ctx.fillStyle = visorGlow ? "#adff2f" : "#39ff14";
            ctx.fillRect(10, 8, 12, 4);

            // Legs / Jeans (Dark indigo denim)
            ctx.fillStyle = "#0d419d";
            ctx.fillRect(8 + leg1Offset, 32, 6, 10);
            ctx.fillRect(18 + leg2Offset, 32, 6, 10);

            // Sneakers (White soles)
            ctx.fillStyle = "#f0f6fc";
            ctx.fillRect(6 + leg1Offset, 40, 8, 4);
            ctx.fillRect(18 + leg2Offset, 40, 8, 4);

            // Laptop Backpack (Git Orange)
            ctx.fillStyle = "#f78166";
            ctx.fillRect(2, 16, 5, 14);
        };

        // Frame: IDLE
        const pIdle = this.textures.createCanvas("player-dev-idle", 32, 44);
        drawBaseDev(pIdle.context, 0, 0);
        pIdle.refresh();

        // Frame: RUN 1
        const pRun1 = this.textures.createCanvas("player-dev-run1", 32, 44);
        drawBaseDev(pRun1.context, -2, 2);
        pRun1.refresh();

        // Frame: RUN 2
        const pRun2 = this.textures.createCanvas("player-dev-run2", 32, 44);
        drawBaseDev(pRun2.context, 2, -2);
        pRun2.refresh();

        // Frame: JUMP
        const pJump = this.textures.createCanvas("player-dev-jump", 32, 44);
        drawBaseDev(pJump.context, -1, 1, true);
        pJump.refresh();

        // --- 2. Circuit Platform Tile (64x32 px) ---
        const platCanvas = this.textures.createCanvas("platform-circuit", 64, 32);
        const plCtx = platCanvas.context;

        plCtx.fillStyle = "#161b22";
        plCtx.fillRect(0, 0, 64, 32);
        plCtx.fillStyle = "#238636";
        plCtx.fillRect(0, 0, 64, 4);

        // Circuit board traces (Neon cyan & green)
        plCtx.fillStyle = "#388bfd";
        plCtx.fillRect(8, 8, 48, 2);
        plCtx.fillRect(20, 8, 2, 14);
        plCtx.fillRect(20, 20, 16, 2);
        plCtx.fillRect(44, 8, 2, 18);

        // Solder nodes
        plCtx.fillStyle = "#e3b341";
        plCtx.fillRect(36, 18, 5, 5);
        plCtx.fillRect(42, 24, 5, 5);
        plCtx.fillRect(6, 6, 4, 4);

        plCtx.strokeStyle = "#30363d";
        plCtx.lineWidth = 1;
        plCtx.strokeRect(0, 0, 64, 32);
        platCanvas.refresh();

        // --- 3. Ground Block (64x64 px) ---
        const groundCanvas = this.textures.createCanvas("ground-block", 64, 64);
        const gCtx = groundCanvas.context;

        gCtx.fillStyle = "#0d1117";
        gCtx.fillRect(0, 0, 64, 64);
        gCtx.fillStyle = "#2ea043";
        gCtx.fillRect(0, 0, 64, 6);
        gCtx.fillStyle = "#21262d";
        gCtx.fillRect(4, 10, 56, 50);

        gCtx.fillStyle = "#30363d";
        for (let x = 12; x < 60; x += 14) {
            for (let y = 18; y < 60; y += 14) {
                gCtx.fillRect(x, y, 3, 3);
            }
        }
        groundCanvas.refresh();

        // --- 4. File Collectible Token (24x28 px) ---
        const fileCanvas = this.textures.createCanvas("token-file", 24, 28);
        const fCtx = fileCanvas.context;

        fCtx.fillStyle = "#f0f6fc";
        fCtx.fillRect(2, 2, 20, 24);
        fCtx.fillStyle = "#8b949e";
        fCtx.fillRect(16, 2, 6, 6);
        fCtx.fillStyle = "#58a6ff";
        fCtx.fillRect(6, 10, 12, 2);
        fCtx.fillRect(6, 14, 10, 2);
        fCtx.fillRect(6, 18, 12, 2);
        fCtx.fillRect(6, 22, 6, 2);
        fileCanvas.refresh();

        // --- 5. Commit Crystal (Rare Collectible - 24x32 px) ---
        const crystalCanvas = this.textures.createCanvas("crystal-commit", 24, 32);
        const cCtx = crystalCanvas.context;

        cCtx.fillStyle = "#bc8cff";
        cCtx.beginPath();
        cCtx.moveTo(12, 2);
        cCtx.lineTo(22, 12);
        cCtx.lineTo(12, 30);
        cCtx.lineTo(2, 12);
        cCtx.closePath();
        cCtx.fill();

        cCtx.fillStyle = "#d2a8ff";
        cCtx.beginPath();
        cCtx.moveTo(12, 6);
        cCtx.lineTo(18, 12);
        cCtx.lineTo(12, 24);
        cCtx.lineTo(6, 12);
        cCtx.closePath();
        cCtx.fill();
        crystalCanvas.refresh();

        // --- 6. Bug Bot Hazard (30x24 px) ---
        const bugCanvas = this.textures.createCanvas("hazard-bug", 30, 24);
        const bCtx = bugCanvas.context;

        bCtx.fillStyle = "#da3633";
        bCtx.fillRect(6, 6, 18, 14);

        bCtx.fillStyle = "#f85149";
        bCtx.fillRect(4, 2, 3, 4);
        bCtx.fillRect(23, 2, 3, 4);

        bCtx.fillStyle = "#ff7b72";
        bCtx.fillRect(8, 8, 4, 3);
        bCtx.fillRect(18, 8, 4, 3);

        bCtx.fillStyle = "#8b949e";
        bCtx.fillRect(2, 20, 5, 4);
        bCtx.fillRect(12, 20, 6, 4);
        bCtx.fillRect(23, 20, 5, 4);
        bugCanvas.refresh();

        // --- 7. Stash Shield Power-Up (28x28 px) ---
        const shieldCanvas = this.textures.createCanvas("stash-shield", 28, 28);
        const sCtx = shieldCanvas.context;

        sCtx.fillStyle = "#e3b341";
        sCtx.beginPath();
        sCtx.arc(14, 14, 12, 0, Math.PI * 2);
        sCtx.fill();

        sCtx.fillStyle = "#fff4bd";
        sCtx.beginPath();
        sCtx.arc(14, 14, 8, 0, Math.PI * 2);
        sCtx.fill();

        // Inner 'S' for Stash
        sCtx.fillStyle = "#6e4800";
        sCtx.font = "bold 11px monospace";
        sCtx.fillText("S", 11, 18);
        shieldCanvas.refresh();

        // --- 8. Merge Conflict Hazard Block (48x32 px) ---
        const mergeCanvas = this.textures.createCanvas("merge-hazard", 48, 32);
        const mCtx = mergeCanvas.context;

        mCtx.fillStyle = "#b31d28";
        mCtx.fillRect(0, 0, 48, 32);

        // Hazard stripes
        mCtx.fillStyle = "#e3b341";
        for (let x = -10; x < 60; x += 14) {
            mCtx.beginPath();
            mCtx.moveTo(x, 0);
            mCtx.lineTo(x + 8, 0);
            mCtx.lineTo(x, 32);
            mCtx.lineTo(x - 8, 32);
            mCtx.closePath();
            mCtx.fill();
        }

        mCtx.strokeStyle = "#ff7b72";
        mCtx.lineWidth = 2;
        mCtx.strokeRect(0, 0, 48, 32);
        mergeCanvas.refresh();

        // --- 9. Branch Portal (44x44 px) ---
        const portalCanvas = this.textures.createCanvas("portal-branch", 44, 44);
        const poCtx = portalCanvas.context;

        poCtx.fillStyle = "#6f42c1";
        poCtx.beginPath();
        poCtx.arc(22, 22, 20, 0, Math.PI * 2);
        poCtx.fill();

        poCtx.fillStyle = "#bc8cff";
        poCtx.beginPath();
        poCtx.arc(22, 22, 14, 0, Math.PI * 2);
        poCtx.fill();

        poCtx.fillStyle = "#58a6ff";
        poCtx.beginPath();
        poCtx.arc(22, 22, 7, 0, Math.PI * 2);
        poCtx.fill();
        portalCanvas.refresh();

        // --- 10. Terminal Checkpoint Post (48x64 px) ---
        const termCanvas = this.textures.createCanvas("terminal-station", 48, 64);
        const tCtx = termCanvas.context;

        tCtx.fillStyle = "#21262d";
        tCtx.fillRect(8, 20, 32, 44);

        tCtx.fillStyle = "#30363d";
        tCtx.fillRect(4, 4, 40, 28);

        tCtx.fillStyle = "#040d21";
        tCtx.fillRect(8, 8, 32, 20);

        tCtx.fillStyle = "#39ff14";
        tCtx.fillRect(12, 14, 8, 2);
        tCtx.fillRect(22, 18, 6, 2);

        tCtx.fillStyle = "#58a6ff";
        tCtx.fillRect(22, 0, 4, 4);
        termCanvas.refresh();
    }
}

// =============================================================================
// 2. MAIN MENU SCENE
// =============================================================================
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainMenuScene" });
    }

    create() {
        const { width, height } = GameConfig.display;
        this.createCyberBackground(width, height);

        const titleText = this.add.text(width / 2, 160, GameConfig.title, {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "64px",
            fontWeight: "bold",
            color: "#39ff14",
            stroke: "#0d1117",
            strokeThickness: 8,
            shadow: { offsetX: 0, offsetY: 0, color: "#2ea043", blur: 15, fill: true }
        }).setOrigin(0.5);

        this.tweens.add({
            targets: titleText,
            scale: { from: 0.98, to: 1.02 },
            duration: 1800,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });

        this.add.text(width / 2, 230, GameConfig.tagline, {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "20px",
            color: "#58a6ff",
            fontStyle: "italic"
        }).setOrigin(0.5);

        this.add.text(width / 2, 265, "[ Multimedia Systems Lab Project — Phaser 3 Edition ]", {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "14px",
            color: "#8b949e"
        }).setOrigin(0.5);

        this.createMenuButton(width / 2, 350, "▶ START QUEST", "#2ea043", () => {
            if (window.soundEngine) window.soundEngine.startBGM();
            this.scene.start("GameScene", { level: 1 });
        });

        this.createMenuButton(width / 2, 430, "📖 HOW TO PLAY", "#1f6feb", () => {
            this.scene.start("InstructionsScene");
        });

        this.createMenuButton(width / 2, 510, "⚙ DIFFICULTY: " + GameConfig.customization.difficulty, "#8957e5", (btn) => {
            this.toggleDifficulty(btn);
        });

        this.add.text(width / 2, 660, "Press [ENTER] to Start  |  [I] for Instructions  |  [M] Toggle Audio", {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "15px",
            color: "#6e7681"
        }).setOrigin(0.5);

        this.input.keyboard.on("keydown-ENTER", () => {
            if (window.soundEngine) window.soundEngine.startBGM();
            this.scene.start("GameScene", { level: 1 });
        });
        this.input.keyboard.on("keydown-I", () => this.scene.start("InstructionsScene"));
        this.input.keyboard.on("keydown-M", () => {
            if (window.soundEngine) window.soundEngine.toggleMute();
        });
    }

    createCyberBackground(width, height) {
        const bg = this.add.graphics();
        bg.fillStyle(GameConfig.colors.background, 1);
        bg.fillRect(0, 0, width, height);

        bg.lineStyle(1, 0x161b22, 0.8);
        for (let x = 0; x < width; x += 40) {
            bg.moveTo(x, 0);
            bg.lineTo(x, height);
        }
        for (let y = 0; y < height; y += 40) {
            bg.moveTo(0, y);
            bg.lineTo(width, y);
        }
        bg.strokePath();

        const binaryBits = ["0", "1", "git", "commit", "HEAD", "branch", "init", "merge", "push", "stash"];
        for (let i = 0; i < 24; i++) {
            const rx = Phaser.Math.Between(40, width - 40);
            const ry = Phaser.Math.Between(40, height - 40);
            const token = Phaser.Utils.Array.GetRandom(binaryBits);

            const bitText = this.add.text(rx, ry, token, {
                fontFamily: 'monospace',
                fontSize: Phaser.Math.Between(11, 16) + "px",
                color: "#163321"
            }).setAlpha(Phaser.Math.FloatBetween(0.2, 0.6));

            this.tweens.add({
                targets: bitText,
                y: ry - Phaser.Math.Between(40, 100),
                alpha: { from: 0.1, to: 0.5 },
                duration: Phaser.Math.Between(3000, 6000),
                yoyo: true,
                repeat: -1,
                ease: "Sine.easeInOut"
            });
        }
    }

    createMenuButton(x, y, label, baseColor, onClick) {
        const button = this.add.text(x, y, label, {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "24px",
            fontWeight: "bold",
            color: "#ffffff",
            backgroundColor: baseColor,
            padding: { left: 24, right: 24, top: 12, bottom: 12 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        button.on("pointerover", () => {
            button.setScale(1.08);
            button.setStyle({ color: "#39ff14" });
        });

        button.on("pointerout", () => {
            button.setScale(1.0);
            button.setStyle({ color: "#ffffff" });
        });

        button.on("pointerdown", () => onClick(button));
        return button;
    }

    toggleDifficulty(btnText) {
        const modes = ["EASY", "NORMAL", "HARD"];
        let currIdx = modes.indexOf(GameConfig.customization.difficulty);
        currIdx = (currIdx + 1) % modes.length;
        const newMode = modes[currIdx];

        GameConfig.customization.difficulty = newMode;
        if (newMode === "EASY") {
            GameConfig.customization.extraLives = 2;
            GameConfig.customization.scoreMultiplier = 0.8;
        } else if (newMode === "NORMAL") {
            GameConfig.customization.extraLives = 0;
            GameConfig.customization.scoreMultiplier = 1.0;
        } else {
            GameConfig.customization.extraLives = -1;
            GameConfig.customization.scoreMultiplier = 1.5;
        }
        btnText.setText("⚙ DIFFICULTY: " + newMode);
    }
}

// =============================================================================
// 3. INSTRUCTIONS SCENE
// =============================================================================
class InstructionsScene extends Phaser.Scene {
    constructor() {
        super({ key: "InstructionsScene" });
    }

    create() {
        const { width, height } = GameConfig.display;

        const bg = this.add.graphics();
        bg.fillStyle(0x0d1117, 1);
        bg.fillRect(0, 0, width, height);

        this.add.text(width / 2, 60, "MISSION BRIEFING & CONTROLS", {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "36px",
            fontWeight: "bold",
            color: "#39ff14"
        }).setOrigin(0.5);

        const panel = this.add.graphics();
        panel.fillStyle(0x161b22, 0.95);
        panel.lineStyle(2, 0x30363d, 1);
        panel.fillRoundedRect(120, 110, width - 240, 500, 12);
        panel.strokeRoundedRect(120, 110, width - 240, 500, 12);

        const briefing = [
            "STORYLINE:",
            "You are a developer trapped inside a corrupted digital Git repository.",
            "Traverse platforming levels, collect files, dodge Bug Bots & Conflict zones,",
            "and reach the Checkpoint Terminal to run real Git commands to restore the codebase!",
            "",
            "KEYBOARD CONTROLS:",
            " • Move Left / Right : [A] / [D]  or  [LEFT ARROW] / [RIGHT ARROW]",
            " • Jump              : [W] / [SPACE]  or  [UP ARROW]",
            " • Open Terminal     : Step onto the Checkpoint Terminal on the final platform",
            " • Audio Toggle      : [M] (or click the speaker button in HUD)",
            " • Pause / Resume    : [ESC]",
            "",
            "GIT CURRICULUM LEVELS:",
            " • Level 1 (Working Dir) : git init, git status",
            " • Level 2 (Staging)     : git add ., git commit -m '...', git log",
            " • Level 3 (Branching)   : git branch, git switch, git merge, git push",
            "",
            "SPECIAL POWER-UPS & HAZARDS:",
            " • Stash Shield (S)      : Absorbs next hazard hit without losing life",
            " • Branch Portals (⇄)    : Instant warp between high and low branches",
            " • Merge Conflicts (!!!) : Dangerous hazard zones that corrupt the repo"
        ].join("\n");

        this.add.text(150, 126, briefing, {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "15px",
            lineSpacing: 6,
            color: "#c9d1d9"
        });

        const backBtn = this.add.text(width / 2, 650, "⬅ RETURN TO MAIN MENU [ESC]", {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "20px",
            fontWeight: "bold",
            color: "#ffffff",
            backgroundColor: "#238636",
            padding: { left: 24, right: 24, top: 10, bottom: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        backBtn.on("pointerover", () => backBtn.setScale(1.05));
        backBtn.on("pointerout", () => backBtn.setScale(1.0));
        backBtn.on("pointerdown", () => this.scene.start("MainMenuScene"));

        this.input.keyboard.on("keydown-ESC", () => this.scene.start("MainMenuScene"));
    }
}

// =============================================================================
// 4. GAME SCENE (HANDLES LEVELS 1, 2, AND 3)
// =============================================================================
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameScene" });
    }

    init(data) {
        this.currentLevel = data && data.level ? data.level : 1;
        this.preservedScore = data && data.score ? data.score : 0;
        this.preservedLives = data && data.lives ? data.lives : (GameConfig.player.startingLives + (GameConfig.customization.extraLives || 0));
    }

    create() {
        const { width, height } = GameConfig.display;

        // Level metadata configuration
        const levelData = {
            1: {
                title: "LEVEL 1: THE WORKING DIRECTORY",
                taskBrief: "Mission: Inspect untracked files & initialize the repo with `git init` and `git status`",
                themeColor: "#238636"
            },
            2: {
                title: "LEVEL 2: THE STAGING GROUND",
                taskBrief: "Mission: Stage files, grab Stash Shield & commit snapshot with `git add` and `git commit`",
                themeColor: "#e3b341"
            },
            3: {
                title: "LEVEL 3: THE BRANCHING BATTLEFIELD",
                taskBrief: "Mission: Warp via portals, dodge merge conflicts & finish with `git branch`, `git merge`, and `git push`",
                themeColor: "#bc8cff"
            }
        };

        const currentLvlInfo = levelData[this.currentLevel] || levelData[1];
        this.levelTitle = currentLvlInfo.title;
        this.levelTimeRemaining = GameConfig.gameplay.levelTimerSeconds + (GameConfig.customization.bonusTimeSeconds || 0);

        // Notify challenge manager of active level
        if (window.challengeManager) {
            window.challengeManager.loadLevel(this.currentLevel);
        }

        // Set World & Camera boundaries (2400px wide)
        this.levelWidth = 2400;
        this.physics.world.setBounds(0, 0, this.levelWidth, height);
        this.cameras.main.setBounds(0, 0, this.levelWidth, height);

        // 1. Draw level background
        this.buildLevelBackground(currentLvlInfo);

        // 2. Build platforms group
        this.buildPlatforms();

        // 3. Spawn Player entity using OOP Player class
        this.player = new Player(this, 120, height - 200);
        this.player.score = this.preservedScore;
        this.player.lives = this.preservedLives;

        // 4. Smooth Camera follow
        this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);

        // 5. Add platform collision with player
        this.physics.add.collider(this.player.sprite, this.platforms);

        // 6. Spawn Level specific objects (Collectibles, Hazards, Stash Shield, Portals)
        this.spawnObjects();

        // 7. Place Terminal Checkpoint directly on the last platform
        this.placeTerminalOnLastPlatform(height);

        // 8. Input Controls setup
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = {
            W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };

        // Audio Toggle Shortcut (M key)
        this.input.keyboard.on("keydown-M", () => {
            if (window.soundEngine) {
                const muted = window.soundEngine.toggleMute();
                if (this.soundBtn) {
                    this.soundBtn.setText(muted ? "🔇 SOUND [M]" : "🔊 SOUND [M]");
                }
            }
        });

        // Pause Key (ESC)
        this.input.keyboard.on("keydown-ESC", () => {
            if (window.terminalUI && window.terminalUI.isOpen) {
                window.terminalUI.close();
            } else {
                this.scene.pause("GameScene");
                this.scene.launch("PauseScene");
            }
        });

        // 9. Level Countdown Timer
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.tickTimer,
            callbackScope: this,
            loop: true
        });

        // 10. Build HUD
        this.buildHUD(width);
        this.updateHUD();

        // Start BGM on level launch if not muted
        if (window.soundEngine && !window.soundEngine.isPlayingBGM) {
            window.soundEngine.startBGM();
        }
    }

    buildLevelBackground(lvlInfo) {
        const height = GameConfig.display.height;
        const bg = this.add.graphics();

        bg.fillStyle(0x0d1117, 1);
        bg.fillRect(0, 0, this.levelWidth, height);

        bg.lineStyle(1, 0x161b22, 0.6);
        for (let x = 0; x < this.levelWidth; x += 50) {
            bg.moveTo(x, 0);
            bg.lineTo(x, height);
        }
        for (let y = 0; y < height; y += 50) {
            bg.moveTo(0, y);
            bg.lineTo(this.levelWidth, y);
        }
        bg.strokePath();

        // Floating cinematic level intro card (pinned to camera, fades out after 4 seconds)
        const introContainer = this.add.container(GameConfig.display.width / 2, 90);
        introContainer.setScrollFactor(0);

        const cardBg = this.add.graphics();
        cardBg.fillStyle(0x161b22, 0.9);
        cardBg.lineStyle(1, Phaser.Display.Color.HexStringToColor(lvlInfo.themeColor).color, 0.8);
        cardBg.fillRoundedRect(-360, 0, 720, 56, 8);
        cardBg.strokeRoundedRect(-360, 0, 720, 56, 8);
        introContainer.add(cardBg);

        const titleTxt = this.add.text(0, 11, lvlInfo.title, {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "18px",
            fontWeight: "bold",
            color: lvlInfo.themeColor
        }).setOrigin(0.5, 0);
        introContainer.add(titleTxt);

        const briefTxt = this.add.text(0, 33, lvlInfo.taskBrief, {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "12px",
            color: "#c9d1d9"
        }).setOrigin(0.5, 0);
        introContainer.add(briefTxt);

        this.time.delayedCall(4000, () => {
            this.tweens.add({
                targets: introContainer,
                alpha: 0,
                duration: 900,
                onComplete: () => introContainer.destroy()
            });
        });
    }

    buildPlatforms() {
        this.platforms = this.physics.add.staticGroup();
        const height = GameConfig.display.height;

        // Solid Ground (64px tiles)
        for (let x = 0; x < this.levelWidth; x += 64) {
            const groundTile = this.platforms.create(x + 32, height - 32, "ground-block");
            groundTile.refreshBody();
        }

        // Floating circuit platforms tailored for reachable jumps
        this.platformLayout = [
            { x: 280, y: height - 160, tiles: 3 },
            { x: 540, y: height - 250, tiles: 4 },
            { x: 860, y: height - 190, tiles: 3 },
            { x: 1140, y: height - 280, tiles: 4 },
            { x: 1460, y: height - 210, tiles: 3 },
            { x: 1740, y: height - 290, tiles: 4 },
            { x: 2020, y: height - 200, tiles: 5 } // Final platform holding the terminal
        ];

        this.platformLayout.forEach(plat => {
            for (let i = 0; i < plat.tiles; i++) {
                const px = plat.x + (i * 64);
                const tile = this.platforms.create(px, plat.y, "platform-circuit");
                tile.refreshBody();
            }
        });
    }

    placeTerminalOnLastPlatform(height) {
        const lastPlat = this.platformLayout[this.platformLayout.length - 1];
        const termX = lastPlat.x + (lastPlat.tiles * 32);
        const termY = lastPlat.y - 32;

        this.terminalCheckpoint = this.physics.add.staticSprite(termX, termY, "terminal-station");
        this.physics.add.overlap(this.player.sprite, this.terminalCheckpoint, this.handleTerminalOverlap, null, this);

        const promptBanner = this.add.text(termX, termY - 55, "▶ CHECKPOINT TERMINAL\n[ Step Here to Open Git Bash ]", {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "14px",
            fontWeight: "bold",
            color: "#39ff14",
            backgroundColor: "#161b22",
            padding: { left: 8, right: 8, top: 4, bottom: 4 },
            align: "center"
        }).setOrigin(0.5);

        this.tweens.add({
            targets: promptBanner,
            y: promptBanner.y - 8,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }

    spawnObjects() {
        this.collectibles = [];
        this.bugs = [];
        this.hazards = [];
        this.portals = [];

        // Knowledge tips discovered when collecting file tokens in the world
        const knowledgeTips = {
            1: [
                "📖 PROTOCOL DISCOVERED: 'git init' -> Initializes a new Git repository",
                "📖 PROTOCOL DISCOVERED: 'git status' -> Inspects working tree & untracked files",
                "📖 PROTOCOL DISCOVERED: Run 'git init' then 'git status' at the terminal checkpoint!"
            ],
            2: [
                "📖 PROTOCOL DISCOVERED: 'git add .' -> Stages all modified files for snapshot",
                "📖 PROTOCOL DISCOVERED: 'git commit -m \"msg\"' -> Records a repository snapshot",
                "📖 PROTOCOL DISCOVERED: 'git log --oneline' -> Inspects commit history log"
            ],
            3: [
                "📖 PROTOCOL DISCOVERED: 'git branch <name>' -> Creates a new isolated branch",
                "📖 PROTOCOL DISCOVERED: 'git switch <name>' -> Switches active working branch",
                "📖 PROTOCOL DISCOVERED: 'git merge <name>' & 'git push' -> Integrates branch & syncs remote"
            ]
        };
        const currentTips = knowledgeTips[this.currentLevel] || knowledgeTips[1];

        // 1. Collectibles with associated knowledge tokens
        const tokenPositions = [
            { x: 320, y: 520, type: "file", tip: currentTips[0] },
            { x: 600, y: 430, type: "crystal" },
            { x: 920, y: 490, type: "file", tip: currentTips[1] },
            { x: 1220, y: 400, type: "crystal" },
            { x: 1520, y: 470, type: "file", tip: currentTips[2] },
            { x: 1820, y: 390, type: "crystal" }
        ];

        tokenPositions.forEach(pos => {
            if (pos.type === "crystal") {
                const crystal = new CommitCrystal(this, pos.x, pos.y);
                this.physics.add.overlap(this.player.sprite, crystal.sprite, () => {
                    crystal.collect(this.player);
                    this.updateHUD();
                });
                this.collectibles.push(crystal);
            } else {
                const token = new FileToken(this, pos.x, pos.y, pos.tip);
                this.physics.add.overlap(this.player.sprite, token.sprite, () => {
                    token.collect(this.player);
                    this.updateHUD();
                });
                this.collectibles.push(token);
            }
        });

        // In-world Holographic Command Data Beacons (displayed during platforming)
        const holographicCommands = {
            1: [
                { x: 400, y: 500, cmd: "git init", desc: "Initialize empty repo" },
                { x: 1000, y: 440, cmd: "git status", desc: "Check untracked files" }
            ],
            2: [
                { x: 400, y: 500, cmd: "git add .", desc: "Stage modified files" },
                { x: 1000, y: 440, cmd: "git commit -m \"msg\"", desc: "Save snapshot" },
                { x: 1600, y: 420, cmd: "git log --oneline", desc: "View commit log" }
            ],
            3: [
                { x: 400, y: 500, cmd: "git branch feature", desc: "Create branch" },
                { x: 980, y: 440, cmd: "git switch feature", desc: "Switch branch" },
                { x: 1600, y: 420, cmd: "git merge & git push", desc: "Integrate & sync" }
            ]
        };

        const levelHolo = holographicCommands[this.currentLevel] || holographicCommands[1];
        levelHolo.forEach(h => {
            const holoTag = this.add.text(h.x, h.y, `[DATA BEACON]\n${h.cmd}\n(${h.desc})`, {
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: "12px",
                fontWeight: "bold",
                color: "#58a6ff",
                backgroundColor: "#161b22",
                padding: { left: 8, right: 8, top: 4, bottom: 4 },
                align: "center"
            }).setOrigin(0.5);

            this.tweens.add({
                targets: holoTag,
                y: h.y - 8,
                duration: 1200,
                yoyo: true,
                repeat: -1,
                ease: "Sine.easeInOut"
            });
        });

        // 2. Patrolling Bug Bots
        const bugPositions = [
            { x: 620, y: 440, dist: 80 },
            { x: 1220, y: 410, dist: 90 },
            { x: 1800, y: 400, dist: 90 }
        ];

        bugPositions.forEach(b => {
            const bug = new BugBot(this, b.x, b.y, b.dist);
            this.physics.add.collider(bug.sprite, this.platforms);
            this.physics.add.overlap(this.player.sprite, bug.sprite, () => {
                const isAlive = this.player.takeDamage(1);
                this.updateHUD();
                if (!isAlive) {
                    this.handleGameOver();
                }
            });
            this.bugs.push(bug);
        });

        // 3. Stash Shield Power-Up (Levels 2 & 3)
        if (this.currentLevel >= 2) {
            const shield = new StashShield(this, 940, 480);
            this.physics.add.overlap(this.player.sprite, shield.sprite, () => {
                shield.collect(this.player);
                this.updateHUD();
            });
            this.collectibles.push(shield);
        }

        // 4. Merge Conflict Hazard (Level 3)
        if (this.currentLevel === 3) {
            const conflict1 = new MergeConflictHazard(this, 1020, 500);
            this.physics.add.overlap(this.player.sprite, conflict1.sprite, () => {
                conflict1.hitPlayer(this.player);
                this.updateHUD();
            });
            this.hazards.push(conflict1);

            // 5. Branch Portals (Level 3: Warp between low and high platforms)
            const portal1 = new BranchPortal(this, 700, 640, 1160, 400, "FEATURE BRANCH");
            this.physics.add.overlap(this.player.sprite, portal1.sprite, () => {
                portal1.warp(this.player);
            });
            this.portals.push(portal1);
        }
    }

    /**
     * Particle effect: Burst of glowing sparkles at given coordinate.
     */
    createSparkles(x, y, color = 0x39ff14) {
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const dist = Phaser.Math.Between(16, 32);
            const dot = this.add.graphics();
            dot.fillStyle(color, 1);
            dot.fillCircle(0, 0, Phaser.Math.Between(2, 4));
            dot.setPosition(x, y);

            this.tweens.add({
                targets: dot,
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist,
                alpha: 0,
                duration: Phaser.Math.Between(350, 600),
                onComplete: () => dot.destroy()
            });
        }
    }

    /**
     * Particle effect: Puffs of dust when jumping or landing.
     */
    createDustPuff(x, y) {
        for (let i = 0; i < 4; i++) {
            const dust = this.add.graphics();
            dust.fillStyle(0x8b949e, 0.7);
            dust.fillCircle(0, 0, 3);
            dust.setPosition(x + (i * 6 - 9), y);

            this.tweens.add({
                targets: dust,
                y: y - 10,
                alpha: 0,
                duration: 300,
                onComplete: () => dust.destroy()
            });
        }
    }

    /**
     * Displays a floating notification banner when the player collects a Git knowledge token.
     */
    showKnowledgeToast(tipText) {
        if (!tipText) return;

        // Container pinned to camera so it's always in view
        const toast = this.add.container(GameConfig.display.width / 2, 85);
        toast.setScrollFactor(0);

        const toastBg = this.add.graphics();
        toastBg.fillStyle(0x0d1117, 0.95);
        toastBg.lineStyle(2, 0x39ff14, 0.9);
        toastBg.fillRoundedRect(-360, 0, 720, 44, 8);
        toastBg.strokeRoundedRect(-360, 0, 720, 44, 8);
        toast.add(toastBg);

        const label = this.add.text(0, 22, tipText, {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "13px",
            fontWeight: "bold",
            color: "#39ff14"
        }).setOrigin(0.5);
        toast.add(label);

        // Slide down and fade out
        toast.setAlpha(0);
        toast.y = 65;
        this.tweens.add({
            targets: toast,
            alpha: 1,
            y: 85,
            duration: 250,
            onComplete: () => {
                this.time.delayedCall(3200, () => {
                    this.tweens.add({
                        targets: toast,
                        alpha: 0,
                        y: 65,
                        duration: 350,
                        onComplete: () => toast.destroy()
                    });
                });
            }
        });
    }

    buildHUD(screenWidth) {
        this.hudContainer = this.add.container(0, 0);
        this.hudContainer.setScrollFactor(0);

        const hudBg = this.add.graphics();
        hudBg.fillStyle(0x161b22, 0.94);
        hudBg.fillRect(0, 0, screenWidth, 54);
        hudBg.lineStyle(1, 0x30363d, 1);
        hudBg.moveTo(0, 54);
        hudBg.lineTo(screenWidth, 54);
        hudBg.strokePath();
        this.hudContainer.add(hudBg);

        // 1. Lives Display (strictly hearts, fixed position)
        this.livesText = this.add.text(20, 16, this.formatLivesText(), {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "16px",
            fontWeight: "bold",
            color: "#f85149"
        });
        this.hudContainer.add(this.livesText);

        // 2. Dedicated Stash Shield Badge (never overlaps with lives or score)
        this.shieldBadge = this.add.text(175, 13, "🛡️ SHIELD: ON", {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "12px",
            fontWeight: "bold",
            color: "#e3b341",
            backgroundColor: "#21262d",
            padding: { left: 8, right: 8, top: 4, bottom: 4 }
        });
        this.shieldBadge.setVisible(false);
        this.hudContainer.add(this.shieldBadge);

        // 3. Score Display (placed comfortably at x = 330)
        this.scoreText = this.add.text(330, 16, "SCORE: 0000", {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "16px",
            fontWeight: "bold",
            color: "#e3b341"
        });
        this.hudContainer.add(this.scoreText);

        // 4. Timer Display (centered at screenWidth / 2 = 640)
        this.timerText = this.add.text(screenWidth / 2, 16, `⏱ TIME: ${this.levelTimeRemaining}s`, {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "16px",
            fontWeight: "bold",
            color: "#58a6ff"
        }).setOrigin(0.5, 0);
        this.hudContainer.add(this.timerText);

        // 5. Sound Toggle Button (placed at screenWidth - 300)
        const isMuted = window.soundEngine ? window.soundEngine.isMuted : false;
        this.soundBtn = this.add.text(screenWidth - 300, 12, isMuted ? "🔇 AUDIO [M]" : "🔊 AUDIO [M]", {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "13px",
            fontWeight: "bold",
            color: "#8b949e",
            backgroundColor: "#21262d",
            padding: { left: 8, right: 8, top: 5, bottom: 5 }
        })
        .setInteractive({ useHandCursor: true });

        this.soundBtn.on("pointerdown", () => {
            if (window.soundEngine) {
                const muted = window.soundEngine.toggleMute();
                this.soundBtn.setText(muted ? "🔇 AUDIO [M]" : "🔊 AUDIO [M]");
            }
        });
        this.hudContainer.add(this.soundBtn);

        // 6. Level Badge (placed at screenWidth - 20, setOrigin(1, 0))
        const lvlNames = { 1: "WORKING DIR", 2: "STAGING", 3: "BRANCHING" };
        const lvlBadgeStr = `[ LVL ${this.currentLevel}: ${lvlNames[this.currentLevel] || "SECTOR"} ]`;
        this.stageBadge = this.add.text(screenWidth - 20, 12, lvlBadgeStr, {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "13px",
            fontWeight: "bold",
            color: "#39ff14",
            backgroundColor: "#161b22",
            padding: { left: 8, right: 8, top: 5, bottom: 5 }
        }).setOrigin(1, 0);
        this.hudContainer.add(this.stageBadge);
    }

    formatLivesText() {
        const hearts = "♥ ".repeat(Math.max(0, this.player ? this.player.lives : 3)).trim();
        return `LIVES: ${hearts}`;
    }

    updateHUD() {
        if (this.livesText && this.player) {
            this.livesText.setText(this.formatLivesText());
        }
        if (this.shieldBadge && this.player) {
            this.shieldBadge.setVisible(!!this.player.hasStashShield);
        }
        if (this.scoreText && this.player) {
            const padded = String(this.player.score).padStart(4, "0");
            this.scoreText.setText(`SCORE: ${padded}`);
        }
        if (this.timerText) {
            this.timerText.setText(`⏱ TIME: ${this.levelTimeRemaining}s`);
            if (this.levelTimeRemaining <= 20) {
                this.timerText.setColor("#f85149");
            } else {
                this.timerText.setColor("#58a6ff");
            }
        }
        if (this.stageBadge) {
            const lvlNames = { 1: "WORKING DIR", 2: "STAGING", 3: "BRANCHING" };
            this.stageBadge.setText(`[ LVL ${this.currentLevel}: ${lvlNames[this.currentLevel] || "SECTOR"} ]`);
        }
        if (this.soundBtn && window.soundEngine) {
            this.soundBtn.setText(window.soundEngine.isMuted ? "🔇 AUDIO [M]" : "🔊 AUDIO [M]");
        }
    }

    tickTimer() {
        this.levelTimeRemaining--;
        this.updateHUD();

        if (this.levelTimeRemaining <= 0) {
            this.timerEvent.remove();
            const alive = this.player.takeDamage(1);
            this.updateHUD();
            if (!alive) {
                this.handleGameOver();
            } else {
                this.levelTimeRemaining = 30;
            }
        }
    }

    handleTerminalOverlap() {
        if (window.terminalUI && !window.terminalUI.isOpen) {
            if (this.player && this.player.sprite) {
                this.player.sprite.setVelocity(0, 0);
            }
            window.terminalUI.open(this);
        }
    }

    proceedToNextLevel() {
        if (this.player) {
            this.player.destroy();
        }

        if (this.currentLevel < 3) {
            const nextLvl = this.currentLevel + 1;
            this.scene.restart({
                level: nextLvl,
                score: this.player ? this.player.score : 0,
                lives: this.player ? this.player.lives : 3
            });
        } else {
            // Stop continuous background music upon victory!
            if (window.soundEngine) {
                window.soundEngine.stopBGM();
            }
            this.scene.start("VictoryScene", {
                finalScore: this.player ? this.player.score : 1000
            });
        }
    }

    handleGameOver() {
        if (window.soundEngine) {
            window.soundEngine.stopBGM();
        }
        if (this.player) {
            this.player.destroy();
        }
        this.scene.start("MainMenuScene");
    }

    update() {
        if (this.player && (!window.terminalUI || !window.terminalUI.isOpen)) {
            this.player.update(this.cursors, this.wasd);
        }

        if (this.bugs) {
            this.bugs.forEach(bug => bug.update());
        }
    }
}

// =============================================================================
// 5. VICTORY SCENE
// =============================================================================
class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: "VictoryScene" });
    }

    init(data) {
        this.finalScore = data && data.finalScore ? data.finalScore : 1000;
    }

    create() {
        const { width, height } = GameConfig.display;

        if (window.soundEngine) {
            window.soundEngine.stopBGM();
            window.soundEngine.playSuccess();
        }

        const bg = this.add.graphics();
        bg.fillStyle(0x0d1117, 1);
        bg.fillRect(0, 0, width, height);

        const banner = this.add.text(width / 2, 130, "★ REPOSITORY RESTORED! ★", {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "50px",
            fontWeight: "bold",
            color: "#39ff14",
            stroke: "#0d1117",
            strokeThickness: 8
        }).setOrigin(0.5);

        this.tweens.add({
            targets: banner,
            scale: { from: 0.98, to: 1.02 },
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        this.add.text(width / 2, 200, "Every Commit Counted. Every Branch Found Its Master.", {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "20px",
            color: "#58a6ff",
            fontStyle: "italic"
        }).setOrigin(0.5);

        const panel = this.add.graphics();
        panel.fillStyle(0x161b22, 0.95);
        panel.lineStyle(2, 0x2ea043, 1);
        panel.fillRoundedRect(width / 2 - 300, 240, 600, 310, 10);
        panel.strokeRoundedRect(width / 2 - 300, 240, 600, 310, 10);

        const summary = [
            `FINAL SCORE : ${this.finalScore} PTS`,
            `GIT STATUS  : 100% CLEAN WORKING TREE`,
            `BRANCHES    : MAIN & FEATURE MERGED CLEANLY`,
            `HEAD        : SYNCED & PUSHED TO ORIGIN`,
            "",
            "Demonstrated Git Competencies:",
            "  ✔ git init (Created repository)",
            "  ✔ git status (Working tree check)",
            "  ✔ git add & git commit (Recorded snapshot)",
            "  ✔ git log --oneline (Reviewed history)",
            "  ✔ git branch & git switch (Context isolation)",
            "  ✔ git merge & git push (Reconciliation & remote)"
        ].join("\n");

        this.add.text(width / 2, 395, summary, {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "16px",
            color: "#f0f6fc",
            align: "center",
            lineSpacing: 7
        }).setOrigin(0.5);

        const restartBtn = this.add.text(width / 2, 600, "PLAY AGAIN [ENTER]", {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "22px",
            fontWeight: "bold",
            color: "#ffffff",
            backgroundColor: "#2ea043",
            padding: { left: 24, right: 24, top: 12, bottom: 12 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        restartBtn.on("pointerover", () => restartBtn.setScale(1.05));
        restartBtn.on("pointerout", () => restartBtn.setScale(1.0));
        restartBtn.on("pointerdown", () => this.scene.start("MainMenuScene"));

        this.input.keyboard.on("keydown-ENTER", () => this.scene.start("MainMenuScene"));
    }
}

// =============================================================================
// 6. PAUSE SCENE (MODAL OVERLAY)
// =============================================================================
class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: "PauseScene" });
    }

    create() {
        const { width, height } = GameConfig.display;

        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.75);
        overlay.fillRect(0, 0, width, height);

        const box = this.add.graphics();
        box.fillStyle(0x161b22, 0.95);
        box.lineStyle(2, 0x30363d, 1);
        box.fillRoundedRect(width / 2 - 200, height / 2 - 180, 400, 360, 10);
        box.strokeRoundedRect(width / 2 - 200, height / 2 - 180, 400, 360, 10);

        this.add.text(width / 2, height / 2 - 130, "SYSTEM PAUSED", {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "28px",
            fontWeight: "bold",
            color: "#e3b341"
        }).setOrigin(0.5);

        this.createPauseButton(width / 2, height / 2 - 50, "RESUME QUEST", "#2ea043", () => {
            this.resumeGame();
        });

        this.createPauseButton(width / 2, height / 2 + 25, "RESTART LEVEL", "#1f6feb", () => {
            this.scene.stop("PauseScene");
            this.scene.stop("GameScene");
            this.scene.start("GameScene", { level: 1 });
        });

        this.createPauseButton(width / 2, height / 2 + 100, "EXIT TO MAIN MENU", "#da3633", () => {
            if (window.soundEngine) {
                window.soundEngine.stopBGM();
            }
            this.scene.stop("PauseScene");
            this.scene.stop("GameScene");
            this.scene.start("MainMenuScene");
        });

        this.input.keyboard.on("keydown-ESC", () => {
            this.resumeGame();
        });
    }

    resumeGame() {
        this.scene.stop("PauseScene");
        this.scene.resume("GameScene");
    }

    createPauseButton(x, y, label, bgColor, onClick) {
        const btn = this.add.text(x, y, label, {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "18px",
            fontWeight: "bold",
            color: "#ffffff",
            backgroundColor: bgColor,
            padding: { left: 20, right: 20, top: 10, bottom: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        btn.on("pointerover", () => btn.setScale(1.05));
        btn.on("pointerout", () => btn.setScale(1.0));
        btn.on("pointerdown", onClick);
        return btn;
    }
}
