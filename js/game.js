window.onload = function() {
	// Create the main surface
	var stage = new Kinetic.Stage({
		container: "surface",
		width: 512,
		height: 540
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
		y:60,
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
	
	// Arrow image
	var arrowReady = false;
	var arrowImageObj = new Image();
	arrowImageObj.onload = function () {
		arrowReady = true;
	};
	arrowImageObj.src = "images/arrow_right.png";
	var arrowImage = new Kinetic.Image({
		image:arrowImageObj,
		visible:false
	});
	
	// scoreText
	var scoreText = new Kinetic.Text({
		text: "Score: 0",
		x: 125,
		y: 32,
		align: "left",
		verticalAlign: "top",
		fontFamily: "Helvetica",
		fontSize: "20",
		textFill: "black"
	});
	
	// LivesText
	var livesText = new Kinetic.Text({
		text: "Lives: 3",
		x: 0,
		y: 32,
		align: "left",
		verticalAlign: "top",
		fontFamily: "Helvetica",
		fontSize: "20",
		textFill: "black"
	});
	
	// Game over
	var gameOverText = new Kinetic.Text({
		text: "GAME OVER",
		align: "left",
		verticalAlign: "top",
		fontFamily: "Helvetica",
		fontSize: "20",
		textFill: "black"
	});
	
	var then = 0;
	var now = 0;
	var delta = 0;
	
	// Game objects
	var hero = {
		// Movement in pixels per second
		speed: 128 
	};
	var monster = {};
	var monstersCaught = 0;
	
	var lives = 3;
	var gameOver = false;
	
	// Fire
	var arrow = {
		speed: 256
	};
	
	
	// Handle keyboard controls
	var keysDown = {};
	
	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
	}, false);
	
	addEventListener("keyup", function (e) {
		delete keysDown[e.keyCode];
	}, false);
	

	/*
	// Prevents that the screen scrolls when the user moves the finger
	var preventMove = function(e) {
		   e.preventDefault();
		   window.scroll(0, 0);
		   return false;
	};
	//window.document.addEventListener('touchmove', preventMove, false);
		
	var handleTouch = function (e) {
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
		hero.x = e.clientX;
		hero.y = e.clientY;
	}
	*/
	
	// Reset the game status
	var reset = function () {
		then = Date.now();
		hero.x = stage.getWidth() / 2;
		hero.y = stage.getHeight() / 2;
	
		// Throw the monster somewhere on the screen randomly
		monster.x = 32 + (Math.random() * (stage.getWidth() - 64));
		monster.y = 32 + (Math.random() * (stage.getHeight() - 64));
		arrowImage.hide();
	};
	
	var gameOverStatus = function() {
		gameOverText.setX(stage.getWidth() / 3);
		gameOverText.setY(stage.getHeight() / 2);
		gameOverText.show();
		gameOver = true;
	}
	
	// Update game objects
	var update = function (modifier) {
		if (!gameOver) {
			// Player holding up
			if (38 in keysDown) { 
				hero.y -= hero.speed * modifier;
			}
			// Player holding down
			if (40 in keysDown) { 
				hero.y += hero.speed * modifier;
			}
			// Player holding left
			if (37 in keysDown) { 
				hero.x -= hero.speed * modifier;
			}
			// Player holding right
			if (39 in keysDown) { 
				hero.x += hero.speed * modifier;
			}
			// Player holding right
			if (17 in keysDown) {
				if (!arrow.moving) {
					arrowImage.setX(hero.x + heroImage.getImage().width);
					arrowImage.setY(hero.y);
					arrow.moving = true;
					arrowImage.show();
				}
			}
		
			if (arrowImage.isVisible()) {
				arrowImage.setX(arrowImage.getX() + arrow.speed * modifier);
			}
			
			// Monster killed?
			if (arrowImage.getX() <= (monster.x + 32)
				&& monster.x <= (arrowImage.getX() + 32)
				&& hero.y <= (monster.y + 32)
				&& monster.y <= (arrowImage.getY() + 32)) {
				++monstersCaught;
				arrow.moving = false;
				reset();
			}
			
			if (arrowImage.getX() > stage.getWidth() + 32) {
				arrowImage.hide();
				arrow.moving = false;
			}

			// Are they touching?
			if (hero.x <= (monster.x + 32)
				&& monster.x <= (hero.x + 32)
				&& hero.y <= (monster.y + 32)
				&& monster.y <= (hero.y + 32)) {
				lives--;
				if (lives == 0) {
					gameOverStatus();
				}
				reset();
			}
		}
	};
	
	// Initialize game
	var init = function() {
		reset();
		
		lives = 3;
		monstersCaught = 0;

		layer.add(bgImage);
	
		heroImage.setX(hero.x)
		heroImage.setY(hero.y)
		layer.add(heroImage);
	
		monsterImage.setX(monster.x);
		monsterImage.setY(monster.y);
		layer.add(monsterImage);

		gameOverText.hide();
		layer.add(arrowImage);
		layer.add(scoreText);
		layer.add(livesText);
		layer.add(gameOverText);
		stage.add(layer);
	}
	
	// Main loop
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
	
		// scoreText
		scoreText.setText("Score: " + monstersCaught);
		livesText.setText("Lives: " + lives);
		layer.draw();
		then = now;
	});
	
	// Let's play this game!
	init();
	stage.start();
}
