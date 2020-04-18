const EPSILON = .2;
const SPEED = 5;

class Step2 extends BaseStep {
    constructor() {
        super({key: 'step2'});
    }

    preload() {
        this.load.setBaseURL('http://labs.phaser.io');

        this.load.image('hotspot', 'assets/sprites/tomato.png');
        this.load.spritesheet('dude', 
            'assets/sprites/dude.png',
            { frameWidth: 32, frameHeight: 48 });
    }

    create(data) {
        this.addInstructions('Step 2: put in a warm area (70°-85° F).');

        // Add thermometer.
        this._thermometer = this.add.text(780, 580, '68°', this._textStyle);
        this._thermometer.setOrigin(1, 1).setAlign('right').setFontSize(22);

        player = this.physics.add.sprite(data.x, data.y, 'dude');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.properties = {
            weight: 20.0,
            fermented: 5.0,
            temperature: 68,
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
        const hot_spot_x = 4; //Math.floor(Math.random() * game.config.width / 50);
        const hot_spot_y = 8; //Math.floor(Math.random() * game.config.height / 50);
        const hotspot = this.physics.add.group({
            key: 'hotspot',
            repeat: 9,
        });
        hotspot.temperature = 140;
        Phaser.Actions.GridAlign(hotspot.getChildren(), {
            width: 3,
            height: 3,
            cellWidth: 50,
            cellHeight: 50,
            x: 150,
            y: 350,
        });
        let tween = this.tweens.add({
            targets: hotspot.getChildren(),
            duration: 3000,
            alpha: {start: .5, to: 1},
            repeat: -1,
            yoyo: true,
        });
        this.physics.add.overlap(
            player, hotspot, this.incrementTemp, null, this);
    }

    incrementTemp(player, hotspot) {
        this.moveTempTowards(140);
    }

    moveTempTowards(target) {
        if (player.properties.temperature <= target) {
            player.properties.temperature += .1;
        }
        if (player.properties.temperature > target) {
            player.properties.temperature -= .1;
        }
        this._thermometer.setText(
            `${Math.floor(player.properties.temperature)}°`);
    }

    update() {
        if (cursors.left.isDown) {
            player.setVelocityX(-60);
            player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(60);
            player.anims.play('right', true);
        } else if (cursors.up.isDown) {
            player.setVelocityY(-60);
            player.anims.play('right', true);
        } else if (cursors.down.isDown) {
            player.setVelocityY(60);
            player.anims.play('left', true);
        } else {
            player.anims.play('turn');
        }

        this.moveTempTowards(68);
    }
}
