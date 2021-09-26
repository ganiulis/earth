uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform sampler2D specularTexture;

uniform vec3 sunDirection;
uniform vec3 specularDirection;

varying vec3 vNormal;
varying vec2 vUV; // equals to vec2(0, 0.24) or smth like that

void main() {

    float intensity = 1.05 - dot(vNormal, vec3(0.0, 0.0, 1.0));
    vec3 atmosphere = vec3(0.1, 0.1, 0.1) * pow(intensity, 1.5);

    gl_FragColor = vec4(color, 1.0);

    // comment in the next line to see the mixAmount
    // gl_FragColor = vec4( mixAmount, mixAmount, mixAmount, 1.0 );
}