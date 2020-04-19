const BACKGROUND_COLOR = 0x9ca9b5;
const TEXT_COLOR_STR = '#203c54';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true,
        }
    },
    scene: [Intro, Step1, Step2, GameOver],
};

const game = new Phaser.Game(config);
