/**
 * MyPieceAnimation
 * @constructor
 */
 function MyPieceAnimation(timeSpan, piece, x1, z1, x2, z2) {
   MyAnimation.apply(this, arguments);
   this.deltaX = x1-x2;
   this.deltaZ = z1-z2;

   this.piece = piece;

   this.initialTime = this.piece.scene.time;

   this.matrix = mat4.create();
   mat4.translate(this.matrix, this.matrix, [this.deltaX, 0, this.deltaZ]);
 }

MyPieceAnimation.prototype = new MyAnimation();
MyPieceAnimation.prototype.constructor = MyPieceAnimation;

MyPieceAnimation.prototype.isComplete = function(currentTime){
  var timePassed = (currentTime - this.initialTime)/1000;

  return timePassed > this.timeSpan;
};

MyPieceAnimation.prototype.update = function(currentTime){
  var timePassed = (currentTime - this.initialTime)/1000;

  this.matrix = mat4.create();

  if(timePassed >= this.timeSpan){
    this.piece.moving = false;
    this.piece.animation = null;
    return;
  }

  var movementRatio = 1 - timePassed/this.timeSpan;

  mat4.translate(this.matrix, this.matrix, [this.deltaX*movementRatio, 0, this.deltaZ*movementRatio]);
};

MyPieceAnimation.prototype.apply = function(){
  this.piece.scene.multMatrix(this.matrix);
};
