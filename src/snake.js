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
    this.offCanvas = document.createElement('canvas');
    this.cWidth = 320;
    this.cHeight = 320;
    this.canvas.width = this.offCanvas.width = this.cWidth;
    this.canvas.height = this.offCanvas.height = this.cHeight;
    this.context = this.canvas.getContext('2d');
    this.offContext = this.offCanvas.getContext('2d');
    this.container = document.querySelector(elID);
    this.raf = null;

    this.init();
};
SnakeGame.prototype = {
    init: function () {
        var Snake = function () {
            var i;
            this.segment = {
                width: 10,
                height: 10,
                imgData: null
            };
            this.skinColor = 'green';
            this.skinColor2 = 'cyan';
            this.speed = 1;
            this.dirX = 1;
            this.dirY = 0;
            this.lng = 5;
            this.body = [];
            for (i = 0; i < this.lng; i++) {
                this.body.push([i, 0]);
            }

            return this;
        };
        Snake.prototype = {
            draw: function (ctx) {
                var self = this,
                    i = 0;
                for (i; i < self.body.length; i++) {
                    ctx.putImageData(self.segment.imgData, self.body[i][0] * self.segment.width, self.body[i][1] * self.segment.height);
                }
            },
            prepareImgs: function (ctx) {
                ctx.save();
                ctx.fillStyle = this.skinColor2;
                ctx.fillRect(0, 0, this.segment.width, this.segment.height);
                ctx.fillStyle = this.skinColor;
                ctx.fillRect(1, 1, this.segment.width - 2, this.segment.height - 2);
                ctx.restore();
                this.segment.imgData = ctx.getImageData(0,0,this.segment.width,this.segment.height);
            }
        };

        this.snake = new Snake();
        this.snake.prepareImgs(this.offContext);
        this.container.appendChild(this.canvas);
    },
    run: function () {
        window.cancelAnimationFrame(this.raf);
        var self = this,
            lastTime = 0,
            callback = function (t) {
                if (t - lastTime > 2000) {
                    self.animLoop();
                    lastTime = t;
                }
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
    update: function () {
        var snakeLength = this.snake.body.length;
        for (var i = 0; i < snakeLength - 1; i++) {
            this.snake.body[i][0] = this.snake.body[i + 1][0];
            this.snake.body[i][1] = this.snake.body[i + 1][1];
        }
        this.snake.body[snakeLength - 1][0] += this.snake.dirX;
        this.snake.body[snakeLength - 1][1] += this.snake.dirY;
    },
    animLoop: function () {
        this.clear();
        this.draw();
        this.update();
    }
};