#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;

uniform float du;
uniform float dv;

uniform float su;
uniform float sv;

uniform vec4 c1;
uniform vec4 c2;
uniform vec4 cs;

vec2 calculateCoordinates(){
	vec2 coord;
	float x = floor(vTextureCoord.x * du);
	float y = floor(vTextureCoord.y * dv);
	coord=vec2(x, y);
	return coord;
}

void main() {
	vec2 coordinates = calculateCoordinates();
	vec4 color;
	// vec4 filter = texture2D(uSampler2, vec2(0.0,0.1)+vTextureCoord);

	if(mod(coordinates.x + coordinates.y, 2.0) == 0.0)
		color = c1;
	else
		color = c2;


	gl_FragColor = texture2D(uSampler, vTextureCoord);
	gl_FragColor.rgb = 0.5*(gl_FragColor.rgb + color.rgb);
	gl_FragColor.a = color.a;
}
