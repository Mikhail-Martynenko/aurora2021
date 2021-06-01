#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float tt = time * 2.0;
vec2 random2f(vec2 p) {
    return vec2(.5*sin(tt + p.y),0);
}

float voronoi( vec2 x )
{
    float res = 1.0;
    for( float j=-0.0; j<=1.0; j++ ) {
        for( float i=-0.0; i<=1.0; i++ ) {
            {
                res = min(res, length((vec2(i, j)) - fract(x) + random2f((vec2(i, j)) + vec2(floor(x)))));
            }
        }
    }
    return res;
}

void main( void ) {

    vec2 p = gl_FragCoord.xy / resolution.xy;
    p.x *= resolution.x / resolution.y;
    vec2 q = 2.0 * p;

    float col = voronoi(q * 6.0);
    gl_FragColor = vec4(0.,col-0.5,col-0.1, 0.0);
}