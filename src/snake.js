var SnakeGame = function (elID) {
	'use strict';
    var self = this,
        resources = {
            'img_star': 'img/star.png',
            'img_life': 'img/life.png'
        };

    self.canvas = document.createElement('canvas');
    self.offCanvas = document.createElement('canvas');
    self.cWidth = 320;
    self.cHeight = 320;
    self.canvas.width = self.offCanvas.width = self.cWidth;
    self.canvas.height = self.offCanvas.height = self.cHeight;
    self.context = self.canvas.getContext('2d');
    self.offContext = self.offCanvas.getContext('2d');
    self.container = document.querySelector(elID);
    self.raf = null;
    self.food = {
        star: null,
        life: null,
        positions: [[10, 10, 'star'], [20, 20, 'life']]
    };
    self.gameOver = false;
    self.loader = imgLoader;

    self.container.appendChild(self.canvas);

    self.loader.load(resources).onReady(function () {
        self.init().run();
    });
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
            },
            scanner: function (foodData) {
                var nextHeadX = this.body[this.body.length - 1][0] + this.dirX,
                    nextHeadY = this.body[this.body.length - 1][1] + this.dirY,
                    type = '';
                console.log(JSON.stringify([nextHeadX, nextHeadY]), JSON.stringify(foodData.positions).indexOf('[' + [nextHeadX, nextHeadY]));
                return type;
            },
            move: function () {
                var i = 0;

                for (i; i < this.body.length - 1; i++) {
                    this.body[i][0] = this.body[i + 1][0];
                    this.body[i][1] = this.body[i + 1][1];
                }
                this.body[this.body.length - 1][0] += this.dirX;
                this.body[this.body.length - 1][1] += this.dirY;
            },
            eat: function (foodType) {
                switch (foodType) {
                    case 'star':
                        this.grow();
                        break;
                    case 'life':
                        this.move();
                        break;
                    default:
                        break;
                }
            },
            grow: function () {
                var x = this.body[this.body.length - 1][0] + this.dirX,
                    y = this.body[this.body.length - 1][1] + this.dirY;
                this.body.push([x, y]);
            }
		};

		this.snake = new Snake(20);

		this.getImagesFromCache();

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

        return this;
	},
    getImagesFromCache: function () {
        /** Prepare Snake segment on offscreen canvas */
        this.offContext.fillStyle = this.snake.skinColor2;
        this.offContext.fillRect(0, 0, this.snake.segment.width, this.snake.segment.height);
        this.offContext.fillStyle = this.snake.skinColor;
        this.offContext.fillRect(1, 1, this.snake.segment.width - 2, this.snake.segment.height - 2);

        this.snake.segment.img = this.offContext.getImageData(0,0,this.snake.segment.width,this.snake.segment.height);

        this.food.star = this.loader.getData('img_star');
        this.food.life = this.loader.getData('img_life');

        return this;
    },
	run: function () {
		var self = this,
			lastTime = 0,
			callback = function (t) {
                t = Date.now();
                if (t - lastTime > 200) {
                    self.animLoop();
                    lastTime = t;
                }
                if (!self.gameOver) {
                    self.raf = window.requestAnimationFrame(callback);
                } else {
                    self.stop();
                }
			};

        window.addEventListener('keydown', this.keyHandler, false);
		this.raf = window.requestAnimationFrame(callback);
	},
	stop: function () {
        console.log('stopped');
		window.cancelAnimationFrame(this.raf);
        window.removeEventListener('keydown', this.keyHandler, false);
    },
    animLoop: function () {
        this.draw();
        this.update();
    },
	clear: function () {
		this.context.clearRect(0,0,this.cWidth,this.cHeight);
	},
	draw: function () {
        this.clear();
        this.drawFood(this.context);
		this.snake.draw(this.context);
	},
    drawFood: function (ctx) {
        var i, foodType;
        for (i = 0; i < this.food.positions.length; i++) {
            foodType = this.food.positions[i][2];
            ctx.drawImage(this.food[foodType], this.food.positions[i][0] * 10, this.food.positions[i][1] * 10, 10, 10);
        }
    },
	update: function () {
		var snakeLength = this.snake.body.length,
            i = 0;

        this.keyHandler.dispatchKey();
        this.snake.scanner(this.food);
        this.snake.move();
        this.isFaint();
    },
    isFaint: function () {
        var body = this.snake.body,
            headX = body[body.length - 1][0],
            headY = body[body.length - 1][1],
            isBodyIntersection = JSON.stringify(body.slice(0, -1)).indexOf(JSON.stringify([headX, headY])) !== -1,
            isOutBoundary = headX < 0 || headX >= 32 || headY < 0 || headY >= 32;
        if (isBodyIntersection || isOutBoundary) {
            this.gameOver = true;
            console.log('game over');
        }
        return this.gameOver;
    }
};