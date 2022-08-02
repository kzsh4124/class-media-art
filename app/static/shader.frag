precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform int frog;
uniform float frog_time;
uniform vec4 wave_start;
uniform vec4 wave_inten;


float rand(float x){
    return fract(sin(x)*43758.5453123);
}
float noise(float x){
    float i = floor(x);
    float f = fract(x);
    float u = f*f*(3.0-2.0*f);
    return mix(rand(i), rand(i+1.0), u);
}
vec3 ring(vec2 origin, vec2 center, float r, float intensity, vec3 color){
	return color*intensity / abs(length(origin - center) - r);
}
vec2 ripple_uv(vec2 uv, float time, vec2 center){
    vec2 cPos = uv;
    float len = length(cPos - center);
    vec2 st = uv + cPos/len * cos(len*12. - time*4.) * 0.03 /max(1.0, time*2.);
    return st;
}
// colorは時間と距離に反比例して減衰する
vec3 wave(vec2 p, vec2 center, vec3 color, time){
	float dist = length(p - center);
    float constant;
    if(dist < 0.5*u_time){
        constant=0.; 
    }else{
        constant = 1.;
    }
	return color * sin(10.*PI*dist -time*10.)/(time*2.*dist)*constant;
}

void main(){
    uv = 2.*gl_FragCoord.xy/u_resolution.xy - 1.;
    //歪みの適用
    if (frog == 1){
        time = u_time - frog_time;
        uv = ripple_uv(uv, time, vec2(0,0));
    }
    color = vec3(0.);
    for(int i = 0; i<4; i++){
        if (wave_start[i] != 0.){
            center = vec2(noise(wave_start[i]), noise(wave_start[i]+1.));
            color += wave(uv, center, vec3(0.4,0.4,0.7));
        }
    }
    gl_FragColor = vec4(color, 1.);
}