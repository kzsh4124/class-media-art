// グラフィックカードにシェーダーのレンダリング方法を知らせる定義が必要
#ifdef GL_ES
precision mediump float;
#endif

// このサンプルでは、対象ピクセルがキャンバスのどこにあるかが知りたいので、キャンバスのサイズが必要になる
// これは、sketch.jsファイルからuniformとして送られてくる
uniform vec2 u_resolution;

void main() {
    // ピクセルの位置を解像度(キャンバスのサイズ)で割って、キャンバス上での正規化された位置を得る
        vec2 st = gl_FragCoord.xy/u_resolution.xy;

    // 赤のグラデーションとして、x軸のピクセル位置を使う。
    // 位置が0.0に近いほど、黒くなる(st.x = 0.0)
    // 位置が幅(1.0として定義)に近いほど、赤くなる(st.x = 1.0)
    //gl_FragColor = vec4(st.x,0.0,0.0,1.0); // R,G,B,A

    // １度にアクティブにできるgl_FragColorは１つだが、コメントアウトして試してみよう。
    // 緑チャンネル
    //gl_FragColor = vec4(0.0,st.x,0.0,1.0);

    // x位置とy位置両方
    gl_FragColor = vec4(st.x,st.y,0.0,1.0);
}