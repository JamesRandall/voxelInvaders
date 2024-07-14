#version 300 es
precision highp float;

in vec3 aPosition;
in vec2 aTexCoord;
in vec4 aColor;
in float aVisible;
uniform mat4 uProjectionViewMatrix;
uniform mat4 uTransformMatrix;

out vec4 vColor;
out vec2 vTexCoord;
out float vVisible;

void main() {
    vColor = aColor;
    vTexCoord = aTexCoord;
    vVisible = aVisible;
    gl_Position =  uProjectionViewMatrix * uTransformMatrix * vec4(aPosition,1.0);
}