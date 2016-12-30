/**
 * MyTile
 * @constructor
 */
 function MyTile(scene, id, piece) {
 	CGFobject.call(this,scene);

  this.id = id;
  this.piece = piece;
  this.tile = new MyUnitCubeQuad(this.scene);
  this.selected=false;
  this.highlighted=false;

  this.redMaterial = new CGFappearance(this.scene);
  this.redMaterial.setDiffuse(0.7,0,0,1);
  this.redMaterial.setSpecular(0.7,0,0,1);
  this.redMaterial.setAmbient(0.7,0.1,0.1,1);

  this.yellowMaterial = new CGFappearance(this.scene);
  this.yellowMaterial.setDiffuse(0.8,0.8,0,1);
  this.yellowMaterial.setSpecular(0.8,0.8,0,1);
  this.yellowMaterial.setAmbient(0.8,0.8,0,1);
 }

 MyTile.prototype = Object.create(CGFobject.prototype);
 MyTile.prototype.constructor = MyTile;

 MyTile.prototype.display = function() {
    this.scene.pushMatrix();
      this.scene.scale(1, 0.5, 1);
      if(this.selected)
        this.redMaterial.apply();
      if(this.highlighted)
        this.yellowMaterial.apply();
      this.tile.display();
    this.scene.popMatrix();
};
