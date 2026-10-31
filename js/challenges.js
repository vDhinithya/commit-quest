/**
 * COMMIT QUEST — Challenge Manager (challenges.js)
 * 
 * Defines the educational objectives and criteria for each level.
 * Formulates tasks as software engineering goals (rather than spoiling raw commands).
 * Evaluates the GitEngine state to determine when a challenge is complete,
 * awards scoring (+100 for correct steps, -20 for errors),
 * and triggers level progression.
 */

class ChallengeManager {
    /**
     * @param {GitEngine} gitEngine 
     */
    constructor(gitEngine) {
        this.git = gitEngine;
        this.currentLevel = 1;
        this.currentStep = 0;
        this.isCompleted = false;

        // Challenge definitions mapped by Level
        // Tasks present real development goals; commands are discovered in the platforming game world.
        this.levels = {
            1: {
                title: "LEVEL 1: THE WORKING DIRECTORY",
                description: "Initialize the corrupted digital repository and inspect its untracked files.",
                tasks: [
                    {
                        prompt: "Task 1: Initialize an empty Git repository in this working directory.",
                        hint: "Command discovered in Sector 1: git init",
                        validator: (git) => git.isInitialized
                    },
                    {
                        prompt: "Task 2: Check the repository status to inspect untracked project files.",
                        hint: "Command discovered in Sector 1: git status",
                        validator: (git) => git.statusChecked
                    }
                ],
                successMessage: "🎉 REPOSITORY INITIALIZED! Working tree inspection verified.\nProceeding to Level 2: The Staging Ground..."
            },
            2: {
                title: "LEVEL 2: THE STAGING GROUND",
                description: "Stage untracked files and record your snapshot with a commit.",
                tasks: [
                    {
                        prompt: "Task 1: Stage all modified and untracked files for the upcoming snapshot.",
                        hint: "Command discovered in Sector 2: git add .  (or git add <file>)",
                        validator: (git) => git.stagingArea.size > 0 || git.commits.length > 0
                    },
                    {
                        prompt: "Task 2: Record a repository snapshot with a descriptive commit message.",
                        hint: "Command discovered in Sector 2: git commit -m \"message\"",
                        validator: (git) => git.commits.length >= 1
                    },
                    {
                        prompt: "Task 3: Inspect your commit history log in one-line summary format.",
                        hint: "Command discovered in Sector 2: git log --oneline  (or git log)",
                        validator: (git) => git.commits.length >= 1
                    }
                ],
                successMessage: "🎉 COMMIT RECORDED! History preserved in HEAD.\nProceeding to Level 3: The Branching Battlefield..."
            },
            3: {
                title: "LEVEL 3: THE BRANCHING BATTLEFIELD",
                description: "Create an isolated feature branch, switch context, and merge back to main.",
                tasks: [
                    {
                        prompt: "Task 1: Create an isolated development branch named 'feature'.",
                        hint: "Command discovered in Sector 3: git branch feature",
                        validator: (git) => git.branches.includes("feature")
                    },
                    {
                        prompt: "Task 2: Switch your active working context to the 'feature' branch.",
                        hint: "Command discovered in Sector 3: git switch feature  (or git checkout feature)",
                        validator: (git) => git.currentBranch === "feature"
                    },
                    {
                        prompt: "Task 3: Return to the 'main' branch and merge 'feature' into it.",
                        hint: "Commands: First run 'git switch main', then 'git merge feature'",
                        validator: (git) => git.currentBranch === "main" && git.commits.some(c => c.message.includes("Merge"))
                    },
                    {
                        prompt: "Task 4: Push the synchronized commits to the remote origin repository.",
                        hint: "Command discovered in Sector 3: git push",
                        validator: (git) => git.hasPushed
                    }
                ],
                successMessage: "🏆 VICTORY! You have conquered Git and restored the repository!\nYou are a Certified Git Master!"
            }
        };
    }

    /**
     * Sets the active level and resets step progress.
     */
    loadLevel(levelNumber) {
        this.currentLevel = levelNumber;
        this.currentStep = 0;
        this.isCompleted = false;
        this.git.reset(levelNumber);
    }

    /**
     * Gets the definition for the active level.
     */
    getCurrentLevel() {
        return this.levels[this.currentLevel];
    }

    /**
     * Gets the active task object.
     */
    getCurrentTask() {
        const lvl = this.getCurrentLevel();
        if (!lvl || this.currentStep >= lvl.tasks.length) return null;
        return lvl.tasks[this.currentStep];
    }

    /**
     * Evaluates whether the user's latest command satisfied the active task.
     * @returns {{ advanced: boolean, isLevelComplete: boolean, message: string }}
     */
    evaluate() {
        const task = this.getCurrentTask();
        if (!task) {
            return { advanced: false, isLevelComplete: true, message: "Level complete!" };
        }

        if (task.validator(this.git)) {
            this.currentStep++;
            const lvl = this.getCurrentLevel();

            if (this.currentStep >= lvl.tasks.length) {
                this.isCompleted = true;
                return {
                    advanced: true,
                    isLevelComplete: true,
                    message: lvl.successMessage
                };
            }

            const nextTask = this.getCurrentTask();
            return {
                advanced: true,
                isLevelComplete: false,
                message: `[TASK COMPLETE! +100 XP]\nNext Task: ${nextTask.prompt}`
            };
        }

        return {
            advanced: false,
            isLevelComplete: false,
            message: ""
        };
    }
}
