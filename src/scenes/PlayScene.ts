import {CST} from "../CST";
import io from 'socket.io-client';

export class PlayScene extends Phaser.Scene {
    keyboard!: { [index: string]: Phaser.Input.Keyboard.Key };
    ball!: Phaser.Physics.Arcade.Image;
    paddle!: Phaser.Physics.Arcade.Image;
    socket!: SocketIOClient.Socket;

    constructor() {
        super({key: CST.SCENES.PLAY});
        this.socket = io();
    }

    init() {
    }

    preload() {
    }

    create() {
        console.log(this.socket.id);
        // @ts-ignore
        this.keyboard = this.input.keyboard.addKeys("W, A, S, D");
        this.physics.world.setBoundsCollision(true, true, true, false);
        this.ball = this.physics.add.image(400, 500, 'assets', 'ball1').setCollideWorldBounds(true).setBounce(1);
        this.ball.setData('onPaddle', true);


        this.paddle = this.physics.add.image(400, 550, 'assets', 'paddle1').setImmovable();

        //  Our collides
        // @ts-ignore
        this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            const paddleWidth = 52;
            let paddleX = this.paddle.x;
            const paddleY = this.paddle.y;

            this.paddle.x = Phaser.Math.Clamp(pointer.x, paddleWidth, this.game.renderer.width - paddleWidth);

            this.socket.emit('player1-move', {paddleX, paddleY});

            if (this.ball.getData('onPaddle')) {
                this.ball.x = paddleX;
            }

        }, this);

        this.input.on('pointerup', () => {

            if (this.ball.getData('onPaddle')) {
                this.ball.setVelocity(-75, -300);
                this.ball.setData('onPaddle', false);
            }

        }, this);

        this.socket.on('player1-move', (coords:{paddleX:number, paddleY:number}) => {
            this.paddle.x = coords.paddleX;
        });

        this.socket.on('ball-move', (coords:{ballX:number, ballY:number}) => {
            this.ball.x = coords.ballX;
            this.ball.y = coords.ballY;
        });
    }

    update(time: number, delta: number) {
        const ballX = this.ball.x;
        const ballY = this.ball.y;

        this.socket.emit('ball-move', {ballX, ballY});
        if (ballY > this.game.renderer.height) {
            this.resetBall();
        }
    }

    hitPaddle(ball: Phaser.Physics.Arcade.Image, paddle: Phaser.Physics.Arcade.Image) {
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
