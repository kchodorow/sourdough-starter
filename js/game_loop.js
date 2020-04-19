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
    scene: [Intro, Step1, Step2, Kitchen, GameOver],
};

const game = new Phaser.Game(config);
