#define PI 3.14159265

precision mediump float;
uniform float t; // time
uniform vec2  r; // resolution

vec3 orb(vec2 origin, vec2 position,float intensity, vec3 color){
	return color* intensity / length(origin-position);
}
// 極座標指定で円運動の直交座標を返す
vec2 polar_circle_coord(float r, float omega, float t, float phi){
	return vec2(cos(omega * t + phi), sin(omega * t + phi)) * r;
}

vec3 ring(vec2 origin, vec2 center, float r, float intensity, vec3 color){
	return color*intensity / abs(length(origin - center) - r);
}
//中央0の正規化座標
vec2 center_zero(void){
	return (gl_FragCoord.xy*2.0 - r)/ min(r.x, r.y);
}

void main(void){
	vec2 p = center_zero();
	
	vec3 color = vec3(0.0);
	color = ring(p, vec2(0.0), 0.4+1.6*abs(sin(0.5*t)), 0.005, vec3(0.4,0.3,1.0));
    for(float i = 0.0; i<10.0; i+=1.0){
    	color += orb(p, polar_circle_coord(0.5*cos(t), (i*2.0+0.1)*PI/5.0, t, (i)*PI/5.0),0.01, vec3(abs(sin(2.0*t)),abs(cos(t)),0.1+sin(t)+abs(cos(t))));
    }
    for(float i = 0.0; i<10.0; i+=1.0){
    	color += orb(p, polar_circle_coord(0.8*sin(t), -(i*2.0+0.1)*PI/5.0, t, (i)*PI/5.0),0.005, vec3(abs(sin(2.0*t)),abs(cos(t)),0.1+sin(t)+abs(cos(t))));
    }
	gl_FragColor = vec4(color, 1.0);
}
