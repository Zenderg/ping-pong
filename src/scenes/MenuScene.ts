import {CST} from "../CST";

export class MenuScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.MENU
        });
    }
    init(){}
    preload(){
        console.log("MENU preload")
    }
    create(){
        console.log("MENU create");
        this.add.image(0,0,CST.IMAGE.TITLE).setOrigin(0).setDepth(0);
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.2, CST.IMAGE.LOGO).setDepth(1);
        let playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, CST.IMAGE.PLAY).setDepth(1);
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, CST.IMAGE.OPTIONS).setDepth(1);
        let cat = this.add.sprite(100, 100, CST.SPRITE.CAT).setDepth(1);

        this.anims.create({
           key: 'walk',
           repeat: -1,
           frameRate: 10,
           frames: this.anims.generateFrameNumbers( CST.SPRITE.CAT, {
               frames: [0,1,2,3]
           })
        });

        cat.setScale(2);
        cat.setVisible(false);

        playButton.setInteractive();
        playButton.on('pointerover', () => {
            cat.setVisible(true);
            cat.x = playButton.x - playButton.width;
            cat.y = playButton.y;
            console.log(cat);
            cat.play('walk');
        });

        playButton.on('pointerout', () => {
            cat.setVisible(false);
        });

        playButton.on('pointerup', () => {
            this.scene.start(CST.SCENES.PLAY);
        });
    }
}
