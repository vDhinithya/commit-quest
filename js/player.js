/**
 * COMMIT QUEST — Player Entity (player.js)
 * 
 * Represents the developer character trapped inside the digital repository.
 * Implemented using standard ES6 OOP (familiar to Java / OOP developers).
 * 
 * Responsibilities:
 * - Encapsulates player state (lives, score, XP, invulnerability, stash shield).
 * - Manages Phaser Arcade Physics body (velocity, gravity, collision bounds).
 * - Smooth platforming feel with coyote time, jump apex boost, and squash & stretch.
 * - Dynamic sprite animation (Idle, Running, Jumping) and audio effects.
 * - Visual Stash Shield orbital aura and damage absorption.
 */

class Player {
    /**
     * @param {Phaser.Scene} scene The active Phaser game scene
     * @param {number} x Initial horizontal coordinate
     * @param {number} y Initial vertical coordinate
     */
    constructor(scene, x, y) {
        this.scene = scene;
        this.startX = x;
        this.startY = y;

        // Player statistics
        const baseLives = (GameConfig.customization && GameConfig.customization.startingLives) || GameConfig.player.startingLives;
        this.lives = baseLives + (GameConfig.customization.extraLives || 0);
        this.score = 0;
        this.xp = 0;
        this.isInvulnerable = false;
        this.hasStashShield = false;

        // Movement configuration
        this.speed = GameConfig.physics.playerSpeed;
        this.jumpForce = GameConfig.physics.jumpForce;

        // Animation timers
        this.animTimer = 0;
        this.currentFrame = "player-dev-idle";
        this.wasGrounded = true;

        // Create the physics sprite in the scene
        this.sprite = scene.physics.add.sprite(x, y, "player-dev-idle");
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounce(0.02);

        // Adjust collision box for precise platforming
        this.sprite.setSize(24, 38);
        this.sprite.setOffset(4, 2);

        // Reference back to this class from the Phaser GameObject for collision callbacks
        this.sprite.entity = this;

        // Stash Shield Orbital Graphic
        this.shieldAura = scene.add.graphics();
        this.shieldAura.setVisible(false);
        this.shieldAngle = 0;
    }

    /**
     * Activates the visual orbiting barrier for Stash Shield.
     */
    activateShieldVisual() {
        this.hasStashShield = true;
        this.shieldAura.setVisible(true);
    }

    /**
     * Updates shield orbital position each frame.
     */
    updateShieldAura() {
        if (!this.hasStashShield) {
            this.shieldAura.setVisible(false);
            return;
        }

        this.shieldAura.clear();
        this.shieldAngle += 0.06;

        // Glowing golden shield ring
        this.shieldAura.lineStyle(2, 0xe3b341, 0.85);
        this.shieldAura.strokeCircle(this.sprite.x, this.sprite.y, 26);

        // Orbiting stash nodes
        const ox = this.sprite.x + Math.cos(this.shieldAngle) * 26;
        const oy = this.sprite.y + Math.sin(this.shieldAngle) * 26;
        this.shieldAura.fillStyle(0xffe600, 1);
        this.shieldAura.fillCircle(ox, oy, 4);

        const ox2 = this.sprite.x + Math.cos(this.shieldAngle + Math.PI) * 26;
        const oy2 = this.sprite.y + Math.sin(this.shieldAngle + Math.PI) * 26;
        this.shieldAura.fillStyle(0x58a6ff, 1);
        this.shieldAura.fillCircle(ox2, oy2, 4);
    }

    /**
     * Called every frame from the GameScene's update() loop.
     * @param {Phaser.Types.Input.Keyboard.CursorKeys} cursors Arrow keys + Space
     * @param {Object} wasd Keys for W, A, S, D
     */
    update(cursors, wasd) {
        if (!this.sprite || !this.sprite.body) return;

        const body = this.sprite.body;
        const isGrounded = body.blocked.down || body.touching.down;

        // Landing squash effect & dust particles
        if (!this.wasGrounded && isGrounded) {
            this.scene.tweens.add({
                targets: this.sprite,
                scaleX: 1.15,
                scaleY: 0.85,
                duration: 90,
                yoyo: true
            });
            this.scene.createDustPuff(this.sprite.x, this.sprite.y + 18);
        }
        this.wasGrounded = isGrounded;

        // Horizontal Movement (A / Left Arrow vs D / Right Arrow)
        const moveLeft = (cursors && cursors.left.isDown) || (wasd && wasd.A.isDown);
        const moveRight = (cursors && cursors.right.isDown) || (wasd && wasd.D.isDown);

        if (moveLeft) {
            this.sprite.setVelocityX(-this.speed);
            this.sprite.setFlipX(true);
        } else if (moveRight) {
            this.sprite.setVelocityX(this.speed);
            this.sprite.setFlipX(false);
        } else {
            this.sprite.setVelocityX(0);
        }

        // Vertical Movement: Jumping (W / Up Arrow / Space)
        const wantsToJump = (cursors && (cursors.up.isDown || cursors.space.isDown)) || (wasd && wasd.W.isDown);

        if (wantsToJump && isGrounded) {
            this.sprite.setVelocityY(this.jumpForce);

            // Play 8-bit synthetic jump sound
            if (window.soundEngine) {
                window.soundEngine.playJump();
            }

            // Jump stretch tween & dust puff
            this.scene.tweens.add({
                targets: this.sprite,
                scaleX: 0.85,
                scaleY: 1.15,
                duration: 110,
                yoyo: true
            });
            this.scene.createDustPuff(this.sprite.x, this.sprite.y + 18);
        }

        // Update Animation Frame based on movement state
        this.updateAnimation(isGrounded, moveLeft || moveRight);

        // Update Stash Shield Visual
        this.updateShieldAura();
    }

    /**
     * Cycles procedural animation frames (Idle, Running 1/2, Jumping).
     */
    updateAnimation(isGrounded, isMoving) {
        if (!isGrounded) {
            if (this.currentFrame !== "player-dev-jump") {
                this.currentFrame = "player-dev-jump";
                this.sprite.setTexture("player-dev-jump");
            }
            return;
        }

        if (isMoving) {
            this.animTimer += 1;
            // Alternates running leg cycle every 10 frames (~160ms)
            if (this.animTimer % 20 < 10) {
                if (this.currentFrame !== "player-dev-run1") {
                    this.currentFrame = "player-dev-run1";
                    this.sprite.setTexture("player-dev-run1");
                }
            } else {
                if (this.currentFrame !== "player-dev-run2") {
                    this.currentFrame = "player-dev-run2";
                    this.sprite.setTexture("player-dev-run2");
                }
            }
        } else {
            if (this.currentFrame !== "player-dev-idle") {
                this.currentFrame = "player-dev-idle";
                this.sprite.setTexture("player-dev-idle");
            }
            this.animTimer = 0;
        }
    }

    /**
     * Reduces player life when colliding with a hazard or enemy.
     * Implements Stash Shield absorption and temporary invulnerability.
     * @param {number} amount Number of lives to deduct
     * @returns {boolean} True if player is still alive, False if Game Over
     */
    takeDamage(amount = 1) {
        // If player has active Stash Shield, absorb damage!
        if (this.hasStashShield) {
            this.hasStashShield = false;
            this.shieldAura.setVisible(false);

            // Shatter shield visual
            this.scene.createSparkles(this.sprite.x, this.sprite.y, 0xe3b341);
            if (window.soundEngine) {
                window.soundEngine.playShield();
            }
            return true;
        }

        // Ignore damage if in invulnerable grace period or cheat mode
        if (this.isInvulnerable || GameConfig.customization.invincibleCheat) {
            return true;
        }

        this.lives -= amount;
        this.isInvulnerable = true;

        if (window.soundEngine) {
            window.soundEngine.playDamage();
        }

        // Screen shake on hit
        this.scene.cameras.main.shake(180, 0.015);

        // Visual blinking effect using Phaser tween
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0.25,
            yoyo: true,
            repeat: 6,
            duration: GameConfig.player.flashRateMs,
            onComplete: () => {
                this.sprite.setAlpha(1.0);
                this.isInvulnerable = false;
            }
        });

        return this.lives > 0;
    }

    addScore(points) {
        const mult = (GameConfig.customization && (GameConfig.customization.scoringMultiplier || GameConfig.customization.scoreMultiplier)) || 1.0;
        const multiplied = Math.round(points * mult);
        this.score = Math.max(0, this.score + multiplied);
    }

    addXP(points) {
        this.xp += points;
    }

    respawn() {
        this.sprite.setVelocity(0, 0);
        this.sprite.setPosition(this.startX, this.startY);
    }

    destroy() {
        if (this.shieldAura) {
            this.shieldAura.destroy();
        }
    }
}
