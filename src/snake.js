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
                segmentLength: 10,
                color: 'pink',
                length: 6,
                direction: 68,
                speed: 10,
                head: [],
                tail: [],
                bends: [],
                draw: function (ctx) {
                    ctx.clearRect(0, 0, grid.width, grid.height);
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
            };

        snake.tail = [5, 5];
        snake.head = [5 + (10 * snake.length), 5];
        self.snake = snake;
        self.ctx = doc.querySelector(el).getContext('2d');

        function animloop() {
            snake.draw(self.ctx);
        }

        var move = function (ev) {
            switch (ev.keyCode) {
                case 87:
                    //up key W
                    if (snake.bends.length === 0 || snake.bends[snake.bends.length - 1][1] === snake.head[1]) {
                        snake.bends.push([snake.head[0], snake.head[1]]);
                    }
                    snake.head[1] -= 10;
                    break;
                case 83:
                    //down key S
                    if (snake.bends.length === 0 || snake.bends[snake.bends.length - 1][1] === snake.head[1]) {
                        snake.bends.push([snake.head[0], snake.head[1]]);
                    }
                    snake.head[1] += 10;
                    break;
                case 65:
                    //left key A
                    if (snake.bends.length === 0 || snake.bends[snake.bends.length - 1][0] === snake.head[0]) {
                        snake.bends.push([snake.head[0], snake.head[1]]);
                    }
                    snake.head[0] -= 10;
                    break;
                case 68:
                    //right key D
                    if (snake.bends.length === 0 || snake.bends[snake.bends.length - 1][0] === snake.head[0]) {
                        snake.bends.push([snake.head[0], snake.head[1]]);
                    }
                    snake.head[0] += 10;
                    break;
                default:
                    console.log('none');
                    break;
            }
            snake.direction = ev.keyCode;
            if (snake.tail[0] === snake.bends[0][0]) {
                if (snake.tail[1] < snake.bends[0][1]) {
                    snake.tail[1] += 10;
                } else if (snake.tail[1] > snake.bends[0][1]) {
                    snake.tail[1] -= 10;
                }
            } else if (snake.tail[1] === snake.bends[0][1]) {
                if (snake.tail[0] < snake.bends[0][0]) {
                    snake.tail[0] += 10;
                } else if (snake.tail[0] > snake.bends[0][0]) {
                    snake.tail[0] -= 10;
                }
            }
            if (snake.tail[0] === snake.bends[0][0] && snake.tail[1] === snake.bends[0][1]) {
                snake.bends.shift();
            }

            win.requestAnimFrame(animloop);
            console.log(snake.bends);
        };
        self.snake.eat = function () {
            var head = this.head,
                dir = this.direction;
            switch (dir) {
                case 87:
                    head[1] -= 10;
                    break;
                case 83:
                    head[1] += 10;
                    break;
                case 65:
                    head[0] -= 10;
                    break;
                case 68:
                    head[0] += 10;
                    break;
            }
            win.requestAnimFrame(animloop);
        };
        win.addEventListener('keydown', move, false);
        win.requestAnimFrame(animloop);
    }

    return Game;
}(window, document));

