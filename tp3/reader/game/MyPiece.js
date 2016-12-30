function MyPiece(scene, type, id) {
	CGFobject.call(this,scene);

  this.typeNames = ['pawn','drone','queen'];
	this.originalType = type;
  this.type = type;
  this.pyramid = new MyPyramid(this.scene, this.type);

	this.id = id;
  this.tile = null;

	var blueMaterial = new CGFappearance(this.scene);
	blueMaterial.setDiffuse(0,0,0.4,1);
	blueMaterial.setSpecular(0,0,0.4,1);
	blueMaterial.setAmbient(0.1,0.1,0.4,1);

	var redMaterial = new CGFappearance(this.scene);
	redMaterial.setDiffuse(0.4,0,0,1);
	redMaterial.setSpecular(0.4,0,0,1);
	redMaterial.setAmbient(0.4,0.1,0.1,1);

	var yellowMaterial = new CGFappearance(this.scene);
	yellowMaterial.setDiffuse(0.5,0.5,0.2,1);
	yellowMaterial.setSpecular(0.5,0.5,0.2,1);
	yellowMaterial.setAmbient(0.5,0.5,0.2,1);

	this.materials = [redMaterial, yellowMaterial, blueMaterial];
}

MyPiece.prototype = Object.create(CGFobject.prototype);
MyPiece.prototype.constructor=MyPiece;

MyPiece.prototype.reset = function() {
	this.type = this.originalType;
	this.update();
};

MyPiece.prototype.update = function() {
	this.pyramid = new MyPyramid(this.scene, this.type);
};

MyPiece.prototype.display = function() {

	this.scene.pushMatrix();
		// console.log(this.type);
		this.materials[this.type-1].apply();
  	this.pyramid.display();
	this.scene.popMatrix();

};
