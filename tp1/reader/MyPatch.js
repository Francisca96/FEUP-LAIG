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
	
	this.getControlVertexes(controlPoints);

	var knotsU = this.getKnots(this.orderU);
	var knotsV = this.getKnots(this.orderV);

	//Create Surface
	var nurbsSurface = new CGFnurbsSurface(this.orderU, this.orderV, knotsU, knotsV, this.controlPoints);

	getSurfacePoint = function(u, v){
		return nurbsSurface.getPoint(u, v);
	};

	//Create Object
	this.surface = new CGFnurbsObject(this.scene, getSurfacePoint, this.partsU, this.partsV);
}

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor=MyPatch;

MyPatch.prototype.display = function () {
		this.patch.display();
};

MyPatch.prototype.getKnots = function(order){
	var knots = [];

	for(var i = 0; i <= order; i++) {
		knots.push(0);
	}
	for(i = 0; i <= order; i++) {
		knots.push(1);
	}

	return knots;
};

MyPatch.prototype.getControlVertexes = function(controlPoints){
	// console.log(controlPoints)
	this.controlPoints = [];
	for(var i = 0; i <= this.orderU; i++) {
		var tmp = [];
		for(var j = 0; j <= this.orderV; j++) {
			var vec = controlPoints.shift();
			vec.push(1);
			tmp.push(vec);
		}
		this.controlPoints.push(tmp);
	}
};
