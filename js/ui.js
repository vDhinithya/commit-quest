/**
 * COMMIT QUEST — Terminal UI Controller (ui.js)
 * 
 * Manages the interactive DOM terminal interface.
 * Ensures player keystrokes in the terminal never leak into Phaser gameplay physics.
 * Integrates GitEngine simulation and ChallengeManager evaluation.
 */

class TerminalUI {
    /**
     * @param {GitEngine} gitEngine 
     * @param {ChallengeManager} challengeManager 
     */
    constructor(gitEngine, challengeManager) {
        this.git = gitEngine;
        this.challenges = challengeManager;
        this.isOpen = false;
        this.activeGameScene = null;

        // Command history buffers
        this.history = [];
        this.historyIndex = -1;

        // DOM element references
        this.overlay = document.getElementById("terminal-overlay");
        this.outputArea = document.getElementById("terminal-output");
        this.inputField = document.getElementById("terminal-input");

        this.setupEventListeners();
    }

    /**
     * Attaches keyboard and UI event handlers.
     */
    setupEventListeners() {
        if (!this.inputField) return;

        // Command execution on [ENTER]
        this.inputField.addEventListener("keydown", (e) => {
            // Prevent keystrokes from bubbling to Phaser or triggering browser defaults
            e.stopPropagation();

            if (e.key === "Enter") {
                const command = this.inputField.value;
                this.inputField.value = "";
                this.handleCommandSubmit(command);
            } else if (e.key === "ArrowUp") {
                // Command history navigation: PREVIOUS
                e.preventDefault();
                if (this.history.length > 0 && this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    this.inputField.value = this.history[this.history.length - 1 - this.historyIndex];
                }
            } else if (e.key === "ArrowDown") {
                // Command history navigation: NEXT
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.inputField.value = this.history[this.history.length - 1 - this.historyIndex];
                } else if (this.historyIndex === 0) {
                    this.historyIndex = -1;
                    this.inputField.value = "";
                }
            } else if (e.key === "Escape") {
                this.close();
            } else if (e.key === "Tab") {
                // Command auto-complete
                e.preventDefault();
                this.autoComplete();
            }
        });

        // Close on clicking backdrop or ESC
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.isOpen) {
                this.close();
            }
        });
    }

    /**
     * Opens the interactive terminal overlay and captures focus.
     * @param {Phaser.Scene} scene Reference to active GameScene
     */
    open(scene) {
        this.isOpen = true;
        this.activeGameScene = scene;

        // Disable Phaser's keyboard listeners so typing doesn't move the avatar
        if (scene && scene.input && scene.input.keyboard) {
            scene.input.keyboard.enabled = false;
        }

        this.overlay.style.display = "flex";
        this.inputField.focus();

        // Print welcome header and current mission
        this.renderMissionHeader();
    }

    /**
     * Closes terminal overlay and restores game input.
     */
    close() {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.overlay.style.display = "none";

        // Restore Phaser keyboard input
        if (this.activeGameScene && this.activeGameScene.input && this.activeGameScene.input.keyboard) {
            this.activeGameScene.input.keyboard.enabled = true;
        }
    }

    /**
     * Displays current level briefing and task instructions in the terminal.
     */
    renderMissionHeader() {
        const lvl = this.challenges.getCurrentLevel();
        const task = this.challenges.getCurrentTask();

        this.outputArea.innerHTML = "";
        this.println(`================================================================`, "#30363d");
        this.println(` REPOSITORY CHECKPOINT: ${lvl.title}`, "#39ff14");
        this.println(` Mission: ${lvl.description}`, "#8b949e");
        this.println(`----------------------------------------------------------------`, "#30363d");

        if (task) {
            this.println(`[MISSION OBJECTIVE] ${task.prompt}`, "#58a6ff");
            this.println(`Execute the corresponding Git command below and press [ENTER] (type 'hint' or 'help'):`, "#e3b341");
        } else {
            this.println(`All sector tasks completed!`, "#39ff14");
        }
        this.println("");
    }

    /**
     * Submits and validates a Git command.
     */
    handleCommandSubmit(cmd) {
        const trimmed = cmd.trim();
        if (!trimmed) return;

        // Record into history
        this.history.push(trimmed);
        this.historyIndex = -1;

        // Echo command line
        this.println(`dev@repo:~$ ${trimmed}`, "#f0f6fc");

        // Handle 'hint' command
        if (trimmed.toLowerCase() === "hint") {
            const task = this.challenges.getCurrentTask();
            if (task && task.hint) {
                this.println(`💡 Discovered Command Hint: ${task.hint}`, "#e3b341");
            } else {
                this.println("No active hint available for this sector.", "#8b949e");
            }
            return;
        }

        // Execute via GitEngine
        const result = this.git.execute(trimmed);

        if (result.output === "__CLEAR__") {
            this.outputArea.innerHTML = "";
            this.renderMissionHeader();
            return;
        }

        // Print engine output
        if (result.output) {
            this.println(result.output);
        }

        // Evaluate challenge progression
        if (result.success) {
            const evalResult = this.challenges.evaluate();

            if (evalResult.advanced) {
                // Play triumphant victory sound
                if (window.soundEngine) window.soundEngine.playSuccess();

                // Award player points
                if (this.activeGameScene && this.activeGameScene.player) {
                    this.activeGameScene.player.addScore(GameConfig.gameplay.scoring.gitChallengeSuccess);
                    this.activeGameScene.player.addXP(100);
                    this.activeGameScene.updateHUD();
                }

                this.println(`\n${evalResult.message}`, "#39ff14");

                // Check if level was completely cleared
                if (evalResult.isLevelComplete) {
                    this.handleLevelCompleted();
                }
            }
        } else {
            // Play error buzz sound
            if (window.soundEngine) window.soundEngine.playFailure();

            // Deduct penalty on syntax/state error
            if (this.activeGameScene && this.activeGameScene.player) {
                this.activeGameScene.player.addScore(GameConfig.gameplay.scoring.gitChallengeFailure);
                this.activeGameScene.updateHUD();
            }

            const currentTask = this.challenges.getCurrentTask();
            if (currentTask && currentTask.hint) {
                this.println(`💡 Hint: ${currentTask.hint}`, "#e3b341");
            }
        }

        // Auto-scroll to bottom of terminal output
        const body = document.getElementById("terminal-body");
        if (body) {
            body.scrollTop = body.scrollHeight;
        }
    }

    /**
     * Handles sequence when a level is completed via terminal.
     */
    handleLevelCompleted() {
        this.println(`\n>> ACCESS GRANTED: Checkpoint passed! Teleporting to next sector in 2 seconds...`, "#39ff14");
        this.inputField.disabled = true;

        setTimeout(() => {
            this.inputField.disabled = false;
            this.close();

            if (this.activeGameScene) {
                // Award level completion bonus points
                this.activeGameScene.player.addScore(GameConfig.gameplay.scoring.levelCompleteBonus);
                this.activeGameScene.proceedToNextLevel();
            }
        }, 2200);
    }

    /**
     * Appends a line of text to the terminal output area.
     */
    println(text, color = null) {
        const line = document.createElement("div");
        line.style.whiteSpace = "pre-wrap";
        line.style.marginBottom = "4px";
        if (color) {
            line.style.color = color;
        }
        line.innerHTML = text;
        this.outputArea.appendChild(line);
    }

    /**
     * Auto-completes standard git commands on TAB press.
     */
    autoComplete() {
        const val = this.inputField.value;
        const candidates = [
            "git init",
            "git status",
            "git add .",
            "git add feature.js",
            "git commit -m \"first commit\"",
            "git log --oneline",
            "git branch feature",
            "git switch feature",
            "git switch main",
            "git merge feature",
            "git push",
            "clear",
            "help"
        ];

        const match = candidates.find(c => c.startsWith(val));
        if (match) {
            this.inputField.value = match;
        }
    }
}
