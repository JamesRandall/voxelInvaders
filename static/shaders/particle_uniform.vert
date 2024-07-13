#version 300 es
precision highp float;

in vec3 aPosition;
in vec2 aTexCoord;
// Instanced
in vec3 aStartingVelocity;
in vec4 aStartingColor;
in vec4 aEndingColor;
in float aLife;

uniform mat4 uProjectionViewMatrix;
uniform mat4 uTransformMatrix;
uniform float uTime;
uniform vec3 uParticleSetPosition;

out vec4 vColor;
out vec2 vTexCoord;

void main() {
    vColor = aColor;
    vTexCoord = aTexCoord;
    gl_Position =  uProjectionViewMatrix * uTransformMatrix * vec4(aPosition,1.0);
}