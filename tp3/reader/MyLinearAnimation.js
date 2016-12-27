// /**
//  * MyLinearAnimation
//  * @constructor
//  */
//  function MyLinearAnimation(timeSpan, controlPoints) {
//    MyAnimation.apply(this, arguments);
//    this.controlPoints = controlPoints;
//
//    this.movementLength = [0];
//    var totalDistance = 0;
//    for(var i = 1; i < this.controlPoints.length; i++){
//      this.movementLength.push(vec3.dist(controlPoints[i], controlPoints[i-1]));
//      totalDistance += this.movementLength[i];
//    }
//    this.velocity = totalDistance / this.timeSpan;
//    this.isComplete = false;
//   }
//
// MyLinearAnimation.prototype = new MyAnimation();
// MyLinearAnimation.prototype.constructor = MyLinearAnimation;
//
// MyLinearAnimation.prototype.getCurrentMovement = function(distance){
//   for(var i = 0; i < this.controlPoints.length; i++){
//     if(distance < this.movementLength[i]){
//       return [i, distance];
//     }
//     distance -= this.movementLength[i];
//   }
//   return[1, distance];
// };
//
// MyLinearAnimation.prototype.getAngle = function(point1, point2) {
//   var angle = Math.atan2(point2[2] - point1[2], point2[0] - point1[0]);
//   if (point2[2] - point1[2] < 0)
// 		angle += Math.PI;
// 	return angle;
// };
//
// MyLinearAnimation.prototype.getTranslation = function(point1, point2, ratio){
//   var translation = [];
//
//   for(var i = 0; i < point1.length; i++){
//     var dist = point1[i] + (point2[i]-point1[i])*ratio;
//     translation.push(dist);
//   }
//   return translation;
// };
//
// MyLinearAnimation.prototype.calculateTransformation = function(currentTime){
//   var m = mat4.create();
//   if(this.currentTime == -1){
//     this.currentTime = currentTime;
//     return m;
//   }
//   var timePassed = (currentTime - this.currentTime)/1000;
//   if(timePassed >= this.timeSpan)	{
//     this.isComplete = true;
// 		mat4.translate(m, m, this.controlPoints[this.controlPoints.length - 1]);
// 		mat4.rotate(m, m, this.getAngle(this.controlPoints[this.controlPoints.length - 2], this.controlPoints[this.controlPoints.length - 1]), [0, 1, 0]);
// 		return m;
// 	}
//   var totalDistance = this.velocity * timePassed;
//   var movementInfo = this.getCurrentMovement(totalDistance);
//   var movementIndex = movementInfo[0];
//   var deltaS = movementInfo[1];
//
//   var movementCompletion = deltaS / this.movementLength[movementIndex];
//
//   mat4.translate(m, m, this.getTranslation(this.controlPoints[movementIndex-1], this.controlPoints[movementIndex], movementCompletion));
//   mat4.rotate(m, m, this.getAngle(this.controlPoints[movementIndex-1], this.controlPoints[movementIndex]), [0, 1, 0]);
//
//   return m;
// };
