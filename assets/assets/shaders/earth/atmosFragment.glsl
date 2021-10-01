varying vec3 vNormal;

void main() {
    float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 1.5);
    gl_FragColor = vec4(0.1, 0.3, 0.6, 1.0) * intensity;
}