#version 300 es
precision highp float;

uniform vec4 uColor;
out vec4 outColor;

void main() {
    //outColor = uColor;
    outColor = vec4(1.0,0.0,0.0,1.0);
}