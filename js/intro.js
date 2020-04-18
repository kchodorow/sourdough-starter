class Intro extends Phaser.Scene {
    constructor() {
        super({key: 'intro'});
    }

    create() {
        const titleStyle = {
            fontSize: '32px', 
            fill: '#fff', 
            fontFamily: '"Roboto Condensed"',
            boundsAlignH: 'center',
            boundsAlignV: 'middle',
        };
        const title = this.add.text(
            400, 300, 'Sourdough Starter\nSimulator', titleStyle);
        title.setOrigin(.5, .5);
        title.setAlign('center');

        this.input.once('pointerdown', function (event) {
            this.scene.start('kitchen');
        }, this);
    }
}
