#ifdef GL_ES
precision mediump float;
#endif



uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(){
    vec2 st = gl_FragCoord.xy/resolution.y;
    vec3 color = vec3(0.0,0.0,1.0);
    vec2 pos = vec2(1.+0.2/0.42-1.,0.5+0.5-0.5)-st;
    float r = length(pos)*20.0;
    float a = atan(pos.y,pos.x);
    float f = smoothstep(-0.5,1., cos(a*20.+time*13.))*0.42+0.05;
    color *= vec3( 1.-smoothstep(f,f/0.82,r) );

    gl_FragColor = vec4(color, 0.0);
}