/**
 * MyChessboard
 * @constructor
 */
 function MyChessboard(scene, du, dv, texture, su, sv, c1, c2, cs) {
 	CGFobject.call(this,scene);

  var id = 0;
  this.du = du;
  this.dv = dv;
  this.matrix=[];

  for(i = 0; i < this.dv; i++){
    for(j = 0; j < this.du; j++){
      this.matrix.push(new MyTile(this.scene, id, 0));
      id++;
    }
  }

  // this.shader = new CGFshader(this.scene.gl, "shaders/my_shader.vert", "shaders/my_shader.frag");
  //
  // this.shader.setUniformsValues({du: du});
  // this.shader.setUniformsValues({dv: dv});
  // this.shader.setUniformsValues({su: su});
  // this.shader.setUniformsValues({sv: sv});
  //
  // this.shader.setUniformsValues({c1: vec4.fromValues(c1[0], c1[1], c1[2], c1[3])});
  // this.shader.setUniformsValues({c2: vec4.fromValues(c2[0], c2[1], c2[2], c2[3])});
  // this.shader.setUniformsValues({cs: vec4.fromValues(cs[0], cs[1], cs[2], cs[3])});
  //
  // this.texture = texture;

 	this.initBuffers();
 }

 MyChessboard.prototype = Object.create(CGFobject.prototype);
 MyChessboard.prototype.constructor = MyChessboard;

 MyChessboard.prototype.display = function() {

   for(k = 0; k < this.matrix.length; k++){
     this.scene.pushMatrix();
      this.scene.translate(this.matrix[k].id, 0, 0);
      this.matrix[k].display();
      console.log(this.matrix[k].id);
     this.scene.popMatrix();
   }
};
