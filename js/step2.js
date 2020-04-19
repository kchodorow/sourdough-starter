const EPSILON = .2;
const SPEED = 5;

class Step2 extends BaseStep {
    constructor() {
        super({key: 'step2'});
        this._initialKeystroke = false;
        this._startTime = 0;
    }

    preload() {
        this.load.image('hotspot', 'assets/bg.png');
        this.load.spritesheet(
            'starter',
            'assets/starter.png',
            {frameWidth: 50, frameHeight: 50});
    }

    create(data) {
        this.cameras.main.setBackgroundColor(BACKGROUND_COLOR);
        this._startTime = this.time.now;
        this._instructions = this.addInstructions(
            'Step 2: put in a warm area (70°-85° F).');

        // Add thermometer.
        this._thermometer = this.add.text(780, 580, '68°', this._textStyle);
        this._thermometer.setOrigin(1, 1).setAlign('right').setFontSize(22);

        player = this.physics.add.sprite(data.x, data.y, 'starter');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.properties = {
            weight: 20.0,
            fermented: 5.0,
            temperature: 68,
        };
        // Add debug.
        // TODO: remove.
        this._debug = this.add.text(
            10, 10, `${player.properties.fermented}/${player.properties.weight}`, this._textStyle);


        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers(
                'starter', {start: 4, end: 6}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{key: 'starter', frame: 0}],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(
                'starter', {start: 1, end: 3}),
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

    update() {
        if (cursors.left.isDown) {
            player.setVelocityX(-60);
            player.anims.play('left', true);
            if (!this._initialKeystroke) {
                this.triggerFermentingText();
                this._initialKeystroke = true;
            }
        } else if (cursors.right.isDown) {
            player.setVelocityX(60);
            player.anims.play('right', true);
            if (!this._initialKeystroke) {
                this.triggerFermentingText();
                this._initialKeystroke = true;
            }
        } else if (cursors.up.isDown) {
            player.setVelocityY(-60);
            player.anims.play('right', true);
            if (!this._initialKeystroke) {
                this.triggerFermentingText();
                this._initialKeystroke = true;
            }
        } else if (cursors.down.isDown) {
            player.setVelocityY(60);
            player.anims.play('left', true);
            if (!this._initialKeystroke) {
                this.triggerFermentingText();
                this._initialKeystroke = true;
            }
        } else {
            player.anims.play('turn');
        }

        this.moveTempTowards(68);
        this.updateFermetation();
    }

    incrementTemp(player, hotspot) {
        this.moveTempTowards(140);
    }

    moveTempTowards(target) {
        if (player.properties.temperature <= target) {
            player.properties.temperature += .05;
        }
        if (player.properties.temperature > target) {
            player.properties.temperature -= .05;
        }
        const curTemp = Math.floor(player.properties.temperature);
        if (curTemp >= 112) {
            this._instructions.setText('Yeast will start to die at 120°.');
        }
        this._thermometer.setText(`${curTemp}°`);
    }

    triggerFermentingText() {
        this.time.addEvent({
            delay: 1500,  // ms
            callback: function() {
                this._instructions.setText(
                    'Starter needs to be fed when it deflates.');
            },
            callbackScope: this,
        });
    }

    updateFermetation() {
        if (player.properties.temperature >= 70 &&
            player.properties.temperature <= 85) {
            player.properties.fermented += .1;
        } else if (player.properties.temperature >= 50 &&
            player.properties.temperature <= 120) {
            player.properties.fermented += .01;
        }
        // At other temperatures fermentation stops.

        const x = player.properties.fermented / player.properties.weight;
        let y = -9.3 * x * x + 8.3 * x + 1.1;
        if (y < .5) {
            y = .5;
        } else if (y > 3) {
            y = 3;
        }
        this._debug.setText(
            `${Math.floor(player.properties.fermented)}/${player.properties.weight}`);
        player.setScale(y, y);
        let gameOver = false;
        if (x < .1) {
            player.properties['causeOfDeath'] = 'had unsustainably low fermentation';
            gameOver = true;
        } else if (x > .9) {
            player.properties['causeOfDeath'] = 'ran out of food';
            gameOver = true;
        }
        if (gameOver) {
            const elapsedTime = Math.floor((this.time.now - this._startTime) / 1000);
            player.properties['elapsedTime'] = elapsedTime;
            this.scene.start('gameover', player.properties);
        }
    }
}
