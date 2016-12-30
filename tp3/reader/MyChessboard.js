/**
 * MyChessboard
 * @constructor
 */
 function MyChessboard(scene, du, dv, texture, su, sv, c1, c2, cs) {
 	CGFobject.call(this,scene);

  var partsPerDivision = 4;

  this.chess = new MyPlane(this.scene, 1, 1, du*partsPerDivision, du*partsPerDivision);
  this.shader = new CGFshader(this.scene.gl, "shaders/my_shader.vert", "shaders/my_shader.frag");

  this.shader.setUniformsValues({du: du});
  this.shader.setUniformsValues({dv: dv});
  this.shader.setUniformsValues({su: su});
  this.shader.setUniformsValues({sv: sv});

  this.shader.setUniformsValues({c1: vec4.fromValues(c1[0], c1[1], c1[2], c1[3])});
  this.shader.setUniformsValues({c2: vec4.fromValues(c2[0], c2[1], c2[2], c2[3])});
  this.shader.setUniformsValues({cs: vec4.fromValues(cs[0], cs[1], cs[2], cs[3])});

  this.texture = texture;

 	this.initBuffers();
 }

 MyChessboard.prototype = Object.create(CGFobject.prototype);
 MyChessboard.prototype.constructor = MyChessboard;

 MyChessboard.prototype.display = function() {
    this.scene.pushMatrix();
      this.scene.rotate(-Math.PI/2, 1, 0, 0);
      this.scene.setActiveShader(this.shader);
      this.texture.bind(0);
      this.chess.display();
      this.texture.unbind(0);
      this.scene.setActiveShader(this.scene.defaultShader);
    this.scene.popMatrix();
};
