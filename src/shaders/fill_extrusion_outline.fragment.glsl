precision mediump float;
uniform vec3 u_outline_color;
uniform float u_outline_opacity;

void main() {
    gl_FragColor = vec4(u_outline_color, u_outline_opacity);
}
