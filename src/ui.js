var snakeGame, 
// to detect if the user is already playing the name or not, that way pressing the keys p or r on the home screen will not do anything
playingGame = false,
//to detect if the game is paused or not 
pause = false;
//the keycode of the p and r keys
var ui_input = {
	p: 80,
	r: 82
}

//this function starts when you click the "play" button on the home screen
function ui_playGame(){
	// to stop showing the home screen
	document.getElementById("game_ui").style.display = "none";
	// what happened before on the index.html file, to start the game
	snakeGame = new SnakeGame('#game', 501, 305);
	// the user is now playing the game
	playingGame = true;
}

// to detect if p or r are pressed
document.addEventListener('keyup', function(event) {
	//if the user is not playing the game this keys wont do anything
	if(playingGame){
		//and if the game is over the p key will not do anything too
		if(!snakeGame.gameOver){
			//detecting if the p key is being pressed
			if(event.keyCode === ui_input.p) {
				pause_game();
			}
		}
		//pressing r will work even if the game is over
		if(event.keyCode === ui_input.r){
			restart_game();
		}
	}
});

//what happens when you press p
function pause_game(){
	var ctx = snakeGame.context;
	//if you press p and the game is NOT paused
	if(!pause){
		pause = true;
		//to stop the raf
		snakeGame.stop();
		//to display the "pause" title you see when the game is paused
		ctx.font = "30px Helvetica";
		ctx.fillText("Paused", 195,150);
	//if you press p and the game IS paused
	}else{
		pause = false;
		//to restar the game
		snakeGame.run();
	}
}

//what happens when you press r
function restart_game(){
	//if the game is over
	if(snakeGame.gameOver){
		//well it stips being over :)
		snakeGame.gameOver = false;
		// and the raf starts again
		snakeGame.run();
	}
	//the lives and the body length are set as default
	snakeGame.snake.lives = 3;
	snakeGame.snake.body = [];
	//to restart the snake
	snakeGame.snake.init();
}