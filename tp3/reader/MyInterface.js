/**
 * MyInterface
 * @constructor
 */

function MyInterface() {
	//call CGFinterface constructor
	CGFinterface.call(this);
}

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	CGFinterface.prototype.init.call(this, application);
	this.gui = new dat.GUI();
	this.scenes = this.gui.addFolder("Scenes");
	this.scenes.open();
	this.gui.scene = 'Mars';
	this.gui.sceneList = this.scenes.add(this.gui, 'scene', ['Mars', 'Football', 'House']);
	this.gui.sceneList.onFinishChange(function(){
		while(this.lights.__controllers.length>0)
			this.lights.remove(this.lights.__controllers[0]);
		this.scene.changeGraph(this.gui.scene + '.dsx.xml');
	}.bind(this))
	this.lights = this.gui.addFolder("Lights");
	this.lights.open();

	return true;
};

// Adds a button with name id connected to the index i of the lightstatus array.
MyInterface.prototype.addLightButton = function(i, id){
	this.lights.add(this.scene.lightStatus, i, this.scene.lightStatus[i]).name(id);
};

/**
 * processKeyboard
 * @param event {Event}
 */
MyInterface.prototype.processKeyDown = function(event) {

	CGFinterface.prototype.processKeyDown.call(this,event);
	// console.log(event.keyCode);
	switch (event.keyCode)
	{
		case (109): //m
		case (77):
				for(var key in this.scene.graph.components){
					this.scene.graph.components[key].currentMaterial = (this.scene.graph.components[key].currentMaterial + 1) %  this.scene.graph.components[key].materials.length;
				}
			break;
		case (118): //v
		case(86):
		  var previousCamera = this.scene.perspectives[this.scene.cameraIndex];
			this.scene.cameraIndex = (this.scene.cameraIndex + 1) % this.scene.perspectives.length;
			this.scene.camera = this.scene.perspectives[this.scene.cameraIndex];
			this.scene.movingCamera = true;
			this.scene.cameraAnimation = new MyViewAnimation(this.scene.CAMERA_ANIMATION_DURATION, this.scene, previousCamera, this.scene.camera);
			this.setActiveCamera(this.scene.camera);
			break;
	}
};

MyInterface.prototype.removeFolder = function(name,parent) {
	if(!parent)
		parent = this.gui;
  var folder = parent.__folders[name];
  if (!folder) {
    return;
  }
  folder.close();
  parent.__ul.removeChild(folder.domElement.parentNode);
  delete parent.__folders[name];
  parent.onResize();
};

// Game Commands
