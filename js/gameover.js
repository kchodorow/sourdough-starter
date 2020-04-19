class GameOver extends BaseStep {
    constructor() {
        super({key: 'gameover'});
    }

    preload() {
        this.cameras.main.setBackgroundColor(BACKGROUND_COLOR);
        this.load.image('pancakes', 'assets/flour.png');
    }

    create(data) {
        const title = this.add.text(400, 150, '', this._textStyle);
        let statsStr = ''
        if (data.win) {
            title.setText(
                'Congratulations!\nYou successfully matured your starter.');
            statsStr = (
                `It took ${data.elapsedTime} seconds to reach maturity.\n` +
                `Scallion pancakes: ${data.discard}`);
            // TODO: add some particle effects.
        } else {
            title.setText(`Game over\nYour starter ${data.causeOfDeath}.`);
            statsStr = (
                `Your starter survived ${data.elapsedTime} seconds\n` +
                `Scallion pancakes: ${data.discard}`);
        }
        title.setOrigin(.5, 0).setFontSize('42px').setAlign('center');

        const stats = this.add.text(400, 275, statsStr, this._textStyle);
        stats.setOrigin(.5, 0).setFontSize('26px').setAlign('center');

        this.addPancakes(data.discard);
        // TODO: add try again? button.
    }

    addPancakes(numPancakes) {
        this.physics.world.gravity.y = 300;
        if (numPancakes == 0) {
            return;
        }
        const pancakes = this.physics.add.group({
            key: 'pancakes',
            repeat: numPancakes,
            setXY: { x: 50, y: 0, stepX: 800/numPancakes }
        });
        pancakes.children.iterate(function (child) {
            child.setCollideWorldBounds(true)
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            child.setBounceX(Phaser.Math.FloatBetween(0.5, 0.9));
            child.setVelocityX(Math.random()*100);
        });
    }
}
