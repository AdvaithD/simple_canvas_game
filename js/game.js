// Create the main surface
var stage = new Kinetic.Stage({
	container: "surface",
	width: 512,
	height: 480
});

var layer = new Kinetic.Layer();

// Background image
var bgReady = false;
var bgImageObj = new Image();
bgImageObj.onload = function () {
	bgReady = true;
};
bgImageObj.src = "images/background.png";
var bgImage = new Kinetic.Image({
	x:0,
	y:0,
	image:bgImageObj
});

// Hero image
var heroReady = false;
var heroImageObj = new Image();
heroImageObj.onload = function () {
	heroReady = true;
};
heroImageObj.src = "images/hero.png";
var heroImage = new Kinetic.Image({
	image:heroImageObj
});

// Monster image
var monsterReady = false;
var monsterImageObj = new Image();
monsterImageObj.onload = function () {
	monsterReady = true;
};
monsterImageObj.src = "images/monster.png";
var monsterImage = new Kinetic.Image({
	image:monsterImageObj
});

// score
var score = new Kinetic.Text({
	text: "Goblins caught: 0",
	x: 32,
	y: 32,
	align: "left",
	verticalAlign: "top",
	fontFamily: "Helvetica",
	fontSize: "24",
	textFill: "white"
});

var then = 0;
var now = 0;
var delta = 0;

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {};
var monstersCaught = 0;


// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);


// Prevents that the screen scrolls when the user moves the finger
var preventMove = function(e) {
	   e.preventDefault();
	   window.scroll(0, 0);
	   return false;
};
//window.document.addEventListener('touchmove', preventMove, false);
	
var handleTouch = function (e) {
	alert("Hola dedo");
	var touches = e.touches;
	for (i = 0; i < touches.length; i++) {
		var touch = e.touches[i];
		var x = touch.clientX;
		var y = touch.clientY;
		
		hero.x = x;
		hero.y = y;
	}
}

var handleMouse = function (e) {
	alert("Hola mouse");
	hero.x = e.clientX;
	hero.y = e.clientY;
}

// Reset the game when the player catches a monster
var reset = function () {
	then = Date.now();
	hero.x = stage.getWidth() / 2;
	hero.y = stage.getHeight() / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (stage.getWidth() - 64));
	monster.y = 32 + (Math.random() * (stage.getHeight() - 64));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	// Are they touching?
	if (hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)) {
		++monstersCaught;
		reset();
	}
};

var init = function() {
	layer.add(bgImage);

	heroImage.setX(hero.x)
	heroImage.setY(hero.y)
	layer.add(heroImage);

	monsterImage.setX(monster.x);
	monsterImage.setY(monster.y);
	layer.add(monsterImage);

	layer.add(score);
	stage.add(layer);
}

stage.onFrame(function(frame){
	now = Date.now();
	delta = now - then;
	update(delta/1000);
	
	if (heroReady) {
		heroImage.setX(hero.x)
		heroImage.setY(hero.y)
	}

	if (monsterReady) {
		monsterImage.setX(monster.x);
		monsterImage.setY(monster.y);
	}

	// Score
	score.setText("Goblins caught: " + monstersCaught);
	layer.draw();
	then = now;
});

// Let's play this game!
reset();
init();
stage.start();