function MyPiece(scene, type, id) {
	CGFobject.call(this,scene);

  this.typeNames = ['pawn','drone','queen'];
	this.originalType = type;
  this.type = type;
  this.pyramid = new MyPyramid(this.scene, this.type);

	this.id = id;
  this.tile = null;
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
  	this.pyramid.display();
	this.scene.popMatrix();

};
