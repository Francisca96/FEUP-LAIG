
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.axis=new CGFaxis(this);

	this.enableTextures(true);

	//scene primitives
    this.grass = new MyRectangle(this, "grass", -1, -1, 1, 1);
    this.poolTop = new MyRectangle(this, "poolTop", -1, -1, 1, 1);
    this.poolEdge = new MyRectangle(this, "poolEdge", -1, -1, 1, 1);
    this.ball = new MySphere(this, "ball", 0.5, 40, 40);
    this.table = new MyCylinder(this, "table", 4, 12, 1, 40, 40);
    //this.towel = new MyPolygon(this, 30, 12);
    this.buoy = new MyTorus(this, 1, 2, 40, 40);

    // Materials
	this.materialDefault = new CGFappearance(this);

	this.grassMaterial = new CGFappearance(this);
	this.grassMaterial.setAmbient(0.3,0.3,0.3,1);
	this.grassMaterial.setDiffuse(0.5,0.5,0.5,1);
	this.grassMaterial.setSpecular(0.8,0.8,0.8,1);
	this.grassMaterial.setShininess(100);
	this.grassMaterial.loadTexture("../resources/images/grass.png");
	this.grassMaterial.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");

	this.poolTopMaterial = new CGFappearance(this);
	this.poolTopMaterial.setAmbient(0.3,0.3,0.3,1);
	this.poolTopMaterial.setDiffuse(0.5,0.5,0.5,1);
	this.poolTopMaterial.setSpecular(0.8,0.8,0.8,1);
	this.poolTopMaterial.loadTexture("../resources/images/poolTop.png");
	this.poolTopMaterial.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");

	this.poolEdgeMaterial = new CGFappearance(this);
	this.poolEdgeMaterial.setAmbient(0.3,0.3,0.3,1);
	this.poolEdgeMaterial.setDiffuse(0.5,0.5,0.5,1);
	this.poolEdgeMaterial.setSpecular(0.8,0.8,0.8,1);
	this.poolEdgeMaterial.setShininess(100);
	this.poolEdgeMaterial.loadTexture("../resources/images/poolEdge.png");
	this.poolEdgeMaterial.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");

	this.ballMaterial = new CGFappearance(this);
	this.ballMaterial.setAmbient(0.3,0.3,0.3,1);
	this.ballMaterial.setDiffuse(0.5,0.5,0.5,1);
	this.ballMaterial.setSpecular(0.8,0.8,0.8,1);
	this.ballMaterial.setShininess(100);
	this.ballMaterial.loadTexture("../resources/images/ball.png");
	this.ballMaterial.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");

	this.tableMaterial = new CGFappearance(this);
	this.tableMaterial.setAmbient(0.3,0.3,0.3,1);
	this.tableMaterial.setDiffuse(0.5,0.5,0.5,1);
	this.tableMaterial.setSpecular(0.8,0.8,0.8,1);
	this.tableMaterial.setShininess(100);
	this.tableMaterial.loadTexture("../resources/images/wood.png");
	this.tableMaterial.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");

	// this.tableTowelMaterial = new CGFappearance(this);
	// this.tableTowelMaterial.setAmbient(0.3,0.3,0.3,1);
	// this.tableTowelMaterial.setDiffuse(0.5,0.5,0.5,1);
	// this.tableTowelMaterial.setSpecular(0.8,0.8,0.8,1);
	// this.tableTowelMaterial.setShininess(100);
	// this.tableTowelMaterial.loadTexture("../resources/images/towel.png");
	// this.tableTowelMaterial.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");

	this.buoyMaterial = new CGFappearance(this);
	this.buoyMaterial.setAmbient(0.3,0.3,0.3,1);
	this.buoyMaterial.setDiffuse(0.5,0.5,0.5,1);
	this.buoyMaterial.setSpecular(0.8,0.8,0.8,1);
	this.buoyMaterial.setShininess(100);
	this.buoyMaterial.loadTexture("../resources/images/buoy.png");
	this.buoyMaterial.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
};

XMLscene.prototype.initLights = function () {

	this.lights[0].setPosition(2, 5, 3, 1);
	this.lights[0].setAmbient(0.7, 0.7, 0.7, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();

    this.lights[1].setPosition(5, 5, 3, 1);
	this.lights[1].setAmbient(0.7, 0.7, 0.7, 1);
	this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[1].update();

	this.lights[2].setPosition(3.5, 5, 5, 1);
	this.lights[2].setAmbient(0.7, 0.7, 0.7, 1);
	this.lights[2].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[2].update();

	this.lights[3].setPosition(3.5, 5, 1, 1);
	this.lights[3].setAmbient(0.7, 0.7, 0.7, 1);
	this.lights[3].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[3].update();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
};

// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function ()
{
	//this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	this.lights[0].setVisible(true);
    this.lights[0].enable();

    this.lights[1].setVisible(true);
    this.lights[1].enable();

    this.lights[2].setVisible(true);
    this.lights[2].enable();

    this.lights[3].setVisible(true);
    this.lights[3].enable();
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup

	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();

	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
		this.lights[0].update();
		this.lights[1].update();
		this.lights[2].update();
		this.lights[3].update();
	};

	this.pushMatrix();
		this.scale(5, 0, 3);
		this.translate(1, 0, 1);
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.grassMaterial.apply();
        this.grass.display();
    this.popMatrix();

    //POOL
    this.pushMatrix();
		this.scale(2.5, 0, 1.5);
		this.translate(1.4, 0.15, 1.7);
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.poolTopMaterial.apply();
        this.poolTop.display();
    this.popMatrix();

    //EDGE
    this.pushMatrix();
		this.scale(0.5, 0, 0.2);
		this.translate(3, 0.15, 4.3);
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.poolEdgeMaterial.apply();
        this.poolEdge.display();
    this.popMatrix();

    this.pushMatrix();
		this.scale(0.5, 0, 0.2);
		this.translate(5, 0.15, 4.3);
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.poolEdgeMaterial.apply();
        this.poolEdge.display();
    this.popMatrix();

    this.pushMatrix();
		this.scale(0.5, 0, 0.2);
		this.translate(7, 0.15, 4.3);
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.poolEdgeMaterial.apply();
        this.poolEdge.display();
    this.popMatrix();

    this.pushMatrix();
		this.scale(0.5, 0, 0.2);
		this.translate(9, 0.15, 4.3);
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.poolEdgeMaterial.apply();
        this.poolEdge.display();
    this.popMatrix();

    this.pushMatrix();
		this.scale(0.5, 0, 0.2);
		this.translate(11, 0.15, 4.3);
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.poolEdgeMaterial.apply();
        this.poolEdge.display();
    this.popMatrix();

    this.pushMatrix();
		this.scale(0.5, 0, 0.2);
		this.translate(3, 0.15, 21.2);
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.poolEdgeMaterial.apply();
        this.poolEdge.display();
    this.popMatrix();

    this.pushMatrix();
		this.scale(0.5, 0, 0.2);
		this.translate(5, 0.15, 21.2);
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.poolEdgeMaterial.apply();
        this.poolEdge.display();
    this.popMatrix();

    this.pushMatrix();
		this.scale(0.5, 0, 0.2);
		this.translate(7, 0.15, 21.2);
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.poolEdgeMaterial.apply();
        this.poolEdge.display();
    this.popMatrix();

    this.pushMatrix();
		this.scale(0.5, 0, 0.2);
		this.translate(9, 0.15, 21.2);
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.poolEdgeMaterial.apply();
        this.poolEdge.display();
    this.popMatrix();

    this.pushMatrix();
		this.scale(0.5, 0, 0.2);
		this.translate(11, 0.15, 21.2);
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.poolEdgeMaterial.apply();
        this.poolEdge.display();
    this.popMatrix();

    this.pushMatrix();
		this.scale(0.2, 0, 0.5);
		this.translate(4.2, 0.15, 2.3);
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.poolEdgeMaterial.apply();
        this.poolEdge.display();
    this.popMatrix();

    this.pushMatrix();
		this.scale(0.2, 0, 0.5);
		this.translate(4.2, 0.15, 4.3);
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.poolEdgeMaterial.apply();
        this.poolEdge.display();
    this.popMatrix();

    this.pushMatrix();
		this.scale(0.2, 0, 0.5);
		this.translate(4.2, 0.15, 6.3);
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.poolEdgeMaterial.apply();
        this.poolEdge.display();
    this.popMatrix();

    this.pushMatrix();
		this.scale(0.2, 0, 0.5);
		this.translate(4.2, 0.15, 7.9);
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.poolEdgeMaterial.apply();
        this.poolEdge.display();
    this.popMatrix();

    this.pushMatrix();
		this.scale(0.2, 0, 0.5);
		this.translate(31, 0.15, 2.3);
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.poolEdgeMaterial.apply();
        this.poolEdge.display();
    this.popMatrix();

    this.pushMatrix();
		this.scale(0.2, 0, 0.5);
		this.translate(31, 0.15, 4.3);
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.poolEdgeMaterial.apply();
        this.poolEdge.display();
    this.popMatrix();

    this.pushMatrix();
		this.scale(0.2, 0, 0.5);
		this.translate(31, 0.15, 6.3);
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.poolEdgeMaterial.apply();
        this.poolEdge.display();
    this.popMatrix();

    this.pushMatrix();
		this.scale(0.2, 0, 0.5);
		this.translate(31, 0.15, 7.9);
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.poolEdgeMaterial.apply();
        this.poolEdge.display();
    this.popMatrix();

    //BALL
    this.pushMatrix();
		this.scale(0.7, 0.7, 0.7);
		this.translate(2.5, 0.35, 3);
		this.ballMaterial.apply();
        this.ball.display();
    this.popMatrix();

    //TABLE
  	this.pushMatrix();
		this.translate(8.5, 0.05, 2);
		this.scale(0.05, 0.7, 0.05);
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.tableMaterial.apply();
        this.table.display();
    this.popMatrix();

  //   this.pushMatrix();
		// this.translate(8.5, 0.76, 2);
		// this.scale(0.05, 0.7, 0.05);
		// this.rotate(-Math.PI/2, 1, 0, 0);
		// this.tableTowelMaterial.apply();
  //       this.towel.display();
  //   this.popMatrix();

    //BUOY
    this.pushMatrix();
		this.translate(5, 0.05, 3.5);
		this.scale(0.15, 0.15, 0.15);
		this.rotate(-Math.PI/2, 1, 0, 0);
		this.buoyMaterial.apply();
        this.buoy.display();
    this.popMatrix();



    /////////////////////////////////////////////////////////
    this.pushMatrix();
         //this.triangle.display();
    this.popMatrix();
 
    this.pushMatrix();
        //this.cylinder.display();
    this.popMatrix();
 
    this.pushMatrix();
        //this.sphere.display();
    this.popMatrix();
 
    // this.pushMatrix();
    //     this.torus.display();
    // this.popMatrix();
};
