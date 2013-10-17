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
    this.canvas = document.createElement('canvas');
    this.cWidth = 320;
    this.cHeight = 320;
    this.canvas.width = this.cWidth;
    this.canvas.height = this.cHeight;
    this.context = this.canvas.getContext('2d');
    this.container = document.querySelector(elID);
    this.raf = null;

    this.init();

    return this;
};
SnakeGame.prototype = {
    init: function () {
        var Snake = function () {
            var i;
            this.segment = {
                width: 10,
                height: 10
            };
            this.skinColor = 'green';
            this.skinColor2 = 'cyan';
            this.speed = 1;
            this.dirX = 1;
            this.dirY = 0;
            this.lng = 5;
            this.body = [];
            for (i = this.lng - 1; i >= 0; i--) {
                this.body.push([i, 0]);
            }

            return this;
        };
        Snake.prototype = {
            draw: function (ctx) {
                var self = this,
                    i = 0;
                for (i; i < self.body.length; i++) {
                    ctx.fillRect(self.body[i][0]*self.segment.width + 1, self.body[i][1]*self.segment.height + 1, self.segment.width - 1, self.segment.height - 1);
                    ctx.strokeRect(self.body[i][0]*self.segment.width, self.body[i][1]*self.segment.height, self.segment.width, self.segment.height);
                }
            }
        };

        this.snake = new Snake();
        this.container.appendChild(this.canvas);
        this.context.fillStyle = this.snake.skinColor;
        this.context.strokeStyle = this.snake.skinColor2;
        this.context.strokeWidth = 3;


    },
    run: function () {
        window.cancelAnimationFrame(this.raf);
        var self = this,
            lastTime = new Date(),
            callback = function(t){
                self.animLoop(t-lastTime);
                lastTime = t;
                self.raf = window.requestAnimationFrame(callback);
            };
        this.raf = window.requestAnimationFrame(callback);
    },
    stop: function () {
        window.cancelAnimationFrame(this.raf);
    },
    clear: function () {
        this.context.clearRect(0,0,this.cWidth,this.cHeight);
    },
    draw: function () {
         this.snake.draw(this.context);
    },
    update: function (dT) {
        for (var i = 0; i < this.snake.body.length - 1; i++) {
            this.snake.body[i][0] = this.snake.body[i + 1][0];
            this.snake.body[i][1] = this.snake.body[i + 1][1];
        }
        this.snake.body[this.snake.body.length - 1][0] += this.snake.dirX;
        this.snake.body[this.snake.body.length - 1][1] += this.snake.dirY;
    },
    animLoop: function (dT) {
        this.clear();
        this.draw();
        this.update();
    }
};