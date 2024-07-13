#version 300 es
precision highp float;

in vec3 vWorldPosition;
in vec4 vColor;
in vec2 vTexCoord;
in vec3 vNormal;
uniform vec3 uLightDirection;
uniform vec3 uLightAmbient;
uniform vec3 uLightDiffuse;
uniform vec3 uLightSpecular;
uniform vec3 uCameraPosition;
uniform float uShowOutline;
uniform float uShininess;
out vec4 outColor;

vec3 phongLighting(vec3 worldPosition, vec3 diffuseColor, vec3 normal, vec3 viewPosition) {
    // Ambient
    vec3 ambient = uLightAmbient * diffuseColor;

    // Diffuse
    float diff = max(dot(normal, -uLightDirection), 0.0);
    vec3 diffuse = uLightDiffuse * diff * diffuseColor;

    // Specular
    vec3 viewDir = normalize(viewPosition - worldPosition);
    vec3 reflectDir = reflect(uLightDirection, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
    vec3 specular = uLightSpecular * spec;

    return ambient+ diffuse + specular;
}

void main() {
    const float tolerance = 0.1;
    vec3 color = vColor.rgb;
    if (uShowOutline > 0.0) {
        //if (vTexCoord.x < tolerance || vTexCoord.x > (1.0-tolerance) || vTexCoord.y < tolerance || vTexCoord.y > (1.0-tolerance)) {
        if (vTexCoord.x < tolerance || vTexCoord.y < tolerance) {
            color = color * 0.3;
        }
    }
    vec3 lightAdjustedColor = phongLighting(vWorldPosition, color, vNormal, uCameraPosition);
    outColor = vec4(lightAdjustedColor,1.0);
}

