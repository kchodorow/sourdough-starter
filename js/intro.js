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

        this.input.once('pointerdown', function (event) {
            this.scene.start('kitchen');
        }, this);
    }
}
