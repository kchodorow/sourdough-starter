class GameOver extends BaseStep {
    constructor() {
        super({key: 'gameover'});
    }

    create(data) {
        this.cameras.main.setBackgroundColor(BACKGROUND_COLOR);
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

        // TODO: add try again? button.
    }
}
