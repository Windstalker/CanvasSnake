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
    this.food = [];
    this.gameOver = false;

	this.init();
};
SnakeGame.prototype = {
	init: function () {
		var game = this,
            Snake = function (length) {
                var i;
                this.segment = {
                    width: 10,
                    height: 10,
                    img: null
                };
                this.skinColor = 'green';
                this.skinColor2 = 'cyan';
                this.speed = 1;
                this.dirX = 1;
                this.dirY = 0;
                this.lng = length;
                this.body = [];
                for (i = 0; i < this.lng; i++) {
                    this.body.push([i, 0]);
                }

                return this;
            },
            Food = function (x, y) {
                this.x = x;
                this.y = y;
            };

        Snake.prototype = {
			draw: function (ctx) {
				var self = this,
					i = 0;
				for (i; i < self.body.length; i++) {
					ctx.putImageData(self.segment.img, self.body[i][0] * self.segment.width, self.body[i][1] * self.segment.height);
				}
			},
            control: function (key) {
                var dirX, dirY,
                    self = this;
                switch (key) {
                    case 87: //up
                        dirX = 0;
                        dirY = -1;
                        break;
                    case 83: //down
                        dirX = 0;
                        dirY = 1;
                        break;
                    case 65: //left
                        dirX = -1;
                        dirY = 0;
                        break;
                    case 68: //right
                        dirX = 1;
                        dirY = 0;
                        break;
                    default:
                        break;
                }
                if (!(self.dirY + dirY) || !(self.dirX + dirX)) {
                    return ;
                }
                self.dirY = dirY; self.dirX = dirX;
            }
		};

		this.snake = new Snake(10);
		this.prepareImgs(this.offContext);
		this.container.appendChild(this.canvas);

        this.keyHandler = {
            handleEvent: function (e) {
                this.addKey(e);
            },
            dispatchKey: function () {
                if (this.queue.length) {
                    game.snake.control(this.queue.pop());
                }
            },
            addKey: function (e) {
                if (this.queue.length < this.maxQueue) {
                    this.queue.unshift(e.which);
                }
            },
            queue: [],
            maxQueue: 3
        };
	},
    prepareImgs: function (ctx) {
        var star = new Image(),
            life = new Image();
        star.src = './img/star.png';
        life.src = './img/life.png';
        star.onload = function () {

        };
        life.onload = function () {

        };
        ctx.save();
        ctx.fillStyle = this.snake.skinColor2;
        ctx.fillRect(0, 0, this.snake.segment.width, this.snake.segment.height);
        ctx.fillStyle = this.snake.skinColor;
        ctx.fillRect(1, 1, this.snake.segment.width - 2, this.snake.segment.height - 2);
        ctx.restore();
        this.snake.segment.img = ctx.getImageData(0,0,this.snake.segment.width,this.snake.segment.height);
    },
	run: function () {
		var self = this,
			lastTime = 0,
			callback = function (t) {
                if (t - lastTime > 500) {
                    self.animLoop();
                    lastTime = t;
				}
                if (self.gameOver) {
                    self.stop();
                } else {
                    self.raf = window.requestAnimationFrame(callback);
                }
			};

        this.clear();
        this.draw();

        window.addEventListener('keydown', this.keyHandler, false);
		this.raf = window.requestAnimationFrame(callback);
	},
	stop: function () {
        console.log('stopped');
		window.cancelAnimationFrame(this.raf);
        window.removeEventListener('keydown', this.keyHandler, false);
    },
	clear: function () {
		this.context.clearRect(0,0,this.cWidth,this.cHeight);
	},
	draw: function () {
		this.snake.draw(this.context);
	},
	update: function () {
		var snakeLength = this.snake.body.length,
            i = 0;
        this.keyHandler.dispatchKey();

        for (i; i < snakeLength - 1; i++) {
			this.snake.body[i][0] = this.snake.body[i + 1][0];
			this.snake.body[i][1] = this.snake.body[i + 1][1];
		}
		this.snake.body[snakeLength - 1][0] += this.snake.dirX;
		this.snake.body[snakeLength - 1][1] += this.snake.dirY;
        this.checkFaint();

    },
	animLoop: function () {
        this.update();
        this.clear();
		this.draw();
    },
    checkFaint: function () {
        var lngth = this.snake.body.length,
            isBodyIntersection = this.snake.body.slice(0, -1).join(';').indexOf(this.snake.body[lngth - 1].toString()) !== -1,
            isOutBoundary = this.snake.body[lngth - 1][0] < 0 || this.snake.body[lngth - 1][0] >= 32 ||
                            this.snake.body[lngth - 1][1] < 0 || this.snake.body[lngth - 1][1] >= 32;
        if (isBodyIntersection || isOutBoundary) {
            this.gameOver = true;
            console.log('game over');
        }
    }
};