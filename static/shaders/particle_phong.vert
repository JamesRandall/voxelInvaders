#version 300 es
precision highp float;

in vec3 aPosition;
in vec2 aTexCoord;
in vec3 aNormal;
// Instanced
in vec3 aParticlePosition;
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
out vec3 vWorldPosition;
out vec3 vNormal;

void main() {
    vColor = aStartingColor + (aEndingColor - aStartingColor) * min((uTime/aLife),1.0);
    vTexCoord = aTexCoord;
    vec3 instanceVertexPosition = aPosition + aParticlePosition + (aStartingVelocity*uTime);
    vWorldPosition = (uTransformMatrix * vec4(instanceVertexPosition,1.0)).xyz;
    vNormal = aNormal;
    gl_Position =  uProjectionViewMatrix * uTransformMatrix * vec4(instanceVertexPosition,1.0);
}