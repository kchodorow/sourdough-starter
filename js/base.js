class BaseStep extends Phaser.Scene {

    addInstructions(text) {
        const titleStyle = {
            fontSize: '35px', 
            fill: '#fff',
            fontFamily: '"Dancing Script"',
        };
        const title = this.add.text(400, 50, text, titleStyle);
        title.setOrigin(.5, 0);
        title.setAlign('center');
        return title;
    }

}
