var ratingText = document.getElementById("rating");
var pointsText = document.getElementById("points");
var bar = document.getElementById("bar");
var video = document.getElementById("video");
var button = document.getElementById("play-button");

video.height = window.innerHeight - 60;
video.width = video.height * 1280 / 720;

var mostRecentAccelData = {
	x: 0, y: 0, z: 0
};

var i = 0;
var sumOfPastSec = 0;
var points = 0;

function zScore(x, mean, stdev) {
	return Math.abs((x - mean) / stdev);
}

function rateAndPoints(zScoreAvg) {
	if (zScoreAvg < 3.5) {
		ratingText.innerHTML = "PERFECT";
		ratingText.style.textShadow = "0 0 20px #00ff00";
		points += 85;
	} else if (zScoreAvg < 4) {
		ratingText.innerHTML = "SUPER";
		ratingText.style.textShadow = "0 0 20px #19eaaf";
		points += 70;
	} else if (zScoreAvg < 4.5) {
		ratingText.innerHTML = "GOOD";
		ratingText.style.textShadow = "0 0 20px #1eecff";
		points += 55;
	} else if (zScoreAvg < 5) {
		ratingText.innerHTML = "OK";
		ratingText.style.textShadow = "0 0 20px #c918c3";
		points += 40;
	} else {
		ratingText.innerHTML = "X";
		ratingText.style.textShadow = "0 0 20px #ff0000";
	}
	pointsText.innerHTML = points;
	bar.style.height = ((points / 13333) * 600 + 5) + "px";
}

function score() {
	if (video.ended) {
		isPlaying = false;
		return;
	}

	if (i > instructionData.length) {
		return;
	}
	gradingData = instructionData[i];
	
	var x = zScore(mostRecentAccelData.x, instructionData[i][0], instructionData[i][1]);
	var y = zScore(mostRecentAccelData.x, instructionData[i][2], instructionData[i][3]);
	var z = zScore(mostRecentAccelData.x, instructionData[i][4], instructionData[i][5]);
	
	var avg = (x + y + z) / 3;
	sumOfPastSec += avg;
	
	if (i % 5 == 0) {
		rateAndPoints(sumOfPastSec / 5);
		sumOfPastSec = 0;
	}
	
	i++;
}

function setToRed() {
	document.body.style.backgroundColor = "rgb(194, 43, 7)";
}

function setToBlue() {
	document.body.style.backgroundColor = "rgb(1, 0, 123)";
}

function startGame() {
	button.style.display = "none";
	video.play();
	setInterval(score, 200);
	setTimeout(setToRed, 104035);
	setTimeout(setToBlue, 128000);
	isPlaying = true;
}

Myo.connect('me.theycallmezeal.dance');

button.onclick = function () {
	startGame();
}

Myo.on('accelerometer', function(data){
	mostRecentAccelData.x = data.x;
	mostRecentAccelData.y = data.y;
	mostRecentAccelData.z = data.z;
});