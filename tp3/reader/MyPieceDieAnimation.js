/**
 * MyPieceDieAnimation
 * @constructor
 */
 function MyPieceDieAnimation(timeSpan, waitTime, piece, x1, z1, x2, z2, nextAnimation) {
   MyAnimation.apply(this, arguments);
   var translatedX2 = (x2-8);
   var translatedZ2 = (z2+1);
   this.deltaX = (x1-translatedX2);
   this.deltaZ = (z1-translatedZ2);// (z1-this.z2);

   this.piece = piece;

   this.nextAnimation = nextAnimation;

   this.initialTime = this.piece.scene.time;

   this.animationTime = timeSpan - waitTime;
   this.waitTime = waitTime;
   this.radius = Math.sqrt(Math.pow(this.deltaX, 2) + Math.pow(this.deltaZ, 2));

   this.matrix = mat4.create();
   mat4.translate(this.matrix, this.matrix, [this.deltaX, 0, this.deltaZ]);
 }

MyPieceDieAnimation.prototype = new MyAnimation();
MyPieceDieAnimation.prototype.constructor = MyPieceDieAnimation;

MyPieceDieAnimation.prototype.isComplete = function(currentTime){
  var timePassed = (currentTime - this.initialTime)/1000;

  return timePassed > this.timeSpan;
};

MyPieceDieAnimation.prototype.update = function(currentTime){
  var timePassed = (currentTime - this.initialTime)/1000;
  if(timePassed < this.waitTime){
      return;
  }

  this.matrix = mat4.create();

  if(timePassed >= this.timeSpan){
    if(!this.nextAnimation)
      this.piece.moving = false;
    this.piece.animation = this.nextAnimation;
    return;
  }

  var movementRatio = 1 - (timePassed-this.waitTime)/this.animationTime;

  mat4.translate(this.matrix, this.matrix, [this.deltaX*movementRatio, this.radius*Math.sin(Math.PI*(1-movementRatio)), this.deltaZ*movementRatio]);
};

MyPieceDieAnimation.prototype.apply = function(){
  this.piece.scene.multMatrix(this.matrix);
};
