
function XMLscene(myInterface) {
    CGFscene.call(this);
    this.interface = myInterface;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

// Initializes needed values for the scene
XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	  this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.cameraIndex = 0;
	  this.axis=new CGFaxis(this);

    this.parentMaterials = [];
    this.lightStatus = [false, false, false, false, false, false, false, false, false];

    this.time = -1;
    this.setUpdatePeriod(100/6);

    this.enableTextures(true);
    this.setPickEnabled(true);

    this.auxBoard = new MyBoard(this,6,6);
    this.scoreboard = new MyScoreBoard(this);
    this.game = new MyGameboard(this,8,4);
    this.gameAnimations = [];

    this.movingCamera = false;
    this.CAMERA_ANIMATION_DURATION = 3;
};

XMLscene.prototype.logPicking = function ()
{
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj)
				{
					var customId = this.pickResults[i][1];
					console.log("Picked object: " + obj + ", with pick id " + customId);
          this.game.pickCell(customId);
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}
	}
};

// Initializes lights
XMLscene.prototype.initLights = function () {
  this.lights[0].setPosition(2, 3, 3, 1);
  this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
  this.lights[0].update();
};

// Loads lights from the graph
XMLscene.prototype.loadLights = function() {
  for(var i = 0; i < this.graph.lights.length; i++){
    var myLight = this.graph.lights[i];

    this.lights[i].lightID = myLight.id;
    this.lights[i].setPosition(myLight.position[0], myLight.position[1], myLight.position[2], myLight.position[3]);
    this.lights[i].setAmbient(myLight.ambient[0], myLight.ambient[1], myLight.ambient[2], myLight.ambient[3]);
    this.lights[i].setDiffuse(myLight.diffuse[0], myLight.diffuse[1], myLight.diffuse[2], myLight.diffuse[3]);
    this.lights[i].setSpecular(myLight.specular[0], myLight.specular[1], myLight.specular[2], myLight.specular[3]);

    if(myLight.type == "spot"){
      this.lights[i].setSpotCutOff(myLight.spotCutOff);
      this.lights[i].setSpotDirection(myLight.spotDirection[0], myLight.spotDirection[1], myLight.spotDirection[2]);
      this.lights[i].setSpotExponent(myLight.spotExponent);
    }
    if(myLight.enabled){
      this.lights[i].enable();
    }
    else{
      this.lights[i].disable();
    }
    this.lights[i].setVisible(false);
    this.lights[i].update();
  }

  for(i = 0; i < this.graph.lights.length; i++){
    this.lightStatus[i] = this.lights[i].enabled;
    this.interface.addLightButton(i, this.lights[i].lightID);
  }
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
};


// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function ()
{
	this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
  this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

  this.axis = new CGFaxis(this, this.axisLength);

  this.cameraIndex = this.graph.perspectives[this.defaultView].index;
  this.camera = this.perspectives[this.cameraIndex];
  this.interface.setActiveCamera(this.camera);

  this.loadLights();
  this.game.addGameGUI();
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup

  this.logPicking();
	this.clearPickRegistration();

	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
  this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();

	// ---- END Background, camera and axis setup
	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
		this.lights[0].update();
    this.updateLights();
    this.processGraph("root");
	}

};

// Updates lights states
XMLscene.prototype.updateLights = function ()
{
  for(var i = 0; i < this.graph.lights.length; i++){
    if(this.lightStatus[i]){
      // console.log("enabled");
      this.lights[i].enable();
    }
    else {
      this.lights[i].disable();
    }
    this.lights[i].update();
    this.lights[i].setVisible(true);
  }
};

XMLscene.prototype.update = function(currTime) {
  var timePassed = currTime - this.time;
  this.time = currTime;

  if(this.game && this.game.currentPhase === 1){
    if(this.game.getCurrentPlayerType() === 'CPU'){
      if(!this.game.paused && this.waitedTime >= this.MOVE_WAIT_TIME/this.game.speed){
        this.game.requestAutomaticMovement();
        this.waitedTime = 0;
      }
      else
        this.waitedTime += timePassed;
    }
    if(this.game.timeout && this.game.getCurrentPlayerType() === 'Player'){
      if(!this.game.paused && this.game.scoreboard.playTime <= 0){
        this.game.requestAutomaticMovement();
        this.game.scoreboard.playTime = this.game.timeoutTime;
      }
    }
    if(this.game.timeout)
      this.game.scoreboard.playTime -= timePassed/1000;
  }

  for(var i = 0; i < this.gameAnimations.length; i++){
    this.gameAnimations[i].update(currTime);
    if(this.gameAnimations[i].isComplete(currTime)){
      this.gameAnimations.splice(i,1);
    }
  }

  if(this.movingCamera){
    this.cameraAnimation.update(currTime);
    this.interface.setActiveCamera(this.camera);
  }
};

// Processes the graph components
XMLscene.prototype.processGraph = function (nodeName)
{
  var material = null;
  if(nodeName != null){
    var node = this.graph.components[nodeName];
    if(node.materials != null && node.materials.length > 0 && node.materials[node.currentMaterial] != "inherit" && node.materials[node.currentMaterial] != "null"){
      material = this.graph.materials[node.materials[node.currentMaterial]];
      if(node.textures != null && node.textures.length > 0){
        material.setTexture(node.textures[0]);
      }
      if(material != null){
        material.apply();
      }
      this.parentMaterials.push(node.materials[node.currentMaterial]);
    }
    else if(node.materials[node.currentMaterial] == "inherit"){
      material = this.graph.materials[this.parentMaterials[this.parentMaterials.length-1]];
      material.apply();
    }
    if(node.transformations.length > 0){
      this.multMatrix(node.transformations[0]);
    }
    for(var i = 0; i < node.animations.length; i++){
      this.multMatrix(node.animations[i].calculateTransformation(this.time));
      if(!node.animations[i].isComplete)
        break;
    }
    for(i = 0; i < node.primitives.length; i++){
      this.graph.primitives[node.primitives[i]].display();
    }
    for(i = 0; i < node.subComponents.length; i++){
      this.pushMatrix();
      if(material != null) material.apply();
      this.processGraph(node.subComponents[i]);
      this.popMatrix();
    }
  }
};
