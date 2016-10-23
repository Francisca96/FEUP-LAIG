/**
 * MyCylinder
 * @constructor
 */
 function MyCylinder(scene, base, top, height, slices, stacks) {
 	CGFobject.call(this,scene);


  this.height = height;
	this.base = new MyPolygon(scene, slices, base);
	this.top = new MyPolygon(scene, slices, top);
	this.tube = new MyOpenCylinder(scene, base, top, height, slices, stacks);

 	this.initBuffers();
 }

 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;

 MyCylinder.prototype.display = function() {

    this.scene.pushMatrix();
        this.tube.display();
    this.scene.popMatrix();

 	this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.base.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0, 0, this.height);
        this.top.display();
    this.scene.popMatrix();
};
