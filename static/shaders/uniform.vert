#version 300 es
precision highp float;

in vec3 aPosition;
in vec2 aTexCoord;
in vec4 aColor;
uniform mat4 uProjectionViewMatrix;
uniform mat4 uTransformMatrix;

out vec4 vColor;
out vec2 vTexCoord;

void main() {
    vColor = aColor;
    vTexCoord = aTexCoord;
    gl_Position =  uProjectionViewMatrix * uTransformMatrix * vec4(aPosition,1.0);
}