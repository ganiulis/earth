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

    vec3 dayColor = texture2D(dayTexture, vUV).xyz;
    vec3 nightColor = texture2D(nightTexture, vUV).xyz;

    // compute cosine sun to normal so -1 is away from sun and +1 is toward sun.
    float cosineAngleSunToNormal = dot(normalize(vNormal), sunDirection);

    // sharpen the edge beween the transition
    cosineAngleSunToNormal = clamp(cosineAngleSunToNormal * 10.0, -1.25, 1.0);

    // convert to 0 to 1 for mixing
    float mixAmountDaylight = cosineAngleSunToNormal * 0.5 + 0.5;

    // specular map
    vec3 specularAmount = texture2D(specularTexture, vUV).xyz;
    vec3 specularColor = vec3(1, 1, 1);



    float c = 0.035;    // Size, I guess...
    float p = 30.0;     // Blur
    float mixAmountSpecular = pow(c * dot(normalize(vNormal), specularDirection), p) * (specularAmount.z * 0.5);
    // adds specular mapping to the day texture
    vec3 color = mix(dayColor, specularAmount, 0.5);
    // Select day or night texture based on mixAmountDaylight.
    color = mix(nightColor, dayColor, mixAmountDaylight);

    gl_FragColor = vec4(color, 1.0);

    // comment in the next line to see the mixAmount
    // gl_FragColor = vec4( mixAmount, mixAmount, mixAmount, 1.0 );
}