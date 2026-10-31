/**
 * COMMIT QUEST — Git Engine (gitEngine.js)
 * 
 * A pure JavaScript simulation of a Git repository.
 * Completely decoupled from Phaser so it is easy to understand, test,
 * and explain during a college lab evaluation.
 * 
 * Supported commands:
 * - git init
 * - git status
 * - git add <file> / git add .
 * - git commit -m "message"
 * - git log / git log --oneline
 * - git branch / git branch <name>
 * - git switch <name> / git checkout <name>
 * - git merge <name>
 * - git push
 * - clear / help
 */

class GitEngine {
    constructor() {
        this.reset();
    }

    /**
     * Resets repository to an uninitialized state with dummy files in the working directory.
     */
    reset(level = 1) {
        this.isInitialized = false;

        // Working directory contains untracked files based on level
        if (level === 1) {
            this.workingDirectory = ["index.html", "style.css", "main.js"];
        } else if (level === 2) {
            this.isInitialized = true;
            this.workingDirectory = ["feature.js", "README.md"];
        } else {
            this.isInitialized = true;
            this.workingDirectory = ["conflict_module.js"];
        }

        this.stagingArea = new Set();
        this.commits = [];
        this.branches = ["main"];
        this.currentBranch = "main";
        this.branchHeads = { "main": null };
        this.statusChecked = false;
        this.hasPushed = false;
    }

    /**
     * Main execution entry point. Parses command arguments and routes to handler.
     * @param {string} rawInput User command line input
     * @returns {{ success: boolean, output: string }}
     */
    execute(rawInput) {
        const input = (rawInput || "").trim();
        if (!input) return { success: true, output: "" };

        // Handle terminal utility commands
        if (input.toLowerCase() === "clear") {
            return { success: true, output: "__CLEAR__" };
        }
        if (input.toLowerCase() === "help") {
            return {
                success: true,
                output: [
                    "Available Git Commands:",
                    "  git init                  - Initialize a new local repository",
                    "  git status                - Show working tree status",
                    "  git add <file> | .        - Stage changes for next commit",
                    "  git commit -m \"message\"   - Record staged snapshot to repository",
                    "  git log [--oneline]       - Show commit history",
                    "  git branch [name]         - List or create branches",
                    "  git switch | checkout <b> - Switch branches",
                    "  git merge <branch>        - Merge branch into current branch",
                    "  git push                  - Push commits to remote origin",
                    "  clear                     - Clear terminal screen"
                ].join("\n")
            };
        }

        // Must start with 'git'
        if (!input.startsWith("git")) {
            return {
                success: false,
                output: `bash: command not found: ${input.split(" ")[0]}. Did you mean 'git'? Type 'help' for guidance.`
            };
        }

        // Tokenize command line preserving quotes in -m "commit message"
        const tokens = this.tokenize(input);
        const subCommand = tokens[1];

        // Ensure repo is initialized for all commands except 'init'
        if (subCommand !== "init" && !this.isInitialized) {
            return {
                success: false,
                output: "fatal: not a git repository (or any of the parent directories): .git\nRun 'git init' to initialize a repository."
            };
        }

        switch (subCommand) {
            case "init":
                return this.handleInit();
            case "status":
                return this.handleStatus();
            case "add":
                return this.handleAdd(tokens.slice(2));
            case "commit":
                return this.handleCommit(tokens.slice(2));
            case "log":
                return this.handleLog(tokens.slice(2));
            case "branch":
                return this.handleBranch(tokens.slice(2));
            case "switch":
            case "checkout":
                return this.handleSwitch(tokens.slice(2));
            case "merge":
                return this.handleMerge(tokens.slice(2));
            case "push":
                return this.handlePush(tokens.slice(2));
            default:
                return {
                    success: false,
                    output: `git: '${subCommand}' is not a recognized git command. See 'help'.`
                };
        }
    }

    /**
     * Splits string by spaces while preserving double-quoted substrings.
     */
    tokenize(str) {
        const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
        const tokens = [];
        let match;
        while ((match = regex.exec(str)) !== null) {
            tokens.push(match[1] || match[2] || match[0]);
        }
        return tokens;
    }

    // --- Command Handlers ---

    handleInit() {
        if (this.isInitialized) {
            return {
                success: true,
                output: "Reinitialized existing Git repository in /repo/.git/"
            };
        }
        this.isInitialized = true;
        this.branchHeads[this.currentBranch] = null;
        return {
            success: true,
            output: "Initialized empty Git repository in /repo/.git/\nSwitched to default branch: 'main'"
        };
    }

    handleStatus() {
        this.statusChecked = true;
        const lines = [`On branch ${this.currentBranch}`];

        if (this.commits.length === 0) {
            lines.push("No commits yet\n");
        } else {
            lines.push("");
        }

        // Staged changes
        if (this.stagingArea.size > 0) {
            lines.push("Changes to be committed:");
            lines.push("  (use \"git restore --staged <file>...\" to unstage)");
            this.stagingArea.forEach(file => {
                lines.push(`\t<span style="color:#2ea043;">new file:   ${file}</span>`);
            });
            lines.push("");
        }

        // Untracked files
        const untracked = this.workingDirectory.filter(f => !this.stagingArea.has(f));
        if (untracked.length > 0) {
            lines.push("Untracked files:");
            lines.push("  (use \"git add <file>...\" to include in what will be committed)");
            untracked.forEach(file => {
                lines.push(`\t<span style="color:#f85149;">${file}</span>`);
            });
            lines.push("");
        }

        if (this.stagingArea.size === 0 && untracked.length === 0) {
            lines.push("nothing to commit, working tree clean");
        }

        return { success: true, output: lines.join("\n") };
    }

    handleAdd(args) {
        if (!args || args.length === 0) {
            return { success: false, output: "Nothing specified, nothing added.\nUsage: git add <filename> or git add ." };
        }

        const target = args[0];
        if (target === "." || target === "-A" || target === "*") {
            // Stage all untracked files
            this.workingDirectory.forEach(f => this.stagingArea.add(f));
            return { success: true, output: `Staged ${this.stagingArea.size} file(s) for commit.` };
        }

        if (this.workingDirectory.includes(target)) {
            this.stagingArea.add(target);
            return { success: true, output: `Staged '${target}'.` };
        }

        return { success: false, output: `fatal: pathspec '${target}' did not match any files.` };
    }

    handleCommit(args) {
        if (this.stagingArea.size === 0) {
            return {
                success: false,
                output: "no changes added to commit (use \"git add\" to stage)"
            };
        }

        let message = "";
        const mIndex = args.indexOf("-m");
        if (mIndex !== -1 && args[mIndex + 1]) {
            message = args[mIndex + 1].trim();
        }

        if (!message) {
            return {
                success: false,
                output: "error: switch `m' requires a non-empty commit message.\nUsage: git commit -m \"Your commit message\""
            };
        }

        // Generate pseudo-SHA hash
        const shortHash = Math.random().toString(16).substring(2, 9);
        const filesCount = this.stagingArea.size;

        const newCommit = {
            hash: shortHash,
            message: message,
            branch: this.currentBranch,
            timestamp: new Date().toLocaleTimeString(),
            files: Array.from(this.stagingArea)
        };

        this.commits.push(newCommit);
        this.branchHeads[this.currentBranch] = newCommit;

        // Clear staged files from working directory
        this.workingDirectory = this.workingDirectory.filter(f => !this.stagingArea.has(f));
        this.stagingArea.clear();

        return {
            success: true,
            output: `[${this.currentBranch} ${shortHash}] ${message}\n ${filesCount} file(s) changed, ${filesCount * 12} insertions(+)`
        };
    }

    handleLog(args) {
        if (this.commits.length === 0) {
            return { success: false, output: `fatal: your current branch '${this.currentBranch}' does not have any commits yet` };
        }

        const isOneLine = args.includes("--oneline");
        const lines = [];

        // Reverse to show latest first
        const branchCommits = [...this.commits].reverse();

        branchCommits.forEach((c, idx) => {
            const headTag = (idx === 0) ? ` <span style="color:#58a6ff;">(HEAD -> ${this.currentBranch})</span>` : "";
            if (isOneLine) {
                lines.push(`<span style="color:#e3b341;">${c.hash}</span>${headTag} ${c.message}`);
            } else {
                lines.push(`<span style="color:#e3b341;">commit ${c.hash}</span>${headTag}`);
                lines.push(`Author: Developer <dev@commitquest.repo>`);
                lines.push(`Date:   ${c.timestamp}\n`);
                lines.push(`    ${c.message}\n`);
            }
        });

        return { success: true, output: lines.join("\n") };
    }

    handleBranch(args) {
        if (args.length === 0) {
            // List branches
            const lines = this.branches.map(b => {
                if (b === this.currentBranch) {
                    return `<span style="color:#39ff14;">* ${b}</span>`;
                }
                return `  ${b}`;
            });
            return { success: true, output: lines.join("\n") };
        }

        const newBranch = args[0];
        if (this.branches.includes(newBranch)) {
            return { success: false, output: `fatal: a branch named '${newBranch}' already exists.` };
        }

        this.branches.push(newBranch);
        this.branchHeads[newBranch] = this.branchHeads[this.currentBranch];
        return { success: true, output: `Created branch '${newBranch}'.` };
    }

    handleSwitch(args) {
        if (args.length === 0) {
            return { success: false, output: "fatal: missing branch name. Usage: git switch <branch-name>" };
        }

        const target = args[0];
        if (!this.branches.includes(target)) {
            return { success: false, output: `error: pathspec '${target}' did not match any branch known to git.` };
        }

        this.currentBranch = target;
        return { success: true, output: `Switched to branch '${target}'` };
    }

    handleMerge(args) {
        if (args.length === 0) {
            return { success: false, output: "fatal: no branch specified for merge. Usage: git merge <branch-name>" };
        }

        const source = args[0];
        if (!this.branches.includes(source)) {
            return { success: false, output: `merge: ${source} - not something we can merge` };
        }

        if (source === this.currentBranch) {
            return { success: true, output: "Already up to date." };
        }

        // Fast-forward merge simulation
        const mergeHash = Math.random().toString(16).substring(2, 9);
        const mergeCommit = {
            hash: mergeHash,
            message: `Merge branch '${source}' into ${this.currentBranch}`,
            branch: this.currentBranch,
            timestamp: new Date().toLocaleTimeString(),
            files: ["resolved_conflict.js"]
        };
        this.commits.push(mergeCommit);
        this.branchHeads[this.currentBranch] = mergeCommit;

        return {
            success: true,
            output: `Updating ${this.commits[0] ? this.commits[0].hash : 'HEAD'}..${mergeHash}\nFast-forward\n Merge successful! Branch '${source}' integrated into '${this.currentBranch}'.`
        };
    }

    handlePush(args) {
        if (this.commits.length === 0) {
            return { success: false, output: "fatal: no commits found to push." };
        }
        this.hasPushed = true;
        return {
            success: true,
            output: `Enumerating objects: ${this.commits.length * 3}, done.\nWriting objects: 100% (${this.commits.length * 3}/${this.commits.length * 3}), done.\nTo https://github.com/developer/commit-quest.git\n * [new branch]      ${this.currentBranch} -> ${this.currentBranch}`
        };
    }
}
