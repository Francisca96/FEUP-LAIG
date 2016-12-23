function MyPyramid(scene, size) {
	CGFobject.call(this,scene);

	this.size=size;

	this.height = Math.sqrt(1 - 1/3);

	//virado para baixo
	this.base = new MyTriangle(this.scene, -0.5, 0, -1/(2*Math.sqrt(3)), 0.5, 0, -1/(2*Math.sqrt(3)), 0, 0, Math.sqrt(0.75)-(1/(2*Math.sqrt(3))));
	//virado para cima
	this.triangle1 = new MyTriangle(this.scene, 0.5, 0, -1/(2*Math.sqrt(3)), -0.5, 0, -1/(2*Math.sqrt(3)), 0, this.height, 0);
	//virado para cima,
	this.triangle2 = new MyTriangle(this.scene, -0.5, 0, -1/(2*Math.sqrt(3)), 0, 0, Math.sqrt(0.75)-(1/(2*Math.sqrt(3))), 0, this.height, 0);
	//virado para cima
	this.triangle3 = new MyTriangle(this.scene, 0, 0, Math.sqrt(0.75)-(1/(2*Math.sqrt(3))), 0.5, 0, -1/(2*Math.sqrt(3)), 0, this.height, 0);

	//materials/textures
	this.defaultMaterial = new CGFappearance(this.scene);

	this.pyramidMaterial = new CGFappearance(this.scene);
	this.pyramidMaterial.loadTexture("../resources/images/wood.png");

	this.pyramidMaterial1 = new CGFappearance(this.scene);
	this.pyramidMaterial1.loadTexture("../resources/images/metal.png");

	this.pyramidMaterial2 = new CGFappearance(this.scene);
	this.pyramidMaterial2.loadTexture("../resources/images/bench.png");
}

MyPyramid.prototype = Object.create(CGFobject.prototype);
MyPyramid.prototype.constructor=MyPyramid;

MyPyramid.prototype.display = function () {

	this.scene.scale(this.size/2, this.size/2, this.size/2);

	this.scene.pushMatrix();
		this.pyramidMaterial.apply();
		this.base.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.triangle1.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.pyramidMaterial1.apply();
		this.triangle2.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.pyramidMaterial2.apply();
		this.triangle3.display();
	this.scene.popMatrix();
}
