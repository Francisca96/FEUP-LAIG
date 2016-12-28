/**
 * MyPieceMergeAnimation
 * @constructor
 */
 function MyPieceMergeAnimation(timeSpan, period, piece, oldSize, nextAnimation) {
   MyAnimation.apply(this, arguments);

   this.piece = piece;
   this.oldSize = oldSize;

   this.nextAnimation = nextAnimation;

   this.initialTime = this.piece.scene.time;

   this.period = period;
   this.lastTime = this.initialTime;
   this.counter = 0;

   this.matrix = mat4.create();
 }

MyPieceMergeAnimation.prototype = new MyAnimation();
MyPieceMergeAnimation.prototype.constructor = MyPieceMergeAnimation;

MyPieceMergeAnimation.prototype.isComplete = function(currentTime){
  var timePassed = (currentTime - this.initialTime)/1000;

  return timePassed > this.timeSpan;
};

MyPieceMergeAnimation.prototype.update = function(currentTime){
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

MyPieceMergeAnimation.prototype.apply = function(){
  this.piece.scene.multMatrix(this.matrix);
};
