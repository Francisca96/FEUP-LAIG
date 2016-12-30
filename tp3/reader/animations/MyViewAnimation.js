/**
 * MyViewAnimation
 * @constructor
 */
 function MyViewAnimation(timeSpan, scene, initialView, finalView) {
   MyAnimation.apply(this, arguments);

   this.scene = scene;

   this.initialTime = this.scene.time;

   this.initialView = initialView;
   this.finalView = finalView;

   this.scene.camera = this.initialView;
 }

MyViewAnimation.prototype = new MyAnimation();
MyViewAnimation.prototype.constructor = MyViewAnimation;

MyViewAnimation.prototype.isComplete = function(currentTime){
  var timePassed = (currentTime - this.initialTime)/1000;

  return timePassed > this.timeSpan;
};

MyViewAnimation.prototype.distance = function(point1, point2) {
    return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2) + Math.pow(point1[2] - point2[2], 2));
};

MyViewAnimation.prototype.midPoint = function(point1, point2, movementRatio) {
    return [(point1[0] * (1-movementRatio) + point2[0] * movementRatio),
            (point1[1] * (1-movementRatio)+ point2[1] * movementRatio) ,
            (point1[2]*(1-movementRatio) + point2[2]*movementRatio),
            (point1[3]*(1-movementRatio) + point2[3]*movementRatio)];
};

function linearInterpolation(val1, val2, ratio) {
	return val1 * (1.0 - ratio) + (val2 * ratio);
}

function vectorLinearInterpolation(vec1, vec2, ratio){
  var result = [];
  for(var i = 0; i < vec1.length; i++)
    result.push(linearInterpolation(vec1[i], vec2[i], ratio));
  return result;
}

function calculateVector(point1, point2){
  var result = [];
  for(var i = 0; i < point1.length; i++)
    result.push(point2[i]-point1[i]);
  return result;
}

MyViewAnimation.prototype.update = function(currentTime){
  var timePassed = (currentTime - this.initialTime)/1000;
  var movementRatio = timePassed/this.timeSpan;

  if(timePassed >= this.timeSpan){
    this.scene.movingCamera = false;
    this.scene.cameraAnimation = null;
    return;
  }

  var initialDirection = calculateVector(this.initialView.position, this.initialView.target);
  var finalDirection = calculateVector(this.finalView.position, this.finalView.target);

  var angle = 0;
  if (vec3.length(initialDirection) > 0 && vec3.length(finalDirection) > 0){
    	var dotProduct = vec3.dot(initialDirection, finalDirection);
    	angle = Math.acos(dotProduct / (vec3.length(initialDirection) * vec3.length(finalDirection)));

      var crossProduct = vec3.create();
    	vec3.cross(crossProduct, initialDirection, finalDirection);
    	if (vec3.dot([0,1,0], crossProduct) > 0) angle = -angle;
  }

  var finalY = linearInterpolation(this.initialView.position[1],this.finalView.position[1],movementRatio);
  var cameraPosition = [
    this.initialView.position[0] * Math.cos(angle*movementRatio) - this.initialView.position[2] * Math.sin(angle*movementRatio),
    finalY,
    this.initialView.position[0] * Math.sin(angle*movementRatio) + this.initialView.position[2] * Math.cos(angle*movementRatio)
  ]

  var fov = linearInterpolation(this.initialView.fov, this.finalView.fov, movementRatio);
  var target = vectorLinearInterpolation(this.initialView.target, this.finalView.target, movementRatio);

  this.scene.camera = new CGFcamera(fov, this.finalView.near, this.finalView.far, cameraPosition, target);

};
