class GameOver extends BaseStep {
    constructor() {
        super({key: 'gameover'});
    }

    create(data) {
        this.cameras.main.setBackgroundColor(BACKGROUND_COLOR);
        const title = this.add.text(400, 150, '', this._textStyle);
        if (data.win) {
            title.setText(
                'Congratulations!\nYou successfully matured your stater.');
            // TODO: add some particle effects.
        } else {
            title.setText(`Game over\nYour starter ${data.causeOfDeath}.`);
        }
        title.setOrigin(.5, 0);
        title.setAlign('center');
        const statsStr = `Stats:\n` +
            `Elapsed time: ${data.elapsedTime} seconds\n` +
            `Scallion pancakes: ${data.discard}`;
        const stats = this.add.text(
            400, 250, statsStr, this._textStyle);
        stats.setFontSize(20);
        stats.setOrigin(.5, 0);
        stats.setAlign('center');

        // TODO: add try again? button.
    }
}