#version 300 es
precision highp float;

in vec3 aPosition;
in vec3 aNormal;
in vec2 aTexCoord;
in vec4 aColor;
in float aVisible;
uniform mat4 uProjectionViewMatrix;
uniform mat4 uTransformMatrix;

out vec3 vWorldPosition;
out vec4 vColor;
out vec2 vTexCoord;
out vec3 vNormal;
out float vVisible;

void main() {
    vColor = aColor;
    vTexCoord = aTexCoord;
    vWorldPosition = (uTransformMatrix * vec4(aPosition,1.0)).xyz;
    vNormal = aNormal;
    vVisible = aVisible;
    gl_Position =  uProjectionViewMatrix * uTransformMatrix * vec4(aPosition,1.0);
}