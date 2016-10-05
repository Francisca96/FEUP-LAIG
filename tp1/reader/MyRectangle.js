/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyRectangle(scene, id, x0, y0, x1, y1) {
	CGFobject.call(this,scene);

	this.id=id;
	this.x0=x0;
	this.x1=x1;
	this.y0=y0;
	this.y1=y1;

	this.initBuffers();
};

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor=MyRectangle;

MyRectangle.prototype.initBuffers = function () {
	this.vertices = [
            x0, y0, 0,
            x1, y0, 0,
            x0, y1, 0,
            x1, y1, 0,
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
			0, 1, //pode-se ter que mudar
			1, 1,
			0, 0,
			1, 0
	]
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
