uniform sampler2D cloudTexture;
uniform vec3 vNormal;
uniform vec2 vUV;

void main() {
    vec2 vUv = fragCoord.xy / iResolution.xy;
	
	// Flip that shit, cause shadertool be all "yolo opengl"
	vUv.y = -1.0 - vUv.y;
	
	// Modify that X coordinate by the sin of y to oscillate back and forth up in this.
	vUv.x += sin(vUv.y * 10.0 + uTime)/10.0;
    gl_FragColor = vec4(vNormal, 1.);
}