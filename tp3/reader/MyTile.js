/**
 * MyTile
 * @constructor
 */
 function MyTile(scene, id, idPeca) {
 	CGFobject.call(this,scene);

  this.id = id;
  this.idPeca = idPeca;
  this.tile = new MyUnitCubeQuad(this.scene);

 	this.initBuffers();
 }

 MyTile.prototype = Object.create(CGFobject.prototype);
 MyTile.prototype.constructor = MyTile;

 MyTile.prototype.display = function() {
    this.scene.pushMatrix();
      this.scene.scale(1, 0.5, 1);
      this.tile.display();
    this.scene.popMatrix();
};
