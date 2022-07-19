let count = 0;
function setup() {
    createCanvas(100, 100);
    count = 0;
}
function draw() {
    background(220);
    textSize(60);
    textAlign(CENTER);
    text(count, 50, 70);
}
/*
function keyPressed() {
    count++
}
*/

function keyPressed(){
    var post = $.ajax({
        type: "POST",
        url: "/increment",
        data: {count: count}, // post a json data.
        async: false,
        dataType: "json",
        success: function(response) {
            console.log(response);
            // Receive incremented number.
            count = response.count;
        }, 
        error: function(error) {
            console.log("Error occurred in keyPressed().");
            console.log(error);
        }
    })
}