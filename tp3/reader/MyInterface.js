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
			this.scene.cameraIndex = (this.scene.cameraIndex + 1) % this.scene.perspectives.length;
			this.scene.camera = this.scene.perspectives[this.scene.cameraIndex];
			this.setActiveCamera(this.scene.camera);
			break;
	}
};

/**
 * processMouse
 * @param event {Event}
 */
MyInterface.prototype.processMouseDown = function(event) {

	CGFinterface.prototype.processMouseDown.call(this,event);
		// console.log("x: ", event.x);
		// console.log("y: ", event.y);
};
