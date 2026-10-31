// Game settings and rules
const GameConfig = {
    title: "COMMIT QUEST",
    tagline: "Every Commit Counts. Every Branch Tells a Story.",
    version: "1.0.0",

    display: {
        width: 1280,
        height: 720,
        backgroundColor: "#0d1117"
    },

    physics: {
        gravityY: 850,
        playerSpeed: 260,
        jumpForce: -480,
        terminalVelocity: 600
    },

    player: {
        startingLives: 3,
        invulnerabilityDurationMs: 1500,
        flashRateMs: 100
    },

    gameplay: {
        levelTimerSeconds: 120,
        scoring: {
            basicCollectible: 10,
            rareCollectible: 25,
            gitChallengeSuccess: 100,
            gitChallengeFailure: -20,
            levelCompleteBonus: 200,
            timeBonusMultiplier: 2
        }
    },

    customization: {
        difficulty: "NORMAL",
        startingLives: 3,
        extraLives: 0,
        bonusTimeSeconds: 0,
        scoringMultiplier: 1.0,
        specialCollectiblesMultiplier: 1.0,
        extraHazardsEnabled: false,
        invincibleCheat: false
    },

    colors: {
        background: 0x0d1117,
        panelBg: 0x161b22,
        primaryGreen: 0x2ea043,
        terminalGreen: 0x00ff66,
        cyanAccent: 0x58a6ff,
        purpleAccent: 0xbc8cff,
        dangerRed: 0xf85149,
        warningYellow: 0xe3b341,
        textLight: "#f0f6fc",
        textMuted: "#8b949e",
        textTerminal: "#39ff14"
    }
};

if (typeof Object.freeze === "function") {
    Object.freeze(GameConfig.display);
    Object.freeze(GameConfig.colors);
}
