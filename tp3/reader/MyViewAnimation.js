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

function getAngle(point1, point2){
  console.log(point2[0]-point1[0]);
  console.log(point2[2]-point1[2]);
  if(point2[0]-point1[0] < 0)
    return -Math.PI + Math.acos((point2[2]-point1[2])/(point2[0]-point1[0]));
  else
    return Math.acos((point2[2]-point1[2])/(point2[0]-point1[0]));
}

function lerp(val1, val2, ratio) {
	return val1 * (1.0 - ratio) + (val2 * ratio);
}

MyViewAnimation.prototype.update = function(currentTime){
  // console.log("here");
  var timePassed = (currentTime - this.initialTime)/1000;

  var movementRatio = timePassed/this.timeSpan;

  // console.log('timePassed ' +  timePassed + ' < ' + this.timeSpan);

  if(timePassed >= this.timeSpan){
    this.scene.camera = this.finalView;
    this.scene.movingCamera = false;
    this.scene.cameraAnimation = null;
    // this.scene.
    return;
  }

  // ** getting the point directly above target, on y = movementcurrentheight **

  // getting point with initial height
  var pointAboveTargetInitialY = vec3.clone(this.finalView.target);
  pointAboveTargetInitialY[1] = this.initialView.position[1];

  // getting point with final height
	var pointAboveTargetFinalY = vec3.clone(this.finalView.target);
	pointAboveTargetFinalY[1] = this.finalView.position[1];

  //interpoling heights
	var pointAboveTarget = vec3.lerp(vec3.create(), pointAboveTargetInitialY, pointAboveTargetFinalY, movementRatio);

  // ** get direction vectors ignoring y **

  var initialDirection = vec3.sub(vec3.create(), this.initialView.position, pointAboveTargetInitialY);
  var finalDirection = vec3.sub(vec3.create(), this.finalView.position, pointAboveTargetFinalY);

  // ** calculate angle **

	var angle = 0;
	if (vec3.length(initialDirection) > 0 && vec3.length(finalDirection) > 0){
		var dotProduct = vec3.dot(initialDirection, finalDirection);
		angle = Math.acos(dotProduct / (vec3.length(initialDirection) * vec3.length(finalDirection))) * movementRatio;
		var crossProduct = vec3.cross(vec3.create(), initialDirection, finalDirection);
		if (vec3.dot(CGFcameraAxis.Y, crossProduct) > 0) angle = -angle;
	}

	var cosAngle = Math.cos(angle);
	var sinAngle = Math.sin(angle);

  // ** calculate arc radius **

	var scalarRadius = lerp(vec3.length(initialDirection), vec3.length(finalDirection), movementRatio);
	var radiusVector = vec3.fromValues(initialDirection[0] * cosAngle - initialDirection[2] * sinAngle,
                                     initialDirection[1],
                                     initialDirection[0] * sinAngle + initialDirection[2] * cosAngle);

  // give the vector the correct length
	radiusVector = vec3.scale(vec3.create(), vec3.normalize(vec3.create(), radiusVector), scalarRadius);

  // camera position should be a radius vector away from the point above the target
	var cameraPosition = vec3.add(vec3.create(), pointAboveTarget, radiusVector);

  var fov = lerp(this.initialView.fov, this.finalView.fov, movementRatio);

  this.scene.camera = new CGFcamera(fov, this.finalView.near, this.finalView.far, cameraPosition, this.finalView.target);

};
