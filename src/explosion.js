let ctx;
let colors = ['#6A0000', '#900000', '#902B2B', '#A63232', '#A62626', '#FD5039', '#C12F2A', '#FF6540', '#f93801'];
//let colors = ['#66C2FF', '#48819C', '#205487', '#1DA7D1', '#1FC3FF'];
let spring = 1 / 10;
let friction = .85;

function Particle(coords) {
    this.decay = .95; //randomIntFromInterval(80, 95)/100;//
    this.r = randomIntFromInterval(10, 70);
    this.R = 100 - this.r;
    this.angle = Math.random() * 2 * Math.PI;
    this.center = coords; //{x:cx,y:cy}
    this.pos = {};
    this.pos.x = this.center.x + this.r * Math.cos(this.angle);
    this.pos.y = this.center.y + this.r * Math.sin(this.angle);
    this.dest = {};
    this.dest.x = this.center.x + this.R * Math.cos(this.angle);
    this.dest.y = this.center.y + this.R * Math.sin(this.angle);
    this.color = colors[~~(Math.random() * colors.length)];
    this.vel = {
        x: 0,
        y: 0
    };
    this.acc = {
        x: 0,
        y: 0
    };

    this.update = function() {
        let dx = (this.dest.x - this.pos.x);
        let dy = (this.dest.y - this.pos.y);

        this.acc.x = dx * spring;
        this.acc.y = dy * spring;
        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;

        this.vel.x *= friction;
        this.vel.y *= friction;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        if (this.r > 0) this.r *= this.decay;
    }

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
    }

}

function Explosion(context) {
    console.log(this);
    ctx = context;
    ctx.strokeStyle = '#fff';
    this.life = 1;
    this.pos = {
        x: 0,
        y: 0
    };
    this.particles = [];

    this.create = function(x, y) {
        this.particlesCount = 50;
        this.pos.x = x;
        this.pos.y = y;

        for (let i = 0; i < this.particlesCount; i++) {
            this.particles.push(new Particle(this.pos));
        }

        return this;
    }

    this.update = function() {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
            if (this.particles[i].r < .5) {
                this.particles.splice(i, 1)
            }
        }

        return this;
    }

    this.draw = function() {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].draw();
        }

        return this;
    }
}

function randomIntFromInterval(mn, mx) {
    return Math.floor(Math.random() * (mx - mn + 1) + mn);
}

export default Explosion();
