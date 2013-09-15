window.requestAnimFrame = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function (callback) {
			window.setTimeout(callback, 1000 / 60);
		};
}());

var SnakeGame = function (elID) {
	'use strict';
	var win = window,
		doc = window.document,
		canvas = doc.getElementById(elID),
		ctx = canvas.getContext('2d'),
		snake = {
			color: 'pink',
			width: 10,
			length: 5,
			moveDir: 0,
			speed: 10,
			body: [],
			draw: function (c) {
				var body = this.body,
					width = this.width,
					i;
				c.save();
				c.fillStyle = this.color;
				for (i = 0; i < body.length; i++) {
					c.fillRect(
						body[i][0],
						body[i][1],
						body[i][0] + width,
						body[i][1] + width
					);
				}
				c.restore();
			},
			move: function () {
				var head = snake.body[snake.body.length - 1],
					dir = snake.moveDir;
				snake.body.push(
					[head[0] + Math.cos(dir), head[1] + Math.sin(dir)]
				);
				snake.body.shift();
			},
			eat: function () {

			},
			turn: function () {

			}
		};
	function init() {
		var width = snake.width,
			length = snake.length,
			i;
		for (i = 0; i < length; i++) {
			snake.body.push(
				[i * width, 0]
			);
		}
	}
	function start() {
		snake.draw(ctx);
	}
	return {
		grid: {
			width: canvas.width,
			height: canvas.height
		},
		snake: snake,
		initialize: init,
		start: start
	};
};