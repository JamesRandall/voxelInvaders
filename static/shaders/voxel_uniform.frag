#version 300 es
precision highp float;

in vec4 vColor;
in vec2 vTexCoord;
in float vVisible;
uniform float uShowOutline;
out vec4 outColor;

void main() {
    if (vVisible < 0.5) {
        discard;
    } else {
        const float tolerance = 0.1;
        vec3 color = vColor.rgb;
        if (uShowOutline > 0.0) {
            //if (vTexCoord.x < tolerance || vTexCoord.x > (1.0-tolerance) || vTexCoord.y < tolerance || vTexCoord.y > (1.0-tolerance)) {
            if (vTexCoord.x < tolerance || vTexCoord.y < tolerance) {
                color = color * 0.3;
            }
        }
        outColor = vec4(color, vColor.a);
    }
}

