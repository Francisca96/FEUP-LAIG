/**
 * MyLedFont
 * @constructor
 */
 function MyLedFont(scene) {
  this.scene = scene;
	this.shader = new CGFshader(scene.gl, "shaders/font.vert", "shaders/font.frag");
  this.shader.setUniformsValues({'dims': [16, 16]});
	this.appearance = new CGFappearance(scene);
	this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
	this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
	this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
	this.appearance.setShininess(120);
	this.texture = new CGFtexture(scene, "resources/images/font.png");
	this.appearance.setTexture(this.texture);

	this.backgroundAppearance =  new CGFappearance(scene);
	this.backgroundAppearance.setAmbient(0, 0, 0, 1);
	this.backgroundAppearance.setDiffuse(0.7, 0.7, 0.7, 1);
	this.backgroundAppearance.setSpecular(0.0, 0.0, 0.0, 1);
	this.backgroundAppearance.setShininess(120);
 }

MyLedFont.prototype.constructor = MyLedFont;

MyLedFont.prototype.getCoords = function(char){
  var code = char.charCodeAt(0);
  if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {	//letters
    switch(char) {
    case "A":
		case "a":
			return [0, 0];
    case "B":
		case "b":
			return [0, 1];
    case "C":
    case "c":
			return [0, 2];
    case "D":
		case "d":
			return [0, 3];
    case "E":
		case "e":
			return [0, 4];
    case "F":
		case "f":
			return [0, 5];
    case "G":
		case "g":
			return [0, 6];
    case "H":
		case "h":
			return [0, 7];
    case "I":
		case "i":
			return [0, 8];
    case "J":
		case "j":
			return [0, 9];
    case "K":
		case "k":
			return [1, 0];
    case "L":
		case "l":
			return [1, 1];
    case "M":
		case "m":
			return [1, 2];
    case "N":
		case "n":
			return [1, 3];
    case "O":
		case "o":
			return [1, 4];
    case "P":
		case "p":
			return [1, 5];
    case "Q":
		case "q":
			return [1, 6];
    case "R":
		case "r":
			return [1, 7];
    case "S":
		case "s":
			return [1, 8];
    case "T":
		case "t":
			return [1, 9];
    case "U":
		case "U":
			return [2, 0];
    case "V":
    case "v":
			return [2, 1];
    case "W":
		case "w":
			return [2, 2];
    case "X":
		case "x":
			return [2, 3];
    case "Y":
		case "y":
			return [2, 4];
    case "Z":
		case "z":
			return [2, 5];
	} else if (code >= 48 && code <= 57){
		switch(char) {
		case "0":
			return [5, 0];
		case "1":
			return [5, 1];
		case "2":
			return [5, 2];
		case "3":
			return [5, 3];
		case "4":
			return [5, 4];
		case "5":
			return [5, 5];
		case "6":
			return [5, 6];
		case "7":
			return [5, 7];
		case "8":
			return [5, 8];
		case "9":
			return [5, 9];
		}
	} else {
		switch(char) {
    case ".":
  		return [3, 0];
  	case "?":
			return [3, 1];
    case "!":
  		return [3, 2];
    case "(":
			return [3, 3];
		case ")":
			return [3, 4];
		case ":":
			return [3, 5];
    case " ":
      return [3, 6];
    case "+":
    	return [4, 0];
    case "-":
  		return [4, 1];
    case "=":
    	return [4, 2];
    case "%":
  		return [4, 3];
  	case "$":
  		return [4, 4];
  	case "€":
  		return [4, 5];
    case "º":
    	return [4, 6];
		default:
			return [3, 6];
		}
	}
}
};

MyLedFont.prototype.getBackgroundAppearance = function() {
	return this.backgroundAppearance;
}

MyLedFont.prototype.getAppearance = function() {
	return this.appearance;
}

MyLedFont.prototype.getShader = function() {
	return this.shader;
}
