var SnakeGame = (function () {
	var Snake = function (options) {
		var sw = options.segmentWidth,
			sh = options.segmentHeight,
			l = options.length || 3,
			gender = options.gender || 'male',
			dirX = options.dirX || 1,
			dirY = options.dirY || 0;

		this.gender = gender;
		this.colorMap = {
			male: ['green', 'cyan'],
			female: ['#ffaa99', 'purple']
		};
		this.segment = {
			width: sw,
			height: sh,
			img: null
		};
		this.keyMap = {
			//added movement with the arrows 
			87: [0,-1], //up (with w)
			38: [0,-1], //up (with arrow up)
			83: [0,1], //down (with s)
			40: [0,1], //down (with arrow down)
			65: [-1,0], //left (with a)
			37: [-1,0], //left (with arrow left)
			68: [1,0], //right (with d)
			39: [1,0] //right (with arrow right)
		};
		this.speed = options.speed || 1;
		this.lives = options.lives || 3;
		this.dirX = +(dirY === 0) * dirX;
		this.dirY = +(dirX === 0) * dirY;
		this.initDirX = +(dirY === 0) * dirX;
		this.initDirY = +(dirX === 0) * dirY;
		this.startX = options.startX || 0;
		this.startY = options.startY || 0;
		this.initialLng = l;
		this.body = [];

		this.init();

		return this;
	};

	Snake.prototype = {
		init: function () {
			var i = 0;
			for (i; i < this.initialLng; i++) {
				this.body.push([(i * this.initDirX) + this.startX, (i * this.initDirY) + this.startY]);
			}
			this.dirX = this.initDirX;
			this.dirY = this.initDirY;
			return this;
		},
		draw: function (ctx) {
			var self = this,
				i = 0;
			for (i; i < self.body.length; i++) {
				ctx.putImageData(self.segment.img, self.body[i][0] * self.segment.width, self.body[i][1] * self.segment.height);
			}
		},
		prepareSegment: function (ctx) {
			//if the radio button "male" is checked
			if (document.getElementById("male_gender").checked) {
				this.skinColor = this.colorMap["male"][0];
				this.skinColor2 = this.colorMap["male"][1];
				ctx.fillStyle = this.skinColor2;
				ctx.fillRect(0, 0, this.segment.width, this.segment.height);
				ctx.fillStyle = this.skinColor;
				ctx.fillRect(1, 1, this.segment.width - 2, this.segment.height - 2);
			}
			//if the radio button "female" is checked
			if (document.getElementById("female_gender").checked) {
				this.skinColor = this.colorMap["female"][0];
				this.skinColor2 = this.colorMap["female"][1];
				ctx.strokeStyle = this.skinColor2;
				ctx.lineWidth = 1;
				ctx.fillStyle = this.skinColor;
				ctx.beginPath();
				ctx.moveTo(this.segment.width/2, 0);
				ctx.lineTo(this.segment.width, this.segment.height/2);
				ctx.lineTo(this.segment.width/2, this.segment.height);
				ctx.lineTo(0, this.segment.height/2);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			}
			this.segment.img = ctx.getImageData(0,0,this.segment.width,this.segment.height);
		},
		control: function (key) {
			if (this.keyMap.hasOwnProperty(key)) {
				var dirX = this.keyMap[key][0],
					dirY = this.keyMap[key][1],
					self = this;
				if ((self.dirX + dirX) && (self.dirY + dirY)) {
					self.dirY = dirY; self.dirX = dirX;
				}
			}
		},
		scan: function (foodPos) {
			var nextHeadX = this.body[this.body.length - 1][0] + this.dirX,
				nextHeadY = this.body[this.body.length - 1][1] + this.dirY,
				foodDetected = null,
				i = 0;
			for (i; i < foodPos.length; i++) {
				if (foodPos[i][0] === nextHeadX && foodPos[i][1] === nextHeadY) {
					foodDetected = foodPos[i];
					foodPos.splice(i, 1);
					return foodDetected;
				}
			}
			return null;
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
		eat: function (food) {
			var foodType = food instanceof Array ? food[2] : '';
			var eatActions = {
				'star': 'grow',
				'life': 'addLife'
			};
			if (typeof this[eatActions[foodType]] === 'function') {
				this[eatActions[foodType]]();
			}
			return foodType;
		},
		grow: function () {
			var x = this.body[this.body.length - 1][0] + this.dirX,
				y = this.body[this.body.length - 1][1] + this.dirY;
			this.body.push([x, y]);
		},
		loseLife: function () {
			if (this.lives > 0) {
				this.lives -= 1;
			}
			return this.lives;
		},
		revive: function () {
			this.body = [];
			return this.init().loseLife();
		}
	};

	var Game = function (elID, width, height) {
		'use strict';
		var self = this,
			resources = {
				'img_star': 'img/star.png',
				'img_life': 'img/life.png'
			},
			gridSpacing = 10; //square element size in px

		self.canvas = document.createElement('canvas');
		self.offCanvas = document.createElement('canvas');

		self.cWidth = width ? width - (width % gridSpacing) : 320;
		self.cHeight = height ? height - (height % gridSpacing) : 320;
		self.gridSpacing = gridSpacing;
		self.canvas.width = self.offCanvas.width = self.cWidth;
		self.canvas.height = self.offCanvas.height = self.cHeight;
		self.context = self.canvas.getContext('2d');
		self.offContext = self.offCanvas.getContext('2d');
		self.container = document.querySelector(elID);
		self.raf = null;

		self.food = {
			star: null,
			life: null,
			positions: []
		};
		self.hiScore = 0;
		self.gameOver = false;
		self.loader = imgLoader;

		self.container.appendChild(self.canvas);

		self.loader.load(resources).onReady(function () {
			self.init().run();
		});
	};

	Game.prototype = {
		init: function () {
			var game = this;

			this.snake = new Snake({
				segmentWidth: game.gridSpacing,
				segmentHeight: game.gridSpacing
			});

			this.getImagesFromCache();

			this.controller = {
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
			this.snake.prepareSegment(this.offContext);

			this.food.star = this.loader.getData('img_star');
			this.food.life = this.loader.getData('img_life');

			return this;
		},
		run: function () {
			var self = this,
				lastTime = 0,
				callback = function (t) {
					t = Date.now();
					if (t - lastTime > 150) {
						self.gameLoop();
						lastTime = t;
					}
					if (!self.gameOver) {
						self.raf = window.requestAnimationFrame(callback);
					} else {
						self.stop();
					}
				};

			window.addEventListener('keydown', this.controller, false);
			this.raf = window.requestAnimationFrame(callback);
		},
		stop: function () {
			var ctx = this.context;
			console.log('stopped');
			window.cancelAnimationFrame(this.raf);
			window.removeEventListener('keydown', this.controller, false);
			//to display the "game over" title you see when you lose the game
			if(this.gameOver){
				ctx.font = "30px Helvetica";
				ctx.fillText("GameOver", 170,150);
				ctx.font = "20px Helvetica"
				ctx.fillText("To restart press r", 170,180);
			}
		},
		gameLoop: function () {
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
			var i, foodType,
				w, h;
			w = h = this.gridSpacing;
			for (i = 0; i < this.food.positions.length; i++) {
				foodType = this.food.positions[i][2];
				ctx.drawImage(this.food[foodType], this.food.positions[i][0] * w, this.food.positions[i][1] * h, w, h);
			}
		},
		update: function () {
			this.controller.dispatchKey();
			var scanResult = this.snake.scan(this.food.positions);
			var foodEaten = this.snake.eat(scanResult);
			if (!foodEaten) {
				this.snake.move();
			}
			this.foodPlacer();
			this.isFaint();
		},
		foodPlacer: function (foodType) {
			var type = foodType && foodType instanceof String ? foodType : '',
				self = this,
				generated = null,
				rndPos = function (axis) {
					var gridSize = (axis == 'x' ? self.cWidth : self.cHeight) / self.gridSpacing;
					return Math.floor(Math.random() * gridSize);
				},
				isPlaceBusy = function (x, y) {
					var newPos = new RegExp('\\[' + [x,y]);
					return newPos.test(JSON.stringify(self.snake.body) + JSON.stringify(self.food.positions));
				},
				genFood = function (str) {
					var tries = 0,
						rndX = rndPos('x'),
						rndY = rndPos('y');
					while (isPlaceBusy(rndX, rndY) && tries < 3) {
						rndX = rndPos('x');
						rndY = rndPos('y');
						tries++;
					}
					var food = [rndX, rndY, str];
					if (tries < 3) {
						self.food.positions.push(food);
						return food;
					}
					return null;
				};
			if (type.length == 0 && this.food.positions.length < 1) {
				generated = genFood('star');
			} else if (type.length > 0) {
				generated = genFood(type);
			}
			return generated;
		},
		isFaint: function () {
			var body = this.snake.body,
				headX = body[body.length - 1][0],
				headY = body[body.length - 1][1],
				isBodyIntersection = JSON.stringify(body.slice(0, -1)).indexOf(JSON.stringify([headX, headY])) !== -1,
				isOutBoundary =
					headX < 0 || headX >= this.cWidth / this.gridSpacing ||
						headY < 0 || headY >= this.cHeight / this.gridSpacing;
			if (isBodyIntersection || isOutBoundary) {
				var livesLeft = this.snake.revive();
				if (!livesLeft) {
					console.log('game over');
					this.gameOver = true;
				}
			}
			return this.gameOver;
		}
	};

	return Game;
}());
