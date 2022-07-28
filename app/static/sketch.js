let theShader;
let path_dir = "../static/";
let backbuffer;
let canvas;
let frog_flag;
let wave_flag;
function preload(){
    theShader = loadShader(path_dir+"shader.vert", path_dir+"shader.frag");
}
function setup() {
    pixelDensity(1);
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    backbuffer = createGraphics(width, height, WEBGL);
    backbuffer.clear();
    noStroke();
}
function draw() {
    backbuffer.clear();
    backbuffer.image(canvas, width*(-0.5), height*(-0.5), width, height);
    clear();
    shader(theShader);
    
    theShader.setUniform("backbuffer", backbuffer);
    theShader.setUniform("resolution", [width, height]);
    theShader.setUniform("time", millis() / 1000.0);
    theShader.setUniform("mouse", [mouseX/width,map(mouseY, 0, height, 1, 0)]);
    theShader.setUniform("pixel_density", [pixelDensity()]);
    console.log(backbuffer);
    rect(0, 0, width, height);
    
}
function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}
