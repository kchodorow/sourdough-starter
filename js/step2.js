const EPSILON = .2;
const MAX_SCALE = 3;
const MAX_WEIGHT = 60;
const SPEED = 5;

class Step2 extends BaseStep {
    constructor() {
        super({key: 'step2'});
        this._initialKeystroke = false;
        this._startTime = 0;
        this._hasFedBefore = false;
    }

    preload() {
        this.load.image('hotspot', 'assets/bg.png');
        this.load.image('flour', 'assets/flour.png');
        this.load.image('chopper', 'assets/water.png');
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

        const hotspot = this.addHotspot();
        const player = this.addPlayer(data)
        this.physics.add.overlap(
            player, hotspot, this.incrementTemp, null, this);

        this.createHud();

        // User input.
        cursors = this.input.keyboard.createCursorKeys();
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
        this.updateMaturity();

        const curTemp = Math.floor(player.properties.temperature);
        const abv = Math.floor(
            100 * (player.properties.fermented / player.properties.weight));
        const weight = Math.floor(player.properties.weight);
        this._thermometer.setText(
            `Temperature: ${curTemp}°\nFermentation: ${abv}%\nWeight: ${weight}oz`);
    }

    addPlayer(data) {
        player = this.physics.add.sprite(data.x, data.y, 'starter');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.properties = {
            weight: 20.0,
            fermented: 5.0,
            temperature: 68,
            discard: 0,
        };

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
        return player;
    }

    createHud() {
        const hudTextStyle = {
            fontSize: '26px',
            fill: TEXT_COLOR_STR,
            fontFamily: 'Gill Sans',
            align: 'right',
        };
        // Add thermometer.
        this._thermometer = this.add.text(790, 590, '', hudTextStyle).setOrigin(1, 1);

        this._maturityMeter = new Phaser.GameObjects.Graphics(this);
        this._maturityMeter.maturity = 0;
        this.updateMaturity();
        this.add.existing(this._maturityMeter);
    }

    updateMaturity() {
        const x = 250;
        const y = 568;
        const width = 300;
        const height = 12;

        this._maturityMeter.clear();
        //  Outline.
        this._maturityMeter.fillStyle(0x27275b);
        this._maturityMeter.fillRect(x, y, width + 4, height + 4);
        // Background.
        this._maturityMeter.fillStyle(0xa8a8c0);
        this._maturityMeter.fillRect(x + 2, y + 2, width, height);

        //  Maturity.
        this._maturityMeter.fillStyle(0x585886);
        if (this.isHealthy()) {
            this._maturityMeter.maturity += .001;
        }
        if (this._maturityMeter.maturity >= 1) {
            this.gameOver(true);
        }
        this._maturityMeter.maturity = Math.min(1, this._maturityMeter.maturity);
        const widthFilled = this._maturityMeter.maturity * width;
        this._maturityMeter.fillRect(x + 2, y + 2, widthFilled, height);
    }

    // TODO: move to player class
    isHealthy() {
        if (player.properties.temperature < 70 || 
            player.properties.temperature > 85) {
            return false;
        }
        const fermentation = (
            player.properties.fermented / player.properties.weight);
        if (fermentation < .2 || fermentation > .5) {
            return false;
        }
        if (player.properties.weight < 1) {
            return false;
        }
        return true;
    }

    addHotspot() {
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
        return hotspot;
    }

    incrementTemp(player, hotspot) {
        this.moveTempTowards(140);
    }

    moveTempTowards(target) {
        if (player.properties.temperature <= target) {
            player.properties.temperature += .003;
        } else if (player.properties.temperature > target) {
            player.properties.temperature -= .003;
        }
        const curTemp = Math.floor(player.properties.temperature);
        if (curTemp >= 112) {
            this._instructions.setText('Yeast will start to die at 120°.');
        }
        if (curTemp <= 40) {
            this.gameOver(false, 'got too cold');
        }
        if (curTemp >= 140) {
            this.gameOver(false, 'got too hot');
        }
    }

    triggerFermentingText() {
        this.time.addEvent({
            delay: 1500,  // ms
            callback: function() {
                this._instructions.setText(
                    'Starter needs to be fed when it deflates.');
                const flour = this.physics.add.staticSprite(600, 400, 'flour');
                this.physics.add.collider(
                    player, flour, this.addFlour, null, this);
            },
            callbackScope: this,
        });
    }

    addFlour() {
        player.properties.weight += 1;
        if (!this._hasFedBefore) {
            this.addChopper();
        }
        this._hasFedBefore = true;
    }

    addChopper() {
        this._instructions.setText(
            'Discard 20% of your starter when it gets too big.');
        const chopper = this.physics.add.staticSprite(400, 200, 'chopper');
        this.physics.add.collider(
            player, chopper, this.discard, null, this);
    }

    discard(player, chopper) {
        player.properties.weight *= .8;
        player.properties.fermented *= .8;
        player.properties.discard += 1;
        const discardMessage = this.add.text(
            chopper.x, chopper.y, '+1 scallion pancake', this._textStyle);
        this.tweens.add({
            targets: [discardMessage],
            y: {start: chopper.y, to: chopper.y-50},
            alpha: {start: 1, to: 0}, 
            duration: 750,
        });
    }

    updateFermetation() {
        if (player.properties.temperature >= 70 &&
            player.properties.temperature <= 85) {
            player.properties.fermented += .01;
        } else if (player.properties.temperature >= 50 &&
            player.properties.temperature <= 120) {
            player.properties.fermented += .001;
        } else {
            // At other temperatures yeast starts to die.
            player.properties.fermented -= .001;
        }

        const x = player.properties.fermented / player.properties.weight;
        const scale = MAX_SCALE * (player.properties.weight / MAX_WEIGHT)
        player.setScale(scale, scale);

        if (x < .1) {
            this.gameOver(false, 'had unsustainably low fermentation');
        } else if (x > .9) {
            this.gameOver(false, 'ran out of food');
        }
    }

    gameOver(win, msg) {
        player.properties['win'] = win;
        player.properties['causeOfDeath'] = msg;
        const elapsedTime = Math.floor((this.time.now - this._startTime) / 1000);
        player.properties['elapsedTime'] = elapsedTime;
        this.scene.start('gameover', player.properties);
    }
}
