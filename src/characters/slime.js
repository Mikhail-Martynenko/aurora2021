const lag = 450;
export default class Slime extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, name, frame) {
        super(scene, x, y, name, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.steering = undefined;
        this.cnt = 0;
    }

    update() {
        if(this.steering){
            const dir = this.steering.calculateImpulse(!this.cntLess(lag));
            this.body.setVelocityX(dir.x)
            this.body.setVelocityY(dir.y)
            this.cnt = this.cntLess(lag) ? this.cnt + 1 : 0;
        } else {
            this.wantToJump = true;
        }
        this.updateAnimation();
    }

    updateAnimation() {
        const animsController = this.anims;
        if (this.wantToJump){
            animsController.play(this.animations[1], true);
        } else {
            animsController.play(this.animations[0], true);
        }
    }

    hasArrived(){
        return this.pointOfInterest === undefined
            || this.pointOfInterest.distance(this.body.position) < 20;
    }

    cntLess(steps){
        return this.cnt < steps;
    }
}
