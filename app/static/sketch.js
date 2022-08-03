let theShader;
let path_dir = "../static/";
let backbuffer;
let canvas;
let frog_param = 0;
let frog =0;
let frog_time = 0.0;
let anti_frog = 0;
let wave_param = 0.0;
let mic;
let threshold;
let wave_coord=[0,0];
let wave_start=[0.0,0.0,0.0,0.0];
let wave_inten=[0.0,0.0,0.0,0.0];
let rand = 60;
function preload(){
    theShader = loadShader(path_dir+"shader.vert", path_dir+"shader.frag");
}
function setup() {
    // mimics the autoplay policy
    getAudioContext().suspend();

    pixelDensity(1);
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    backbuffer = createGraphics(width, height, WEBGL);
    backbuffer.clear();
    noStroke();
    mic = new p5.AudioIn();
    mic.start();
    threshold = 0.1;

}
function draw() {
    let now = millis()/1000;
    shader(theShader);
    //音量を取得
    let vol = mic.getLevel();
    wave_param += vol;
    if(vol > threshold){
        anti_frog += 1;
        frog_param -= 2;
    }else{
        frog_param += 1;
    }
    if (anti_frog > 60){
        frog_param = 0;
        anti_frog = 0;
    }
    //定例的な波を生成
    if ((frameCount+1) % rand == 0){
        rand = randint(60, 180);
        console.log("rand = ", rand);
        for(let i=0;i<4;i++){
            //その1秒の音量を送り、波の情報をおくる
            if(wave_start[i] == 0.0){
                wave_start[i] = now;
                wave_inten[i] = wave_param;
                wave_param = 0.0;
              break;
            }
        }
            //描画から3秒以上経過した波は消す
        for(let i=0; i<4; i++){
            if(now - wave_start[i] >= 3.0){
                wave_start[i] = 0.0;
                wave_inten[i] = 0.0;
            }
        }
      console.log("wave!", wave_start, wave_inten);
    }
    //カエル飛び込みのスタート
    if(frog_param > 600 && frog_time == 0.0){
        frog = 1;
        frog_time = now;
        frog_param = 0;
      console.log("frog!", frog_time, frog);
    }
    if(now-frog_time >= 4.0) {
        frog = 0;
        frog_time = 0.0;
    }
    theShader.setUniform("frog", frog);
    theShader.setUniform("frog_time", frog_time);
    theShader.setUniform("wave_start", wave_start);
    theShader.setUniform("wave_inten", wave_inten);
    theShader.setUniform("u_resolution", [width, height]);
    theShader.setUniform("u_time", millis() / 1000.0);
    theShader.setUniform("mouse", [mouseX/width,map(mouseY, 0, height, 1, 0)]);
    theShader.setUniform("pixel_density", [pixelDensity()]);
    rect(0, 0, width, height);
    console.log("vol:float ",vol,"frog_param:int ", frog_param, "wave_param:float",wave_param, "frog:0|1",frog,"frame:int", frameCount);
}
function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}
function mousePressed() {
    userStartAudio();
}
function randint(a,b){
    return Math.floor(Math.random()*(b-a+1))+a;
}