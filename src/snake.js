var SnakeGame = (function (win, doc) {
    'use strict';
    //var $ = win.$;
    win.requestAnimFrame = (function () {
        return win.requestAnimationFrame ||
            win.webkitRequestAnimationFrame ||
            win.mozRequestAnimationFrame ||
            function (callback) {
                win.setTimeout(callback, 1000 / 60);
            };
    }());

    function Game(el) {
        var self = this, i,
            grid = {
                width: 240,
                height: 240
            },
            snake = {
                width: 10,
                color: 'pink',
                length: 6,
                direction: Math.PI/2,
                speed: 1,
                head: [],
                tail: [],
                bends: [],
                draw: function (ctx) {
                    ctx.save();
                    ctx.lineWidth = this.width;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.strokeStyle = this.color;
                    ctx.beginPath();
                    ctx.moveTo(this.tail[0], this.tail[1]);
                    if (this.bends.length > 0) {
                        for (i = 0; i < this.bends.length; i++) {
                            ctx.lineTo(this.bends[i][0], this.bends[i][1]);
                            ctx.moveTo(this.bends[i][0], this.bends[i][1]);
                        }
                    }
                    ctx.lineTo(this.head[0], this.head[1]);
                    ctx.stroke();
                    ctx.restore();
                }
            },
            ctx = doc.querySelector(el).getContext('2d');

        snake.tail = [5, 5];
        snake.head = [5 + (10 * snake.length), 5];
        self.ctx = ctx;

        function animloop() {
            snake.move();
            ctx.clearRect(0, 0, grid.width, grid.height);
            snake.draw(self.ctx);
            win.requestAnimFrame(animloop);
        }

        var turn = function (ev) {
            var dir = 0;
            switch (ev.keyCode) {
                case 87:
                    //up key W
                    dir = Math.PI;
                    break;
                case 83:
                    //down key S
                    dir = 0;
                    break;
                case 65:
                    //left key A
                    dir = 3 * Math.PI / 2;
                    break;
                case 68:
                    //right key D
                    dir = Math.PI / 2;
                    break;
                default:
                    console.log('none');
                    break;
            }
            if (snake.direction === dir || Math.round(Math.sin(dir - snake.direction)) === 0 ) {
                return false;
            }
            snake.direction = dir;
            snake.bends.push([snake.head[0], snake.head[1]]);
            console.log(snake.bends);
            return true;

        };
        snake.move = function () {
            if (snake.bends.length === 0) {
                snake.bends.push([snake.head[0], snake.head[1]]);
            }
            if (snake.head[0] > 0 && snake.head[0] < grid.width && snake.head[1] > 0 && snake.head[1] < grid.height) {
                snake.head[0] += snake.speed * Math.round(Math.sin(snake.direction));
                snake.head[1] += snake.speed * Math.round(Math.cos(snake.direction));
                if (snake.tail[0] === snake.bends[0][0]) {
                    if (snake.tail[1] < snake.bends[0][1]) {
                        snake.tail[1] += snake.speed;
                    } else if (snake.tail[1] > snake.bends[0][1]) {
                        snake.tail[1] -= snake.speed;
                    }
                } else if (snake.tail[1] === snake.bends[0][1]) {
                    if (snake.tail[0] < snake.bends[0][0]) {
                        snake.tail[0] += snake.speed;
                    } else if (snake.tail[0] > snake.bends[0][0]) {
                        snake.tail[0] -= snake.speed;
                    }
                }
                if (snake.tail[0] === snake.bends[0][0] && snake.tail[1] === snake.bends[0][1]) {
                    snake.bends.shift();
                }
            } else {
                return false;
            }
        };
        snake.eat = function () {
            var head = this.head,
                dir = this.direction;
        };
        self.snake = snake;
        win.addEventListener('keydown', turn, false);
        win.requestAnimFrame(animloop);
    }

    return Game;
}(window, document));

