import {CST} from "../CST";

export class LoadScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.LOAD
        });
    }
    loadImages(){
        this.load.setPath("./assets/image");

        for(let prop in CST.IMAGE){
            //@ts-ignore
            this.load.image(CST.IMAGE[prop], CST.IMAGE[prop]);
        }
    }
    loadSprites(frameConfig?: Phaser.Loader.FileTypes.ImageFrameConfig){
        this.load.setPath("./assets/sprite");

        for(let prop in CST.SPRITE){
            //@ts-ignore
            this.load.spritesheet(CST.SPRITE[prop], CST.SPRITE[prop], frameConfig);
        }
    }
    loadAudios(){
        this.load.setPath("./assets/audio");

        for(let prop in CST.AUDIO){
            //@ts-ignore
            this.load.audio(CST.AUDIO[prop], CST.AUDIO[prop]);
        }
    }
    init(){}
    preload(){
        this.load.atlas('assets', './assets/atlas/breakout.png', './assets/atlas/breakout.json');
        this.load.spritesheet('anna', './assets/sprite/anna.png', {frameHeight: 64, frameWidth: 64});
        this.load.atlas('characters', './assets/atlas/characters.png', './assets/atlas/characters.json');
        this.load.atlas('daze', './assets/atlas/daze.png', './assets/atlas/daze.json');

        this.loadImages();
        this.loadSprites({frameWidth: 32, frameHeight: 32});
        this.loadAudios();

        let progressBar = this.add.graphics({
            fillStyle:{
                color: 0xffffff
            }
        });

        this.load.on("progress", (percent:number) => {
            progressBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 20);
            console.log(percent);
        });

        this.load.on('complete', () => {
            this.scene.start(CST.SCENES.MENU);
        })
    }
    create(){

    }
}
