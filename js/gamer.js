const canvasE1 =  document.querySelector("canvas")
const canvasCtx = canvasE1.getContext("2d")
const lineWidth = 15
const gapX = 10

const mouse = { x: 0, y: 0 }

const field = {
    w: window.innerWidth,
    h: window.innerHeight,
    draw: function() {
        canvasCtx.fillStyle = "#286047"
        canvasCtx.fillRect(0,0, this.w, this.h)
    }
}

const line = {
    w: lineWidth,
    h: field.h,
    draw: function() {
        canvasCtx.fillStyle = "#fff"
        canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h)
    }
}

const leftPaddle = {
    x: gapX,
    y: 300,
    w: lineWidth,
    h: 200,
    _move: function() {
        this.y = mouse.y - this.h / 2
    },
    draw: function() {
        canvasCtx.fillStyle = "#fff"
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)
        this._move()
    }
}

const rightPaddle = {
    x: field.w - lineWidth - gapX,
    y: 600,
    w: lineWidth,
    h: 200,
    seep: 5,
    // _move: function() {
    //     this.y = mouse.y - this.h / 2
    // },
    _move: function() {
        if (ball.y + ball.r > this.y + this.h / 2) {
            this.y += this.seep
        } else if (ball.y < this.y + this.h / 2) {
            this.y -= this.seep
        }
    },
    speed: function() {
        this.seep += 0.5
    },
    draw: function() {
        canvasCtx.fillStyle = "#fff"
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)
        this._move()
    }
}

const ball = {
    x: 200,
    y: 550,
    r: 20,
    seep: 5,
    directionX: 1,
    directionY: 1,
    _calcPosition: function() {
        if (this.x > field.w - this.r - rightPaddle.w - gapX) {
            if (this.y + this.r > rightPaddle.y && this.y - this.r < rightPaddle.y + rightPaddle.h) {
                this._reverseX()
            } else {
                this._pointUp()
                score.increaseHuman()
            }
        }

        if (this.x < this.r + leftPaddle.w + gapX) {
            if (this.y + this.r > leftPaddle.y && this.y - this.r < leftPaddle.y + leftPaddle.h) {
                this._reverseX()
            } else {
                this._pointUp()
                score.increaseComputer()
            }
        }

        if ((this.y - this.r < 0 && this.directionY < 0) ||
            (this.y > field.h - this.r && this.directionY > 0)) {
            this._reverseY()
        }
    },
    _speedUp: function() {
        this.seep += 5
    },
    _pointUp: function() {
        this._speedUp
        rightPaddle.speed()
        this.x = field.w / 2
        this.y = field.h / 2
    },
    _reverseX: function() {
        this.directionX *= -1
    },
    _reverseY: function() {
        this.directionY *= -1
    },
    _move: function () {
        this.x += this.directionX * this.seep
        this.y += this.directionY * this.seep
    },
    draw: function() {
        canvasCtx.fillStyle = "#fff"
        canvasCtx.beginPath()
        canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
        canvasCtx.fill()
        this._calcPosition()
        this._move()
    }
}

const score = {
    human: 0,
    computer: 0,
    increaseHuman: function() {
        this.human++
    },
    increaseComputer: function() {
        this.computer++
    },
    draw: function() {
        canvasCtx.font = "bold 72px Arial"
        canvasCtx.textAlign = "center"
        canvasCtx.textBaseline = "top"
        canvasCtx.fillStyle = "#01341D"
        canvasCtx.fillText(this.human, field.w / 4, 50)
        canvasCtx.fillText(this.computer, field.w / 4 + field.w / 2, 50)
    }
}


function setup(){
    canvasE1.width = canvasCtx.width = field.w
    canvasE1.height = canvasCtx.height = field.h
}

function draw() {
    field.draw()
    line.draw()
    rightPaddle.draw()
    leftPaddle.draw()
    ball.draw()
    score.draw()
}

window.animateFrame = (function(){
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60)
        }
    )
})()

function main() {
    animateFrame(main)
    draw()
}

setup()
main()

canvasE1.addEventListener('mousemove', function(e){
    mouse.x = e.pageX
    mouse.y = e.pageY
})