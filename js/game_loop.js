var platforms;
var player;
var cursors;
var scoreText;

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }
        }
    },
    scene: [Kitchen],
};

const game = new Phaser.Game(config);
