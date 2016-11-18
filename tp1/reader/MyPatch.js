/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyPatch(scene, orderU, orderV, partsU, partsV, controlPoints){
	CGFobject.call(this,scene);

	this.orderU = orderU;
	this.orderV = orderV;
	this.partsU = partsU;
	this.partsV = partsV;
	this.controlPoints = getControlVertexes(this.orderU, this.orderV, this.controlPoints);

	var knotsU = getKnots(this.orderU);
	var knotsV = getKnots(this.orderV);

	//Create Surface
	this.surface = new CGFnurbsSurface(this.orderU, this.orderV, knotsU, knotsV, this.controlPoints); 	

	//Create Object
	this.patch = new CGFnurbsObject(this.scene, this.getSurfacePoint, this.partsU, this.partsV);	
};

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor=MyPatch;

MyPatch.prototype.getSurfacePoint = function(){
	return this.surface.getPoint(u, v);
};

MyPatch.prototype.display = function () {
	this.scene.pushMatrix();
		this.patch.display();
	this.scene.popMatrix();
};

getKnots = function(order){
	var knots = [];

	for (var i=0; i<=order; i++) {
		knots.push(0);
	}
	for (var j=order+1; j<=(order*2)+1; i++) {
		knots.push(1);
	}

	return knots;
};

getControlVertexes = function(orderU, orderV, controlPoints){
	var controlVertexes;

	for(var i = 0; i <= orderU; i++) {
		var tmp = [];
		for(var j = 0; j <= orderV; j++) {
			tmp.push(controlPoints[j]);
		}
		controlVertexes.push(tmp);
	}

	return controlVertexes;
};

