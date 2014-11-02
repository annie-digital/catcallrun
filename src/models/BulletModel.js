
import gfw.models.entity.EntityModel as EntityModel;
import math.geom.intersect as intersect;
import src.models.ObstacleModel as ObstacleModel;

exports = Class(EntityModel, function(supr) {

  this.init = function(opts) {
    supr(this, 'init', [opts]);
    this.gameModel = opts.gameModel;
    this.radius = opts.radius;

    this.type = opts.type;

    this.hasHit = false;
  };

  this.reset = function(opts) {
    supr(this, 'reset', arguments);
    this.type = opts.type;

    this.hasHit = false;
  };

  this.hitEnemy = function(enemyModel, amount) {
    this.hasHit = true;
    this.active = false;
    enemyModel.hurt(amount);
  };

  this.step = function(dt) {
    supr(this, 'step', arguments);

    // TODO: check for collision
    this.gameModel.enemyMVC.modelPool.forEachActive(function(model) {
      if (this.active && !this.hasHit && intersect.circleAndCircle(this, model)) {
        this.hitEnemy(model, this.type.hurtAmt);
      }
    }.bind(this));

    this.gameModel.obstacleMVC.modelPool.forEachActive(function(model) {
      if(model.type.stopsBullets) {
        if (this.active && !this.hasHit && intersect.circleAndCircle(this, model)) {
          this.active = false;
        }
      }
    }.bind(this));

    if (this.y < this.gameModel.modelSpace.y) {
      this.active = false;
    }
  };
});

exports.TYPES = {

  /*
   * hurtAmt
  */
  pencil: {
    image: IMAGES_DIR + "pencil_mockup_0000.png",
    width: 13,
    height: 74,
    hurtAmt: 1
  },

  calculator: {
    images: IMAGES_DIR + "calculator_mockup.png",
    width: 52,
    height: 76,
    hurtAmt: 2
  }
}

exports.LEVEL_TYPES = [exports.TYPES.pencil, exports.TYPES.calculator];