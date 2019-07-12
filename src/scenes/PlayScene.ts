import {CST} from "../CST";

export class PlayScene extends Phaser.Scene {
    keyboard!: { [index: string]: Phaser.Input.Keyboard.Key };
    ball!: Phaser.Physics.Arcade.Image;
    paddle!: Phaser.Physics.Arcade.Image;

    constructor() {
        super({key: CST.SCENES.PLAY});

    }

    init() {
    }

    preload() {

    }

    create() {
        // @ts-ignore
        this.keyboard = this.input.keyboard.addKeys("W, A, S, D");
        this.physics.world.setBoundsCollision(true, true, true, false);
        this.ball = this.physics.add.image(400, 500, 'assets', 'ball1').setCollideWorldBounds(true).setBounce(1);
        this.ball.setData('onPaddle', true);

        this.paddle = this.physics.add.image(400, 550, 'assets', 'paddle1').setImmovable();

        //  Our collides
        this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);

        this.input.on('pointermove', (pointer: Phaser.Input. Pointer) => {
            const paddleWidth = 52;
            this.paddle.x = Phaser.Math.Clamp(pointer.x, paddleWidth, this.game.renderer.width - paddleWidth);

            if (this.ball.getData('onPaddle')) {
                this.ball.x = this.paddle.x;
            }

        }, this);

        this.input.on('pointerup', () => {

            if (this.ball.getData('onPaddle')) {
                this.ball.setVelocity(-75, -300);
                this.ball.setData('onPaddle', false);
            }

        }, this);
    }

    update(time: number, delta: number) {
        if (this.ball.y > this.game.renderer.height) {
            this.resetBall();
        }
    }

    hitPaddle(ball:Phaser.Physics.Arcade.Image, paddle:Phaser.Physics.Arcade.Image) {
        let diff = 0;

        if (ball.x < paddle.x) {
            diff = paddle.x - ball.x;
            ball.setVelocityX(-10 * diff);
        } else if (ball.x > paddle.x) {
            diff = ball.x - paddle.x;
            ball.setVelocityX(10 * diff);
        } else {
            ball.setVelocityX(2 + Math.random() * 8);
        }
    }

    resetBall() {
        this.ball.setVelocity(0);
        this.ball.setPosition(this.paddle.x, 500);
        this.ball.setData('onPaddle', true);
    }
}
