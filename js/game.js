window.addEventListener("DOMContentLoaded", () => {
    window.gitEngine = new GitEngine();
    window.challengeManager = new ChallengeManager(window.gitEngine);
    window.terminalUI = new TerminalUI(window.gitEngine, window.challengeManager);

    const phaserConfig = {
        type: Phaser.AUTO,
        width: GameConfig.display.width,
        height: GameConfig.display.height,
        parent: "game-container",
        backgroundColor: GameConfig.display.backgroundColor,
        pixelArt: true,

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

        scene: [
            BootScene,
            MainMenuScene,
            InstructionsScene,
            GameScene,
            VictoryScene,
            PauseScene
        ]
    };

    try {
        window.game = new Phaser.Game(phaserConfig);
    } catch (err) {
        console.error("Failed to initialize Phaser game:", err);
    }
});
