const EPSILON = .2;
const SPEED = 5;

class Step2 extends BaseStep {
    constructor() {
        super({key: 'step2'});
    }

    preload() {
        this.load.setBaseURL('http://labs.phaser.io');

        this.load.image('flour', 'assets/sprites/tomato.png');
        this.load.spritesheet('dude', 
            'assets/sprites/dude.png',
            { frameWidth: 32, frameHeight: 48 });
    }

    create(data) {
        this.addInstructions('Step 2: put in a warm area (70°-85° F).');

        player = this.add.sprite(data.x, data.y, 'dude');
        player.properties = {
            weight: 20.0,
            fermented: 5.0,
            velocityX: 0,
            velocityY: 0,
        };

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // User input.
        cursors = this.input.keyboard.createCursorKeys();
        
        // Add warm spot.
        const hot_spot_x = Math.floor(Math.random() * game.config.width / 50);
        const hot_spot_y = Math.floor(Math.random() * game.config.height / 50);
        var graphics = this.add.graphics();
        graphics.fillStyle(0xff0000, .5);
        graphics.fillRect(hot_spot_x * 50, hot_spot_y * 50, 50, 50);
        for (let i = hot_spot_x - 2; i <= hot_spot_x + 2; ++i) {
            for (let j = hot_spot_y - 2; j <= hot_spot_y + 2; ++j) {
                const centralness = 2 - Math.max(
                    Math.abs(i - hot_spot_x), Math.abs(j - hot_spot_y));
                graphics.fillStyle(0xff0000, .4 + .1 * centralness);
                graphics.fillRect(i * 50, j * 50, 50, 50);
            }
        }
        let tween = this.tweens.add({
            targets: graphics,
            duration: 3000,
            alpha: {start: .5, to: 1},
            repeat: -1,
            yoyo: true,
        });
    }

    update() {
        if (cursors.left.isDown) {
            player.properties.velocityX = -SPEED;
            player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            player.properties.velocityX = SPEED;
            player.anims.play('right', true);
        } else if (cursors.up.isDown) {
            player.properties.velocityY = -SPEED;
            player.anims.play('right', true);
        } else if (cursors.down.isDown) {
            player.properties.velocityY = SPEED;
            player.anims.play('left', true);
        } else {
            if (player.properties.velocityX > 0) {
                player.properties.velocityX -= .1;
            } else if (player.properties.velocityX < 0) {
                player.properties.velocityX += .1;
            }
            if (player.properties.velocityY > 0) {
                player.properties.velocityY -= .1;
            } else if (player.properties.velocityY < 0) {
                player.properties.velocityY += .1;
            }
            if (Math.abs(player.properties.velocityX) < EPSILON) {
                player.properties.velocityX = 0;
            }
            if (Math.abs(player.properties.velocityY) < EPSILON) {
                player.properties.velocityY = 0;
            }
            if (player.properties.velocityX == 0 & player.properties.velocityY == 0) {
                player.anims.play('turn');
            }
        }

        player.x += player.properties.velocityX;
        player.y += player.properties.velocityY;
    }
}
