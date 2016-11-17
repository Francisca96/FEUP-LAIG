/**
 * MyCircularAnimation
 * @constructor
 */
 function MyCircularAnimation(timeSpan, center, radius, initialAngle, rotationAngle) {
   MyAnimation.apply(this, arguments);
   this.center = center;
   this.radius = radius;
   this.initialAngle = initialAngle * Math.PI / 180;
   this.rotationAngle = rotationAngle * Math.PI / 180;
 }

MyCircularAnimation.prototype = new MyAnimation();
MyCircularAnimation.prototype.constructor = MyCircularAnimation;

MyCircularAnimation.prototype.calculateTransformation = function(currentTime){
  var m = mat4.create();
  if(this.currentTime == -1){
    this.currentTime = currentTime;
    return m;
  }
  var timePassed = (currentTime - this.currentTime)/1000;

  if(timePassed > this.timeSpan)
    timePassed = this.timeSpan;


  mat4.translate(m, m, this.center); // match the rotation center with the given center
  mat4.rotate(m, m, this.initialAngle + this.rotationAngle / this.timeSpan * timePassed, [0, 1, 0]);
  mat4.translate(m, m, [this.radius, 0, 0]);

  return m;
};
