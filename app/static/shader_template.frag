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
vec2 center_zero(vec2 r){
	return (gl_FragCoord.xy*2.0 - r)/ min(r.x, r.y);
}
// wave
vec3 wave(vec2 p, vec2 center, vec3 color){
	float dist = length(p - center);
	return color * sin(dist);
}

//distance_source: , distort_source: , distance_center: 

vec2 GetRippleDistortedUv(float distance_source_u, float distance_source_v, float distort_source_u, float distort_source_v, float distance_center_x,float distance_center_y){
    float distance_square = (distance_source_u - distance_center_x) * (distance_source_u - distance_center_x)
        + (distance_source_v - distance_center_y) * (distance_source_v - distance_center_y);
    float distance = sqrt(distance_square);
    float sine_disappear_distance = u_ripple_sine_disappear_distance;
    float normalized_distance = clamp(distance, 0.0, sine_disappear_distance) / sine_disappear_distance;
    float sine_strength = u_ripple_strength * (1.0 - normalized_distance) * (1.0 - normalized_distance);
    float theta = sin(u_ripple_offset + distance * u_ripple_frequency) * sine_strength
    float u0 = distort_source_u - 0.5;
    float v0 = distort_source_v - 0.5;
    float u1 = u0 * cos(theta) - v0 * sin(theta);
    float v1 = u0 * sin(theta) + v0 * cos(theta);
    float u2 = u1 + 0.5;
    float v2 = v1 + 0.5;
    return vec2(u2, v2);
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
