export default class Anna extends Phaser.Physics.Arcade.Sprite{
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frames?: string | number){
        super(scene, x, y, texture, frames);
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        this.setOrigin(0, 0).setDepth(1);
        scene.physics.world.enableBody(this);
    }
}
