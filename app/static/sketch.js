let theShader;
let path_dir = "../static/";
function preload(){
    theShader = loadShader(path_dir+"shader.vert", path_dir+"shader.frag");
}
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    noStroke();
}
function draw() {
    shader(theShader);
    theShader.setUniform("u_resolution", [width, height]);
    theShader.setUniform("u_time", millis() / 1000.0);
    theShader.setUniform("u_mouse", [mouseX, map(mouseY, 0, height, height, 0)]);
    rect(0, 0, width, height);
    
}
function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}
