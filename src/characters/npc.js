const lag = 900;
export default class Npc extends Phaser.Physics.Arcade.Sprite{
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
			}
      this.updateAnimation();
    }
    updateAnimation() {
      const animations = this.animationSets.get('Walk');
      const animsController = this.anims;
      const x = this.body.velocity.x;
      const y = this.body.velocity.y;

      if (x < 0) {
        animsController.play(animations[0], true);
      } else if (x > 0) {
        animsController.play(animations[1], true);
      } else if (y < 0) {
        animsController.play(animations[2], true);
      } else if (y > 0) {
        animsController.play(animations[3], true);
      } else {
        const currentAnimation = animsController.currentAnim;
        if (currentAnimation) {
          const frame = currentAnimation.getLastFrame();
          this.setTexture(frame.textureKey, frame.textureFrame);
				}
      }
    }

	cntLess(steps){
		return this.cnt < steps;
	}
}