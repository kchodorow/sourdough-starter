class BaseStep extends Phaser.Scene {

    constructor(keyDict) {
        super(keyDict);
        this._textStyle = {
            fontSize: '35px', 
            fill: TEXT_COLOR_STR,
            fontFamily: '"Dancing Script"',
        }
    }

    addInstructions(text) {
        const title = this.add.text(400, 50, text, this._textStyle);
        title.setOrigin(.5, 0);
        title.setAlign('center');
        return title;
    }

}
