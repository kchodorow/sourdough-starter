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
        const titleStyle = {
            fontSize: '35px', 
            fill: '#fff', 
            fontFamily: '"Dancing Script"',
        };
        const title = this.add.text(
            400, 50, 'Step 1: mix flour and water.', titleStyle);
        title.setOrigin(.5, 0);
        title.setAlign('center');

        const flour = this.add.sprite(200, 300, 'flour');
        flour.setInteractive();
        const water = this.add.sprite(600, 300, 'water');
        water.setInteractive();

        flour.on('pointerdown', function(pointer) {
            flour.destroy();
            if (!water.active) {
                step2(title);
            }
        });
        water.on('pointerdown', function(pointer) {
            water.destroy();
            if (!flour.active) {
                step2(title);
            }
        });
        const jar = this.add.sprite(400, 300, 'jar');
    }
}

const step2 = function(title) {
    title.setText('That\'s it! Now you just have to wait.');
}
