precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform int frog;
uniform float frog_time;
uniform vec4 wave_start;
uniform vec4 wave_inten;
#define PI 3.14159265

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
    vec2 st = uv + cPos/len * cos(len*12. - time*4.) * 0.05 /max(1.0, time*2.);
    return st;
}
// colorは時間と距離に反比例して減衰する
vec3 wave(vec2 p, vec2 center, vec3 color, float time){
	float dist = length(p - center);
    float constant;
    if(dist < 0.5*time){
        constant=0.; 
    }else{
        constant = 1.;
    }
	return color * sin(10.*PI*dist -time*10.)/(time*2.*dist)*constant;
}

void main(){
    vec2 uv = 2.*gl_FragCoord.xy/min(u_resolution.x, u_resolution.y) - 1.;
    //歪みの適用
    vec3 color = vec3(0.);
    if (frog == 1){
        float time = u_time - frog_time;
        vec2 center = vec2(rand(frog_time), rand(frog_time+1.))*2. - 1.;
        uv = ripple_uv(uv, time, vec2(0,0));
        for(float i = 0.; i<3.; i++){
            color += ring(uv, center,1.5*time+0.1*(i+1.), 0.02/(1.+time*time*3.), vec3(1.,1.,1.));

        }
    }
    //波を生成
    for(int i = 0; i<4; i++){
        if (wave_start[i] != 0.){
            vec2 center = vec2(rand(wave_start[i])*2.8-0.7, rand(wave_start[i]+1.)*2.-1.);
            //center = vec2(0.);
            float time_delta = u_time - wave_start[i];
            //color += wave(uv, center, vec3(0.4,0.4,0.7), time_delta);
            color += ring(uv, center, 0.5*time_delta, 0.05/(1.+time_delta*time_delta*2.), vec3(min(1., 1.*wave_inten[i]), noise(rand(wave_start[i])+rand(wave_inten[i])), noise(2.+rand(wave_start[i])+rand(wave_inten[i]))));
        }
    }
    gl_FragColor = vec4(color, 1.);
}