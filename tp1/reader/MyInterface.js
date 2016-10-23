/**
 * MyInterface
 * @constructor
 */

function MyInterface() {
	//call CGFinterface constructor
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);

	this.gui = new dat.GUI();

	var groupO=this.gui.addFolder("Omni Lights");
	groupO.open();

	var groupS=this.gui.addFolder("Spot Lights");
	groupS.open();

	return true;
};

/**
 * processKeyboard
 * @param event {Event}
 */
MyInterface.prototype.processKeyDown = function(event) {
	
	CGFinterface.prototype.processKeyDown.call(this,event);

	switch (event.keyCode)
	{
		case (109): //m
		case (77):
			
			break;
		case (118): //v
		case(86):
			
			break;	
	};
};

MyInterface.prototype.processKeyUp = function(event) {
	
	CGFinterface.prototype.processKeyUp.call(this,event);

	switch (event.keyCode)
	{
		case (109): //M
		case (77):
			
			break;
		case (118): //V
		case(86):
			
			break;
	};
};
