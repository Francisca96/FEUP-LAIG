attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;

uniform float normScale;

uniform float du;
uniform float dv;

uniform float su;
uniform float sv;

vec2 calculateCoordinates(){
	vec2 coord;
	float x = floor(vTextureCoord.x * du);
	float y = floor(vTextureCoord.y * dv);
	coord=vec2(x, y);
	return coord;
}

void main() {
	vec3 offset=vec3(0.0,0.0,0.0);

	vTextureCoord = aTextureCoord;

	vec2 coordinates = calculateCoordinates();

	if((coordinates.x == su) && (coordinates.y == sv))
		offset.z+=0.05;
	// if (texture2D(uSampler2, vec2(0.0,0.1)+vTextureCoord).b > 0.5)
		// offset=aVertexNormal*normScale*0.1;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);
}
