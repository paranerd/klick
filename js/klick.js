var mode = ['Classic', 'Time Attack'],
	currMode = 0,
	score = 0,
	highscore = 0,
	gameSize = 10,
	colors = ['#FF3300', '#007FFF', '#009900'], //, '#FFE303']; // ['red', 'blue', 'green', 'yellow']
	elements = [],
	matchCount = 0,
	gameEnded = false,
	gameOverCount = 0,
	gameOverChecked = [],
	countdown,
	timeLeft,
	ballSize = 50;

window.onload = function() {	
	container.style.height = gameSize * ballSize + gameSize * 4 + "px";
	container.style.width = gameSize * ballSize + gameSize * 4 + "px";
	container.style.top = (window.innerHeight - parseInt(container.style.height)) / 2 + "px";
	container.style.left = (window.innerWidth - parseInt(container.style.width)) / 2 + "px";

	restartHover.style.height = gameSize * ballSize + gameSize * 4 + "px";
	restartHover.style.width = gameSize * ballSize + gameSize * 4 + "px";
	restartHover.style.lineHeight = gameSize * ballSize + gameSize * 4 + "px";
	restartHover.style.top = (window.innerHeight - parseInt(container.style.height)) / 2 + "px";
	restartHover.style.left = (window.innerWidth - parseInt(container.style.width)) / 2 + "px";

	gameOver.style.left = (window.innerWidth - parseInt(gameOver.style.width)) / 2 + "px";

	highscorediv.innerHTML = "0";
	init();
	checkGameOver();
}

function init() {
	restartHover.className = "hidden";
	gameEnded = false;
	container.innerHTML = "";
	gameOver.innerHTML = "";

	if(currMode == 1) {
		timeLeft = 10;
		gameOver.innerHTML = "<p style='color: white;'>Time left: " + timeLeft + "s";
		countdown = setInterval(function() {
			if(timeLeft == 0) {
				clearTimeout(countdown);
				showGameOver();
			}
			else {
				timeLeft--;
				gameOver.innerHTML = "<p style='color: white;'>Time left: " + timeLeft + "s";
			}
		}, 1000);
	}
	else {
		clearTimeout(countdown);
		gameOver.innerHTML = "";
	}

	score = 0;
	scorediv.innerHTML = score;

	for(var t = 0; t < gameSize; t++) {
		elements[t] = [];
		for(var l = 0; l < gameSize; l++) {
			var elem = document.createElement("div");
			elem.className = "elem";
			elem.style.height = 
			elem.value = t+"|"+l;
			elem.id = "elem"+t+""+l;
			var color = colors[Math.floor(Math.random() * colors.length)];
			elem.style.backgroundColor = color;
			elem.style.lineHeight = "50px";
			elem.style.textAlign = "center";
			container.appendChild(elem);

			var newArray = [color, false];
			elements[t].push(newArray);
	
			elem.onclick = function(e) {
				if(gameEnded) {
					return;
				}
				var sep = e.target.value.indexOf('|');
				var l = parseInt(e.target.value.substr(sep + 1));
				var t = parseInt(e.target.value.substr(0, sep));

				elements[t][l][1] = true;
				matchCount = 1;
				checkMatch(t, l);
				if(matchCount > 2) {
					var add = matchCount + (matchCount - 3) * 2;
					score += add;
					highscore = (score > highscore) ? score : highscore;
					highscorediv.innerHTML = highscore;
					scorediv.innerHTML = score;
					eliminate();
					moveDown();
					moveLeft();
					if(currMode == 1) {
						refill();
					}
					redraw();
				}
				checkGameOver();
			};
		}
	}
}

function checkMatch(t, l) {
	// UP
	if(elements[t-1] && elements[t-1][l][0] == elements[t][l][0] && !elements[t-1][l][1]) {
		elements[t-1][l][1] = true;
		matchCount++;
		checkMatch(t-1, l);
	}
	// DOWN
	if(elements[t+1] && elements[t+1][l][0] == elements[t][l][0] && !elements[t+1][l][1]) {
		elements[t+1][l][1] = true;
		matchCount++;
		checkMatch(t+1, l);
	}
	// LEFT
	if(elements[t][l-1] && elements[t][l-1][0] == elements[t][l][0] && !elements[t][l-1][1]) {
		elements[t][l-1][1] = true;
		matchCount++;
		checkMatch(t, l-1);
	}
	// RIGHT
	if(elements[t][l+1] && elements[t][l+1][0] == elements[t][l][0] && !elements[t][l+1][1]) {
		elements[t][l+1][1] = true;
		matchCount++;
		checkMatch(t, l+1);
	}
	return;
}

function eliminate() {
	for(var t = 0; t < elements.length; t++) {
		for(var l = 0; l < elements[t].length; l++) {
			if(elements[t][l][1]) {
				elements[t][l] = ['lightblue', true];
			}
		}
	}
}

function moveDown() {
	for(var t = elements.length - 1; t >= 0; t--) {
		for(var l = elements.length - 1; l >= 0; l--) {
			if(elements[t+1] && elements[t+1][l] && !elements[t][l][1] && elements[t+1][l][1]) {
				elements[t+1][l] = [elements[t][l][0], elements[t][l][1]];
				elements[t][l] = ['lightblue', true];
				t += 2;
			}
		}
	}
}

function moveLeft() {
	var size = elements.length - 1;

	for(var l = size; l >= 0; l--) {
		if(elements[size][l-1] && elements[size][l] && !elements[size][l][1] && elements[size][l-1][1]) {
			for(var t = size; t >= 0; t--) {
				elements[t][l-1] = [elements[t][l][0], elements[t][l][1]];
				elements[t][l] = ['lightblue', true];
			}
			l += 2;
		}
	}
}

function redraw() {
	for(var t = 0; t < gameSize; t++) {
		for(var l = 0; l < gameSize; l++) {
			var elem = document.getElementById("elem" + t + "" + l);
			elem.style.backgroundColor = elements[t][l][0];
			if(elements[t][l][1]) {
				elem.style.border = '1px solid rgba(0,0,0,0)';
			}
			else {
				elem.style.border = '1px solid rgba(0,0,0,0.3)';
			}
		}
	}
}

function checkGameOver() {
	gameOverChecked = [];
	for(var i = 0; i < elements.length; i++) {
		gameOverChecked[i] = [];
		for(var j = 0; j < elements[i].length; j++) {
			var newArray = [elements[i][j][0], elements[i][j][1]];
			gameOverChecked[i].push(newArray);
		}
	}
	
	var gameOver_state = false;
	for(var i = 0; i < elements.length; i++) {
		for(var j = 0; j < elements[i].length; j++) {
			gameOverCount = 0;
			if(!checkAllMatches(i, j)) {
				gameOver_state = true;
			}
		}
	}
	
	if(!gameOver_state) {
		showGameOver();
	}
}

function checkAllMatches(t, l) {
	if(gameOverCount > 2) {
		return false;
	}
	// UP
	if(gameOverChecked[t-1] && gameOverChecked[t-1][l][0] == gameOverChecked[t][l][0] && !gameOverChecked[t-1][l][1]) {
		gameOverChecked[t-1][l][1] = true;
		gameOverCount++;
		checkAllMatches(t-1, l);
	}
	// DOWN
	if(gameOverChecked[t+1] && gameOverChecked[t+1][l][0] == gameOverChecked[t][l][0] && !gameOverChecked[t+1][l][1]) {
		gameOverChecked[t+1][l][1] = true;
		gameOverCount++;
		checkAllMatches(t+1, l);
	}
	// LEFT
	if(gameOverChecked[t][l-1] && gameOverChecked[t][l-1][0] == gameOverChecked[t][l][0] && !gameOverChecked[t][l-1][1]) {
		gameOverChecked[t][l-1][1] = true;
		gameOverCount++;
		checkAllMatches(t, l-1);
	}
	// RIGHT
	if(gameOverChecked[t][l+1] && gameOverChecked[t][l+1][0] == gameOverChecked[t][l][0] && !gameOverChecked[t][l+1][1]) {
		gameOverChecked[t][l+1][1] = true;
		gameOverCount++;
		checkAllMatches(t, l+1);
	}
	if(gameOverCount > 2) {
		return false;
	}
	return true;
}

function refill() {
	for(var i = 0; i < elements.length; i++) {
		for(var j = 0; j < elements[i].length; j++) {
			if(elements[i][j][1]) {
				var color = colors[Math.floor(Math.random() * colors.length)];
				var elem = document.getElementById("elem" + i + "" + j);
				elements[i][j] = [color, false];
				elem.style.border = '1px solid rgba(0,0,0,0.5)';
			}
		}
	}
}

function changeMode() {
	currMode = (currMode == mode.length - 1) ? 0 : currMode + 1;
	modediv.innerHTML = mode[currMode];
	init();
}

function showGameOver() {
	gameEnded = true;
	if(score == highscore) {
		gameOver.innerHTML = "<p><strong>Congratulations!</strong></b></p><p>New Highscore: " + score + "</p>";
	}
	else {
		gameOver.innerHTML = "<p><strong>Game Over</strong></b></p><p>Score: " + score + "</p>";
	}
	restartHover.className = "";
}