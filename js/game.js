/**
 * COMMIT QUEST — Game Initialization (game.js)
 * 
 * Sets up the Phaser.Game instance, registers scenes, and wires up
 * the Git simulation engine and terminal UI controller.
 */

window.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Git simulation engine and UI bridge
    window.gitEngine = new GitEngine();
    window.challengeManager = new ChallengeManager(window.gitEngine);
    window.terminalUI = new TerminalUI(window.gitEngine, window.challengeManager);

    // 2. Phaser 3 Game Configuration
    const phaserConfig = {
        type: Phaser.AUTO,
        width: GameConfig.display.width,
        height: GameConfig.display.height,
        parent: "game-container",
        backgroundColor: GameConfig.display.backgroundColor,
        pixelArt: true, // Crisp retro pixel rendering without smoothing blur

        physics: {
            default: "arcade",
            arcade: {
                gravity: { y: GameConfig.physics.gravityY },
                debug: false
            }
        },

        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },

        // Registered Game Scenes
        scene: [
            BootScene,          // 1. Procedural pixel art generation
            MainMenuScene,      // 2. Title screen & options
            InstructionsScene,  // 3. Mission briefing & controls
            GameScene,          // 4. Core gameplay (Levels 1, 2, 3)
            VictoryScene,       // 5. Game cleared / Repository restored
            PauseScene          // 6. Pause modal overlay
        ]
    };

    try {
        window.game = new Phaser.Game(phaserConfig);
        console.log("🎮 COMMIT QUEST initialized successfully with interactive Git engine.");
    } catch (err) {
        console.error("Failed to initialize Phaser game:", err);
    }
});
