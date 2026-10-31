/**
 * COMMIT QUEST — Configuration File (config.js)
 * 
 * Central configuration holding all game parameters, physics values, scoring rules,
 * level settings, and instructor customization options.
 * 
 * Designed using clean JavaScript object structures so any student or instructor
 * can easily tweak gameplay values without digging through scene logic.
 */

const GameConfig = {
    // Game Identity
    title: "COMMIT QUEST",
    tagline: "Every Commit Counts. Every Branch Tells a Story.",
    version: "1.0.0",

    // Display & Canvas Configuration
    display: {
        width: 1280,
        height: 720,
        backgroundColor: "#0d1117" // GitHub / Terminal dark aesthetic
    },

    // Physics Settings (Phaser Arcade Physics)
    physics: {
        gravityY: 850,
        playerSpeed: 260,
        jumpForce: -480,
        terminalVelocity: 600
    },

    // Player Initial Attributes
    player: {
        startingLives: 3,
        invulnerabilityDurationMs: 1500, // Safe window after taking damage
        flashRateMs: 100                 // Visual blinking effect when invulnerable
    },

    // Level Timing & Scoring Rules
    gameplay: {
        levelTimerSeconds: 120,
        scoring: {
            basicCollectible: 10,       // File token collected
            rareCollectible: 25,        // Commit crystal collected
            gitChallengeSuccess: 100,   // Successful Git command execution
            gitChallengeFailure: -20,   // Erroneous command penalty
            levelCompleteBonus: 200,    // Completing an entire stage
            timeBonusMultiplier: 2      // Bonus points per remaining second
        }
    },

    // Instructor Customization Hook (can be updated without modifying core game logic)
    customization: {
        difficulty: "NORMAL",                 // Options: "EASY", "NORMAL", "HARD"
        startingLives: 3,                     // Overrides player starting lives (e.g. 1, 3, 5)
        extraLives: 0,                        // Additional bonus lives
        bonusTimeSeconds: 0,                  // Extra time added to level timers
        scoringMultiplier: 1.0,               // Multiplier applied to all points
        specialCollectiblesMultiplier: 1.0,   // Point multiplier for crystals and shields
        extraHazardsEnabled: false,           // Toggle additional hazard obstacles
        invincibleCheat: false                // Toggle true for uninterrupted grading demonstration
    },

    // Color Palette (Cyberpunk / Terminal Retro Palette)
    colors: {
        background: 0x0d1117,
        panelBg: 0x161b22,
        primaryGreen: 0x2ea043,         // Git commit green
        terminalGreen: 0x00ff66,        // Retro phosphor green
        cyanAccent: 0x58a6ff,           // Git branch blue / cyan
        purpleAccent: 0xbc8cff,         // Git merge purple
        dangerRed: 0xf85149,            // Bug / hazard red
        warningYellow: 0xe3b341,        // Stash / warning yellow
        textLight: "#f0f6fc",
        textMuted: "#8b949e",
        textTerminal: "#39ff14"
    }
};

// Prevent accidental modification of base configuration during runtime
if (typeof Object.freeze === "function") {
    Object.freeze(GameConfig.display);
    Object.freeze(GameConfig.colors);
}
