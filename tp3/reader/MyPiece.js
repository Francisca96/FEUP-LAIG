function MyPiece(scene, type) {
	CGFobject.call(this,scene);

  this.typeNames = ['pawn','drone','queen'];
  this.type = type;
  this.pyramid = new MyPyramid(this.scene, this.type);

  this.tile = null;
}

MyPiece.prototype = Object.create(CGFobject.prototype);
MyPiece.prototype.constructor=MyPiece;

MyPiece.prototype.display = function () {

  this.pyramid.display();

};
