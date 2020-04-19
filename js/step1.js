const BUFFER = 5;
const STARTER_OFFSET = 50;
const TIP_ANGLE = 45;
const TIP_SPEED = .8;


const addTitle = function(scene, message) {
    const titleStyle = {
        fontSize: '40px', 
        fill: TEXT_COLOR_STR, 
        fontFamily: '"Dancing Script"',
    };

    const title = scene.add.text(400, 300, message, titleStyle);
    title.setOrigin(.5, .5);
    title.setAlign('center');
}

class Intro extends Phaser.Scene {
    constructor() {
        super({key: 'intro'});
    }

    create() {
        this.cameras.main.setBackgroundColor(BACKGROUND_COLOR);
        addTitle(this, 'Sourdough Starter\nSimulator');

        this.input.once('pointerdown', function (event) {
            //this.scene.start('step1');
            this.scene.start('step2', {x: 450, y: 300});
        }, this);
    }
}

class Step1 extends BaseStep {
    constructor() {
        super({key: 'step1'});
        this._jar = null;
        this._maxLeft = 0;
        this._maxRight = 0;
        this._knocked_over = false;
        this._transitioning = false;
        this._starter = null;
    }

    preload() {
        this.cameras.main.setBackgroundColor(BACKGROUND_COLOR);
        this.load.image('flour', 'assets/flour.png');
        this.load.image('water', 'assets/water.png');
        this.load.image('jar', 'assets/jar.png');
        this.load.spritesheet(
            'starter',
            'assets/starter.png',
            {frameWidth: 50, frameHeight: 50});
    }

    create() {
        // User input.
        this._cursors = this.input.keyboard.createCursorKeys();

        // Instructions.
        this.addInstructions('Step 1: mix flour and water.');

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
        if (!this.allIngredientsAdded()) {
            return;
        }
        if (this._knocked_over) {
            if (this._transitioning) {
                return;
            }
            this._transitioning = true;
            this.scene.transition({
                target: 'step2',
                duration: 5000,
                moveBelow: true,
                onUpdate: this.transitionOut,
                data: {x: this._starter.x, y: this._starter.y},
            });
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
                this._knocked_over = true;
                this.addStarter(-1);
            }
        }
        else if (this._cursors.right.isDown) {
            if (this._jar.angle < this._maxRight + BUFFER) {
                this._jar.angle += tip;
                this._maxLeft -= tip;
            }
            if (Math.abs(this._jar.angle) > TIP_ANGLE) {
                this._jar.angle = 90;
                this._knocked_over = true;
                this.addStarter(1);
            }
        }
    }

    addStarter(dir) {
        this._starter = this.add.sprite(
            400 + (STARTER_OFFSET * dir), 300, 'starter');
    }

    transitionOut(progress) {
        this._jar.setAlpha(1 - progress);
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
        fill: '#3e3e70', 
        fontFamily: '"Dancing Script"',
    };
    hint = this.add.text(
        400, 550, '(Use left and right to tilt the jar)', hintStyle);
    hint.setOrigin(.5, 0);
    hint.setAlign('center');
}

class SetName extends BaseStep {
    constructor() {
        super({key: 'setname'});
    }

    create() {
        this.addInstructions(
            'Well that\'s more lively than usual. Let\'s give it a name.');
    }
}
