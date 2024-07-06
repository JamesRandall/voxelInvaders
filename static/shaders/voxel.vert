#version 300 es
in vec3 aPosition;
in vec4 aColor;
in vec3 aNormal;
uniform mat4 uProjectionViewMatrix;

out vec4 vColor;

void main() {
    vColor = aColor;
    gl_Position = uProjectionViewMatrix * vec4(aPosition,1.0);
}