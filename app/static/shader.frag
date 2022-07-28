#ifdef GL_ES
precision mediump float;
#endif



uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

vec2 tex(vec2 uv)
{
	return texture2D(backbuffer, uv).xy - 0.5;
}

void main( void ) {

	
	vec2 uv =  ( gl_FragCoord.xy / resolution.xy );
    vec2 uv_tex = gl_FragCoord.xy / resolution.xy;
    uv_tex.y = 1.-uv_tex.y;
	vec2 prev = tex(uv_tex);
	vec2 pixel = 1./resolution;
	vec2 pos = uv-mouse;

	// ラプラシアンフィルタで加速度を計算
	float accel =
		tex(uv_tex + pixel * vec2(1, 0)).x +
		tex(uv_tex - pixel * vec2(1, 0)).x +
		tex(uv_tex + pixel * vec2(0, 1)).x +
		tex(uv_tex - pixel * vec2(0, 1)).x -
		prev.x * 4.0;

	// 伝播速度を掛ける
	accel *= 0.4;

	// 現在の速度に加速度を足し、さらに減衰率を掛ける
	float velocity = (prev.y + accel) * 0.98;

	// 高さを更新
	float height = prev.x + velocity;

	// マウス位置に波紋を出す
	height += max(0.0, 0.001/length(pos));
	
	gl_FragColor = vec4(height + 0.5,  velocity+0.5, 0, 1);

}