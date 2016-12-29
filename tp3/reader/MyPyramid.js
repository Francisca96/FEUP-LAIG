function MyPyramid(scene, size) {
	CGFobject.call(this,scene);

	this.size=size;

	this.height = Math.sqrt(1 - 1/3);

	//virado para baixo
	this.base = new MyQuad(this.scene);
	//virado para cima
	this.triangle1 = new MyTriangle(this.scene, 0.5, 0, -0.5, -0.5, 0, -0.5, 0, this.height, 0);
	//virado para cima,
	this.triangle2 = new MyTriangle(this.scene, -0.5, 0, -0.5, -0.5, 0, 0.5, 0, this.height, 0);
	//virado para cima
	this.triangle3 = new MyTriangle(this.scene, -0.5, 0, 0.5, 0.5, 0, 0.5, 0, this.height, 0);
	//virado para cima
	this.triangle4 = new MyTriangle(this.scene, 0.5, 0, 0.5, 0.5, 0, -0.5, 0, this.height, 0);

	//materials/textures
	this.defaultMaterial = new CGFappearance(this.scene);

	// this.pyramidMaterial = new CGFappearance(this.scene);
	// this.pyramidMaterial.loadTexture("../resources/images/wood.png");s

	this.pyramidMaterial = new CGFappearance(this.scene);
	this.pyramidMaterial.setAmbient(0.5,0.5,0.5,1);
	this.pyramidMaterial.setDiffuse(0.5,0.5,0.5,1);
	this.pyramidMaterial.setSpecular(0.5,0.5,0.5,1);
	this.pyramidMaterial.loadTexture("../resources/images/metal.png");

	// this.pyramidMaterial2 = new CGFappearance(this.scene);
	// this.pyramidMaterial2.loadTexture("../resources/images/bench.png");
}

MyPyramid.prototype = Object.create(CGFobject.prototype);
MyPyramid.prototype.constructor=MyPyramid;

MyPyramid.prototype.display = function () {

	this.scene.pushMatrix();

	this.scene.scale(0.7, 1.3, 0.7);
	this.scene.scale(this.size/3, this.size/3, this.size/3);

	this.scene.pushMatrix();
		this.scene.rotate(Math.PI/2, 1, 0, 0);
		this.pyramidMaterial.apply();
		this.base.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.triangle1.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.pyramidMaterial.apply();
		this.triangle2.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.pyramidMaterial.apply();
		this.triangle3.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.pyramidMaterial.apply();
		this.triangle4.display();
	this.scene.popMatrix();

	this.scene.popMatrix();

};
