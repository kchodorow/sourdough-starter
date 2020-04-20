const EPSILON = .2;
const MAX_SCALE = 3;
const MAX_WEIGHT = 60;
const SPEED = 5;

class Step2 extends BaseStep {
    constructor() {
        super({key: 'step2'});
        this._fermentingTriggered = false;
        this._weightTriggered = false;
        this._maturityTriggered = false;
        this._startTime = 0;
    }

    preload() {
        this.load.image('hotspot', 'assets/bg.png');
        this.load.image('flour', 'assets/flour.png');
        this.load.image('chopper', 'assets/chopper.png');
        this.load.spritesheet(
            'starter',
            'assets/starter.png',
            {frameWidth: 50, frameHeight: 50});
    }

    create(data) {
        this.cameras.main.setBackgroundColor(BACKGROUND_COLOR);
        this._startTime = this.time.now;

        this._instructions = this.addInstructions(
            'You can speed it up by moving it to a warmer area\n(70°-85° F).');

        const hotspot = this.addHotspot();
        this.addPlayer(data)
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

        this.moveTempTowards(68, .003);
        this.updateFermetation();
        this.updateMaturity();

        const curTemp = Math.floor(player.properties.temperature);
        const abv = Math.floor(
            100 * (player.properties.fermented / player.properties.weight));
        const weight = Math.floor(player.properties.weight);
        this._thermometerText.setText(`${curTemp}°`);
        this._thermometerGauge.setGauge(curTemp);
        this._abvText.setText(`${abv}%`);
        this._abvGauge.setGauge(abv);
        this._weightText.setText(`${weight}oz`);
        this._weightGauge.setGauge(weight);
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
            fontSize: '22px',
            fill: TEXT_COLOR_STR,
            fontFamily: 'Gill Sans',
            align: 'right',
        };
        // Add thermometer.
        this._thermometerText = this.add.text(0, 120, '', hudTextStyle);
        this._thermometerGauge = new Gauge(this, 50, 140, 70, 85);
        this.add.existing(this._thermometerGauge);
        const tempContainer = this.add.container(
            0, 0, [this._thermometerGauge, this._thermometerText]);
        // Add ABV.
        this._abvText = this.add.text(0, 120, '', hudTextStyle);
        this._abvGauge = new Gauge(this, 0, 100, 20, 60);
        this.add.existing(this._abvGauge);
        const abvContainer = this.add.container(
            40, 0, [this._abvGauge, this._abvText]);
        // Add weight.
        this._weightText = this.add.text(0, 120, '', hudTextStyle);
        this._weightGauge = new Gauge(this, 4, 100, 10, 60);
        this.add.existing(this._weightGauge);
        const weightContainer = this.add.container(
            80, 0, [this._weightGauge, this._weightText]);
        const gauges = this.add.container(
            660, 450, [tempContainer, abvContainer, weightContainer]);     

        this._maturityMeter = new Phaser.GameObjects.Graphics(this);
        this._maturityMeter.maturity = 0;
        this.updateMaturity();
        this.add.existing(this._maturityMeter);
    }

    updateMaturity() {
        if (this.isHealthy()) {
            this._maturityMeter.maturity += .001;
        }
        if (this._maturityMeter.maturity >= 1) {
            this.gameOver(true);
        }
        this._maturityMeter.maturity = Math.min(
            1, this._maturityMeter.maturity);
        horizontalGaugeUpdate(
            this._maturityMeter, this._maturityMeter.maturity);
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
        const hotspot = this.physics.add.staticSprite(150, 350, 'hotspot');
        hotspot.setScale(3);
        let tween = this.tweens.add({
            targets: hotspot,
            duration: 3000,
            alpha: {start: .5, to: 1},
            repeat: -1,
            yoyo: true,
        });
        return hotspot;
    }

    incrementTemp(player, hotspot) {
        this.moveTempTowards(140, .03);
    }

    moveTempTowards(target, amount) {
        if (player.properties.temperature <= target) {
            player.properties.temperature += amount;
        } else if (player.properties.temperature > target) {
            player.properties.temperature -= amount;
        }
        const curTemp = Math.floor(player.properties.temperature);
        if (curTemp >= 71 && !this._fermentingTriggered) {
            this._fermentingTriggered = true;
            this.time.addEvent({
                delay: 1500,  // ms
                callback: function() {
                    this._instructions.setText(
                        'Fermentation % can be lowered by feeding it flour.');
                    const flour = this.physics.add.staticSprite(600, 400, 'flour');
                    flour.setScale(2);
                    this.physics.add.collider(
                        player, flour, this.addFlour, null, this);
                },
                callbackScope: this,
            });
        }
        if (curTemp >= 112) {
            this._instructions.setText('Yeast will start to die at 120°.');
        }
        if (curTemp <= this._thermometerGauge.minValid()) {
            this.gameOver(false, 'got too cold');
        }
        if (curTemp >= this._thermometerGauge.maxValid()) {
            this.gameOver(false, 'got too hot');
        }
    }

    addFlour() {
        player.properties.weight += 1;
        if (!this._weightTriggered) {
            this.addChopper();
        }
        this._weightTriggered = true;
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

        if (!this._maturityTriggered) {
            this._instructions.setText(
                'Keep all three gauges healthy for your starter to mature.');
        }
        if (player.properties.weight <= this._weightGauge.minValid()) {
            this.gameOver(false, 'was too underweight');
        } else if (player.properties.weight >= this._weightGauge.maxValid()) {
            this.gameOver(false, 'was too large to sustain');
        }
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

        if (x * 100 <= this._abvGauge.minValid()) {
            this.gameOver(false, 'had unsustainably low fermentation');
        } else if (x * 100 >= this._abvGauge.maxValid()) {
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
