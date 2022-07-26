#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
// テクスチャの画像から指定座標のRG-0.5を返す
vec2 tex(vec2 uv)
{
    return texture2D(backbuffer, uv).xy - 0.5;
}

void main( void ) {

    vec2 pos = ( gl_FragCoord.xy - resolution.xy / 2.0) / resolution.y - mouse + 0.5;
    vec2 uv =  ( gl_FragCoord.xy / resolution.xy );
    vec2 prev = tex(uv);
    vec2 pixel = 1./resolution;

    // ラプラシアンフィルタで加速度を計算
    float accel =
        tex(uv + pixel * vec2(1.0, 0.0)).x +
        tex(uv - pixel * vec2(1.0, 0.0)).x +
        tex(uv + pixel * vec2(0.0, 1.0)).x +
        tex(uv - pixel * vec2(0.0, 1.0)).x -
        prev.x * 4.0;

    // 伝播速度を掛ける
    accel *= 0.2;

    // 現在の速度に加速度を足し、さらに減衰率を掛ける
    float velocity = (prev.y + accel) * 0.95;

    // 高さを更新
    float height = prev.x + velocity;

    // マウス位置に波紋を出す
    height += max(0.0, 1.0 - length(pos) * 30.0);

    gl_FragColor = vec4(height + 0.5, velocity + 0.5, 0, 1);

}