#version 300 es
in vec3 aPosition;
in vec3 aNormal;
in vec4 aColor;
uniform mat4 uProjectionViewMatrix;

out vec4 vColor;
//out vec3 vNormal;

void main() {
    vColor = aColor;
    //vNormal = aNormal;
    gl_Position = uProjectionViewMatrix * vec4(aPosition,1.0);
}