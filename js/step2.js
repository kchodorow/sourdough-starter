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

        console.log(data.x);
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
    }

    update() {
        if (cursors.left.isDown) {
            player.properties.velocityX = -SPEED;
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown) {
            player.properties.velocityX = SPEED;
            player.anims.play('right', true);
        }
        else {
            if (player.properties.velocityX > 0) {
                player.properties.velocityX--;
            } else if (player.properties.velocityX < 0) {
                player.properties.velocityX++;
            }
            else {
                player.anims.play('turn');
            }
        }

        player.x += player.properties.velocityX;
    }
}
