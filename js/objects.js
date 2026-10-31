/**
 * COMMIT QUEST — Gameplay Objects (objects.js)
 * 
 * Defines collectibles, hazards, power-ups, and interactive entities:
 * 1. FileToken: Basic collectible (+10 score, small floating pulse).
 * 2. CommitCrystal: Rare collectible (+25 score, glowing rotation).
 * 3. BugBot: Enemy hazard (patrols back and forth on platforms, deals -1 life).
 * 4. StashShield: Power-up (absorbs next hazard damage with protective aura).
 * 5. MergeConflictHazard: Obstacle representing unresolved code conflicts.
 * 6. BranchPortal: Teleportation gateway between repository branches.
 */

class FileToken {
    constructor(scene, x, y, knowledgeTip = null) {
        this.scene = scene;
        this.knowledgeTip = knowledgeTip;
        this.sprite = scene.physics.add.staticSprite(x, y, "token-file");
        this.value = GameConfig.gameplay.scoring.basicCollectible;

        scene.tweens.add({
            targets: this.sprite,
            y: y - 8,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });
    }

    collect(player) {
        if (window.soundEngine) window.soundEngine.playCollect();
        player.addScore(this.value);
        player.addXP(10);

        // Spawn sparkle particle effect
        this.scene.createSparkles(this.sprite.x, this.sprite.y, 0x58a6ff);

        // If this token holds a discovered command, display on the game part!
        if (this.knowledgeTip && this.scene.showKnowledgeToast) {
            this.scene.showKnowledgeToast(this.knowledgeTip);
        }

        this.sprite.destroy();
    }
}

class CommitCrystal {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.physics.add.staticSprite(x, y, "crystal-commit");
        this.value = GameConfig.gameplay.scoring.rareCollectible;

        scene.tweens.add({
            targets: this.sprite,
            y: y - 10,
            scale: { from: 0.9, to: 1.15 },
            duration: 900,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });
    }

    collect(player) {
        if (window.soundEngine) window.soundEngine.playCrystal();
        player.addScore(this.value);
        player.addXP(25);

        // Spawn purple burst particle effect
        this.scene.createSparkles(this.sprite.x, this.sprite.y, 0xbc8cff);
        this.sprite.destroy();
    }
}

class StashShield {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.physics.add.staticSprite(x, y, "stash-shield");

        scene.tweens.add({
            targets: this.sprite,
            y: y - 8,
            scale: { from: 0.95, to: 1.1 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });
    }

    collect(player) {
        if (window.soundEngine) window.soundEngine.playShield();
        player.hasStashShield = true;
        player.addScore(15);
        player.activateShieldVisual();

        this.scene.createSparkles(this.sprite.x, this.sprite.y, 0xe3b341);
        this.sprite.destroy();
    }
}

class BugBot {
    constructor(scene, x, y, patrolDistance = 140) {
        this.scene = scene;
        this.startX = x;
        this.patrolDistance = patrolDistance;
        this.speed = 70;

        this.sprite = scene.physics.add.sprite(x, y, "hazard-bug");
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setVelocityX(this.speed);
        this.sprite.setBounce(1, 0);

        this.sprite.entity = this;
    }

    update() {
        if (!this.sprite || !this.sprite.body) return;

        if (this.sprite.x > this.startX + this.patrolDistance) {
            this.sprite.setVelocityX(-this.speed);
            this.sprite.setFlipX(true);
        } else if (this.sprite.x < this.startX - this.patrolDistance) {
            this.sprite.setVelocityX(this.speed);
            this.sprite.setFlipX(false);
        }
    }

    hitPlayer(player) {
        const damaged = player.takeDamage(1);
        if (damaged && window.soundEngine) {
            window.soundEngine.playDamage();
        }
    }
}

class MergeConflictHazard {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.physics.add.staticSprite(x, y, "merge-hazard");

        // Pulsing warning glitch effect
        scene.tweens.add({
            targets: this.sprite,
            alpha: { from: 0.7, to: 1.0 },
            duration: 400,
            yoyo: true,
            repeat: -1
        });
    }

    hitPlayer(player) {
        const damaged = player.takeDamage(1);
        if (damaged && window.soundEngine) {
            window.soundEngine.playDamage();
        }
    }
}

class BranchPortal {
    constructor(scene, x, y, destinationX, destinationY, label = "PORTAL") {
        this.scene = scene;
        this.destinationX = destinationX;
        this.destinationY = destinationY;

        this.sprite = scene.physics.add.staticSprite(x, y, "portal-branch");

        // Swirling animation
        scene.tweens.add({
            targets: this.sprite,
            angle: 360,
            duration: 4000,
            repeat: -1,
            ease: "Linear"
        });

        // Floating label
        scene.add.text(x, y - 40, `⇄ ${label}`, {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "12px",
            fontWeight: "bold",
            color: "#bc8cff"
        }).setOrigin(0.5);
    }

    warp(player) {
        if (this.isCoolingDown) return;
        this.isCoolingDown = true;

        if (window.soundEngine) window.soundEngine.playWarp();
        this.scene.createSparkles(player.sprite.x, player.sprite.y, 0xbc8cff);

        // Teleport player
        player.sprite.setPosition(this.destinationX, this.destinationY);
        player.sprite.setVelocity(0, 0);

        this.scene.createSparkles(this.destinationX, this.destinationY, 0x39ff14);

        // Cooldown to prevent infinite bounce
        setTimeout(() => {
            this.isCoolingDown = false;
        }, 1200);
    }
}
