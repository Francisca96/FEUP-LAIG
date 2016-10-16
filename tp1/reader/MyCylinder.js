/**
 * MyCylinder
 * @constructor
 */
 function MyCylinder(scene, id, base, top, height, slices, stacks) {
 	CGFobject.call(this,scene);

	this.id = id;
	this.base = new MyPolygon(scene, slices, base);
	this.top = new MyPolygon(scene, slices, top);
	this.tube = new MyOpenCylinder(scene, height, slices, stacks);

 	this.initBuffers();
 };

 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;

 MyCylinder.prototype.display = function() {
 	this.tube.display();

 	this.scene.pushMatrix();
        this.scene.translate(0, this.height/2, 0);
        this.top.display();
        this.scene.translate(0, -this.height, 0);
        this.base.display();
    this.scene.popMatrix();
};
