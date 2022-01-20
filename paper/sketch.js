function setup() {
	createCanvas(600, 600);
	noLoop();
}

function draw() {
	background(240);
	paper();
}

function paper() {
	// Stolen from https://openprocessing.org/sketch/510598
	push();
	strokeWeight(1);
	noStroke();
	for (var i = 0; i<width-1; i+=2) {
	  for (var j = 0; j<height-1; j+=2) {
	    fill(random(205-40, 205+30), 25);
	    rect(i, j, 2, 2);
	  }
	}

	for (var i = 0; i<30; i++) {
	  fill(random(130, 215), random(100, 170));
	  rect(random(0, width-2), random(0, height-2), random(1, 3), random(1, 3));
	}

	pop();
}
