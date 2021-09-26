varying vec2 vUV;
varying vec3 vNormal;

void main() {
    vUV = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normal);
    gl_Position = projectionMatrix * mvPosition;
}