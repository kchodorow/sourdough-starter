const BUFFER = 5;
const TIP_SPEED = .8;
const TIP_ANGLE = 45;

class Intro extends Phaser.Scene {
    constructor() {
        super({key: 'intro'});
    }

    create() {
        const titleStyle = {
            fontSize: '40px', 
            fill: '#fff', 
            fontFamily: '"Dancing Script"',
        };
        const title = this.add.text(
            400, 300, 'Sourdough Starter\nSimulator', titleStyle);
        title.setOrigin(.5, .5);
        title.setAlign('center');

        this.input.once('pointerdown', function (event) {
            this.scene.start('step1');
        }, this);
    }
}

class Step1 extends Phaser.Scene {
    constructor() {
        super({key: 'step1'});
        this._jar = null;
        this._maxLeft = 0;
        this._maxRight = 0;
        this._done = false;
    }

    preload() {
        this.load.setBaseURL('http://labs.phaser.io');

        this.load.image('flour', 'assets/sprites/tomato.png');
        this.load.image('water', 'assets/sprites/tinycar.png');
        this.load.image('jar', 'assets/sprites/ufo.png');
        this.load.spritesheet('dude', 
            'assets/sprites/dude.png',
            { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        // User input.
        this._cursors = this.input.keyboard.createCursorKeys();

        // Instructions.
        const titleStyle = {
            fontSize: '35px', 
            fill: '#fff', 
            fontFamily: '"Dancing Script"',
        };
        const title = this.add.text(
            400, 50, 'Step 1: mix flour and water.', titleStyle);
        title.setOrigin(.5, 0);
        title.setAlign('center');

        // TODO: put these in a group and just get group members.
        this._flour = this.add.sprite(200, 300, 'flour');
        this._flour.setInteractive();
        this._water = this.add.sprite(600, 300, 'water');
        this._water.setInteractive();

        const originalThis = this;
        this._flour.on('pointerdown', function(pointer) {
            originalThis._flour.destroy();
            if (!originalThis._water.active) {
                originalThis.step2(title);
            }
        });
        this._water.on('pointerdown', function(pointer) {
            originalThis._water.destroy();
            if (!originalThis._flour.active) {
                originalThis.step2(title);
            }
        });
        this._jar = this.add.sprite(400, 300, 'jar').setScale(2.0);
    }

    update() {
        if (!this.allIngredientsAdded() || this._done) {
            return;
        }
        // TODO: add "hey quit it" message on initial rocking.
        const tip = TIP_SPEED * (Math.abs(this._jar.angle) + 1);
        if (this._cursors.left.isDown) {
            if (this._jar.angle > this._maxLeft - BUFFER) {
                this._jar.angle -= tip;
                this._maxRight += tip;
            }
            if (Math.abs(this._jar.angle) > TIP_ANGLE) {
                this._jar.angle = -90;
                this._done = true;
            }
        }
        else if (this._cursors.right.isDown) {
            if (this._jar.angle < this._maxRight + BUFFER) {
                this._jar.angle += tip;
                this._maxLeft -= tip;
            }
            if (Math.abs(this._jar.angle) > TIP_ANGLE) {
                this._jar.angle = 90;
                this._done = true;
            }
        }
    }

    allIngredientsAdded() {
        return !this._flour.active && !this._water.active;
    }

    step2(title) {
        title.setText('That\'s it! Now you just have to wait.');
    
        this.time.addEvent({
            delay: 1500,  // ms
            callback: tiltSuggestion,
            callbackScope: this,
        });
    }
}

const tiltSuggestion = function() {
    const hintStyle = {
        fontSize: '28px', 
        fill: '#f00', 
        fontFamily: '"Dancing Script"',
    };
    hint = this.add.text(
        400, 550, '(Use left and right to tilt the jar)', hintStyle);
    hint.setOrigin(.5, 0);
    hint.setAlign('center');
}
