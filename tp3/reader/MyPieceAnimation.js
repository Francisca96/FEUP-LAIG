// /**
//  * MyPieceAnimation
//  * @constructor
//  */
//  function MyPieceAnimation(timeSpan, x1, y1, x2, y2) {
//    MyAnimation.apply(this, arguments);
//    this.x = x;
//    this.y = y;
//
//    this.initialTime = this.scene.time;
//
//    this.radius = Math.sqrt(Math.pow(this.x2-this.x1, 2) + Math.pow(this.y2-this.y1, 2))/2;
//    this.rotationAngle = Math.PI;
//  }
//
// MyPieceAnimation.prototype = new MyAnimation();
// MyPieceAnimation.prototype.constructor = MyPieceAnimation;
//
// MyPieceAnimation.prototype.calculateTransformation = function(currentTime){
//   var m = mat4.create();
//   if(this.currentTime == this.initialTime){
//     this.currentTime = currentTime;
//     return m;
//   }
//   var timePassed = (currentTime - this.currentTime)/1000;
//
//   if(timePassed > this.timeSpan){
//     this.isComplete = true;
//     timePassed = this.timeSpan;
// }
//
//   mat4.rotate(m, m, Math.PI/2, [1, 0, 0]);
//   mat4.rotate(m, m, this.rotationAngle / this.timeSpan * timePassed, [0, 0, 1]);
//   mat4.translate(m, m, [this.radius, 0, 0]);
//
//   return m;
// };
