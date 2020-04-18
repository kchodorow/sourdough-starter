let platforms;
let player;
let cursors;
let scoreText;

class Kitchen extends Phaser.Scene {
    constructor() {
        super({key: 'kitchen'});
    }

    preload() {
        this.load.setBaseURL('http://labs.phaser.io');

        this.load.image('sky', 'assets/skies/sky1.png');
        this.load.image('ground', 'assets/sprites/platform.png');
        this.load.image('flour', 'assets/sprites/tomato.png');
        this.load.spritesheet('dude', 
            'assets/sprites/dude.png',
            { frameWidth: 32, frameHeight: 48 });
    }

    create(data) {
        // Background.
        this.add.image(400, 300, 'sky');
        platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        // Player.
        player = this.physics.add.sprite(data.x, data.y, 'dude');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        this.physics.add.collider(player, platforms);
        player.properties = {
            weight: 20.0,
            fermented: 5.0,
        };
        
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // Add flour.
        const flour = this.physics.add.group({
            key: 'flour',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        flour.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        this.physics.add.collider(flour, platforms);
        this.physics.add.overlap(player, flour, collectFlour, null, this);

        // User input.
        cursors = this.input.keyboard.createCursorKeys();

        // Status.
        scoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#000' });
        displaySourness(player);
    }

    update() {
        if (cursors.left.isDown) {
            player.setVelocityX(-160);
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.anims.play('right', true);
        }
        else {
            player.setVelocityX(0);
            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
        }

        if (Math.random() < .01) {
            increaseSourness(player);
        }
    }
}

const collectFlour = function(player, flour) {
    flour.disableBody(true, true);
    player.properties.weight += 10.0;
    displaySourness(player);
};

const increaseSourness = function(player) {
    player.properties.fermented += 1.0;
    displaySourness(player);
};

const displaySourness = function(player) {
    const sourness = Math.floor(
        100 * player.properties.fermented / player.properties.weight);
    scoreText.setText(`Sourness: ${sourness}%`);
};