/**
 * MySphere
 * @constructor
 */
 function MySphere(scene, id, radius, slices, stacks) {
 	CGFobject.call(this,scene);

 	this.id = id;
 	this.radius = radius;
	this.slices = slices;
	this.stacks = stacks;

 	this.initBuffers();
 };

 MySphere.prototype = Object.create(CGFobject.prototype);
 MySphere.prototype.constructor = MySphere;

 MySphere.prototype.initBuffers = function() {
	this.horizontalAng = Math.PI*2/this.slices; //com MATH.PI nos 2 funciona +/- bem
	this.verticalAng = Math.PI/this.stacks;

	this.stackSize = 1/this.stacks;

	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords =[];

	for(j = 0; j <= this.stacks; j++){
		for(i = 0 ; i < this.slices; i++) {
			var x = Math.cos(this.horizontalAng*i) * Math.sin(this.verticalAng*j) * radius;
			var y = Math.sin(this.horizontalAng*i) * Math.sin(this.verticalAng*j) * radius;
			var z = Math.cos(this.verticalAng*j) * radius;
			this.vertices.push(x, y, z);
			this.normals.push(x, y, z);
			this.texCoords.push((x+1)/2, (y+1)/2);
		}
	}

	for(i = 0; i < this.stacks; i++){
		for(j = 0; j < this.slices; j++){
      this.indices.push(i*this.slices+j, (i+1)*this.slices+j, i*this.slices+j+1);
      if(i != this.stacks-1 || j != this.slices-1)
      this.indices.push(i*this.slices+j+1, (i+1)*this.slices+j, ((i+1)*this.slices+j+1)%(this.slices*(this.stacks+1)));
		}
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
