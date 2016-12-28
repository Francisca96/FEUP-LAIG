/**
 * MyViewAnimation
 * @constructor
 */
 function (timeSpan, initialView, x2, y2, z2) {
   MyAnimation.apply(this, arguments);

   this.timeSpan = timeSpan;

   this.position = vec3.create();

   this.radius = Math.sqrt(Math.pow() + Math.pow())
 }

MyViewAnimation.prototype = new MyAnimation();
MyViewAnimation.prototype.constructor = MyViewAnimation;

MyViewAnimation.prototype.getView = function(currentTime){
  this.updatedView = new CGFcamera(initialView.fov, initialView.near, initialView.far, this.position, initialView.target);
}

MyViewAnimation.prototype.isComplete = function(currentTime){
  var timePassed = (currentTime - this.initialTime)/1000;

  return timePassed > this.timeSpan;
};

MyViewAnimation.prototype.update = function(currentTime){
  if(currentTime < this.initialTime)
    return;

  var updateTime = currentTime - this.lastTime;
  this.lastTime = currentTime;
  var timePassed = currentTime - this.initialTime;

  this.matrix = mat4.create();

  if(timePassed/1000 >= this.timeSpan){
    this.piece.update();
    if(!this.nextAnimation)
      this.piece.moving = false;
    this.piece.animation = this.nextAnimation;
    return;
  }

  if(this.counter > this.period){
    mat4.scale(this.matrix, this.matrix, [this.piece.type, this.piece.type, this.piece.type]);
    this.counter = 0;
  }
  else
    this.counter += updateTime;
};
