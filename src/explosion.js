let ctx ;
let minSize = 10;
let maxSize = 35;
let emission = 40;
let colors = [
    '#FF637D',
    '#FF6666',
    '#53D68E',
    '#807EE5',
    '#23CAEF',
];

let pixelDensity = window.devicePixelRatio;

let mouseDown = false;
let mouseMoved = false;
let mousePosition;
let particles = [];
let raf;

function Particle(context) {
    this.pos = {
        dx: 0,
        dy: 0
    }
    this.size = Math.floor(Math.random() * (maxSize - minSize) + minSize);
    this.size *= pixelDensity;
    this.velocity = Math.random() * (7 - 5) + 5;
    this.velocity *= pixelDensity;
    this.angle = (Math.random() * 360);
    this.fill = colors[Math.floor(Math.random() * (colors.length))];
    this.shape = Math.floor(Math.random() * 2) === 0 ? 'circle' : 'square';
    this.alive = true;
    this.alpha = 1;
    this.hSize = this.size / 2;

    this.create = function(dx, dy) {
        this.dx = dx;
        this.dy = dy;

        return this;
    }

    this.draw = function() {
        context.save();
        context.globalAlpha = this.alpha;
        context.fillStyle = this.fill;
        if (this.shape === 'circle') {
            context.beginPath();
            context.arc(Math.floor(this.x),Math.floor(this.y),this.size,0,2*Math.PI);
        } else if (this.shape === 'square') {
            context.rect(
                (Math.floor(this.x) - (this.size / 2)),
                (Math.floor(this.y) - (this.size / 2)),
                (this.size),
                (this.size)
            );
        }
        context.lineWidth = 4 * pixelDensity;
        context.fill();
        context.restore();

        return this;
    }

    this.move = function() {
        this.x += Math.floor((this.velocity * Math.cos(this.angle * Math.PI / 180)) * 2.5);
        this.y += Math.floor((this.velocity * Math.sin(this.angle * Math.PI / 180)) * 2.5);
        this.size -= 0.75 * pixelDensity;

        if (this.velocity <= 1) {
            this.alpha -= 0.1;

            if (this.alpha <= 0) {
                this.alpha = 0;
            }
        }

        this.angle += 1;
        this.velocity -= 0.3 * pixelDensity;

        if (this.size <= 0) {
            this.size = 0;
        }

        return this;
    }

    this.update = function() {
        this.draw().move();
    }
}

export default Particle;
