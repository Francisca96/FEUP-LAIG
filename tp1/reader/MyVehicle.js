	/**
	 * MyObject
	 * @param gl {WebGLRenderingContext}
	 * @constructor
	 */
	function MyVehicle(scene){
		CGFobject.call(this,scene);

		var controlPoints1 = [
			[0.26, 0.6, 0],
			[0.4, 1.7, 0],
			[1.7, 2.2, 0],
			[2, 0.7, 0],
			[0.26, 0.6, 1.35],
			[0.4, 1.7, 1.35],
			[1.7, 2.2, 1.35],
			[2, 0.7, 1.35],

			[0.26, 0.6, 1.35],
			[0.4, 1.7, 1.35],
			[1.7, 2.2, 1.35],
			[2, 0.7, 1.35],
			[0.26, 0.6, 0],
			[0.4, 1.7, 0],
			[1.7, 2.2, 0],
			[2, 0.7, 0]
		];

		var controlPoints2 = [
			[0, 0, 1],
			[0.25, 0.7, 1],
			[3, 0, 1],
			[2.7, 0.7, 1]
		];

		this.patch1 = new MyPatch(this.scene, 3, 3, 40, 40, controlPoints1);
		this.patch2 = new MyPatch(this.scene, 1, 1, 40, 40, controlPoints2);
		this.cylinder = new MyCylinder(this.scene, 0.3, 0.3, 1.2, 40, 40);
		this.rectangle = new MyRectangle(this.scene, 0, 0, 1, 1);

		//materials/textures
		this.defaultMaterial = new CGFappearance(this.scene);

		this.carMaterial = new CGFappearance(this.scene);
		this.carMaterial.loadTexture("../resources/images/car.png");

		this.hoodMaterial = new CGFappearance(this.scene);
		this.hoodMaterial.loadTexture("../resources/images/hood.png");

		this.cylinderMaterial = new CGFappearance(this.scene);
		this.cylinderMaterial.loadTexture("../resources/images/wheel.png");

		this.benchMaterial = new CGFappearance(this.scene);
		this.benchMaterial.loadTexture("../resources/images/bench.png");
	}

	MyVehicle.prototype = Object.create(CGFobject.prototype);
	MyVehicle.prototype.constructor=MyVehicle;

	MyVehicle.prototype.display = function () {
		this.scene.pushMatrix();
		this.scene.translate(-1.35, -0.7, -0.5);
		this.scene.pushMatrix();
			this.hoodMaterial.apply();
			this.patch1.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.carMaterial.apply();
			this.patch2.display();
			this.scene.translate(0, 0, -1);
			this.patch2.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.scale(-1, 1, 1);
			this.scene.translate(-3, 0, 0);
			this.carMaterial.apply();
			this.patch2.display();
			this.scene.translate(0, 0, -1);
			this.patch2.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.translate(0.7, 0, -0.1);
			this.cylinderMaterial.apply();
			this.cylinder.display();
			this.scene.translate(1.2, 0, 0);
			this.cylinderMaterial.apply();
			this.cylinder.display();
		this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.scale(0.3, 0.75, 0.7);
		this.scene.translate(1.35, 0.8, 0.1);
		this.benchMaterial.apply();
		this.cylinder.display();
		this.scene.translate(3, 0, 0);
		this.cylinder.display();
	this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.scale(2.55, 1, 1);
			this.scene.translate(0.1, 0.3, 1);
			this.scene.rotate(-Math.PI/2, 1, 0, 0);
			this.carMaterial.apply();
			this.rectangle.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.rotate(Math.PI/2, 1, 0, 0);
			this.scene.scale(3, 1, 1);
			this.rectangle.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.rotate(-Math.PI/2, 1, 0, 0);
			this.scene.translate(2, -1, 0.7);
			this.scene.scale(0.7, 1, 1);
			this.carMaterial.apply();
			this.rectangle.display();
			this.scene.translate(1, 0, 0);
			this.scene.scale(1, 1, 0.8);
			this.scene.rotate(Math.PI/2.7, 0, 1, 0);
			this.carMaterial.apply();
			this.rectangle.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.rotate(-Math.PI/8, 0, 0, 1);
			this.scene.rotate(-Math.PI/2, 0, 1, 0);
			this.scene.scale(1, 0.75, 1);
			this.carMaterial.apply();
			this.rectangle.display();
		this.scene.popMatrix();

	};
