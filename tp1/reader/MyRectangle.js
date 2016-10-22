/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyRectangle(scene, id, x0, y0, x1, y1, minS=0, maxS=1, minT=0, maxT=1) {
	CGFobject.call(this,scene);

	this.id=id;
	this.x0=x0;
	this.x1=x1;
	this.y0=y0;
	this.y1=y1;
	this.minS = minS;
	this.maxS = maxS;
	this.minT = minT;
	this.maxT = maxT;

	this.initBuffers();
};

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor=MyRectangle;

MyRectangle.prototype.initBuffers = function () {
	this.vertices = [
            this.x0, this.y0, 0,
            this.x1, this.y0, 0,
            this.x0, this.y1, 0,
            this.x1, this.y1, 0,
	];

	this.indices = [
            0, 1, 2,
            3, 2, 1
    ];

    this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
    ];

	this.texCoords = [
			this.minS, this.maxT,
			this.maxS, this.maxT,
			this.minS, this.minT,
			this.maxS, this.minT
	]

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
