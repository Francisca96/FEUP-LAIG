/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyPanel(scene, nLines, nColumns) {
	CGFobject.call(this,scene);

	this.nLines = nLines;
	this.nColumns = nColumns;

	this.panel=new MyUnitCubeQuad(this.scene);
	this.rectangle=new MyRectangle(this.scene, 0, 0, 1, 1);

	this.grayMaterial = new CGFappearance(this.scene);
  this.grayMaterial.setDiffuse(0.2,0.2,0.2,1);
  this.grayMaterial.setSpecular(0.2,0.2,0.2,1);
  this.grayMaterial.setAmbient(0.2,0.2,0.2,1);

	this.nullMaterial = new CGFappearance(this.scene);
	this.nullMaterial.setAmbient(0.8,0.8,0.8,1);
	this.nullMaterial.setDiffuse(0.8,0.8,0.8,1);
	this.nullMaterial.setSpecular(0.8,0.8,0.8,1);

	this.boardMaterial = new CGFappearance(this.scene);
	this.boardMaterial.setAmbient(0.8,0.8,0.8,1);
	this.boardMaterial.setDiffuse(0.8,0.8,0.8,1);
	this.boardMaterial.setSpecular(0.8,0.8,0.8,1);
	this.boardMaterial.loadTexture("../resources/images/scoreboard.png");
}

MyPanel.prototype = Object.create(CGFobject.prototype);
MyPanel.prototype.constructor=MyPanel;

MyPanel.prototype.display = function () {

	this.scene.pushMatrix();

		this.scene.pushMatrix();
			this.scene.scale(0.2, 0.4, 1);
			for(i = 0; i < this.nLines; i++){
				this.scene.translate(0, -1, 0);
				this.scene.pushMatrix();
				for(j = 0; j < this.nColumns; j++){
					this.nullMaterial.apply();
					this.rectangle.display();
					this.scene.translate(1, 0, 0);
				}
				this.scene.popMatrix();
			}
		this.scene.popMatrix();

		this.scene.translate(0.2*this.nColumns/2, -0.4*this.nLines/2, -0.16);
		this.scene.scale(0.2*this.nColumns, 0.4*this.nLines, 0.3);
		this.grayMaterial.apply();
		this.panel.display();
	this.scene.popMatrix();
};
