class GameOver extends BaseStep {
    constructor() {
        super({key: 'gameover'});
    }

    create(data) {
        const title = this.add.text(
            400, 150, 'Game over\nYour starter died.', this._textStyle);
        title.setOrigin(.5, 0);
        title.setAlign('center');
        const stats = this.add.text(
            400, 250, 'Baked discards: 0', this._textStyle);
        stats.setFontSize(20);
        stats.setOrigin(.5, 0);
        stats.setAlign('center');
    }
}