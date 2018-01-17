function Particle() {
    let colors = ['#6A0000', '#900000', '#902B2B', '#A63232', '#A62626', '#FD5039', '#C12F2A', '#FF6540', '#f93801'];   // red
    // let colors = ['#66C2FF', '#48819C', '#205487', '#1DA7D1', '#1FC3FF'];    // blue
    let dx;
    let dy;
    let spring = 1 / 10;
    let friction = 0.75;

    this.create = function(pos) {
        // this.decay = .95; //randomIntFromInterval(80, 95)/100;//
        this.decay = randomIntFromInterval(80, 95) / 100;
        this.radius = randomIntFromInterval(10, 70);
        this.R = 100 - this.radius;
        this.angle = Math.random() * 2 * Math.PI;
        this.center = pos; //{x:cx,y:cy}
        this.pos = {};
        this.pos.x = this.center.x + this.radius * Math.cos(this.angle);
        this.pos.y = this.center.y + this.radius * Math.sin(this.angle);
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

        return this;
    }

    this.move = function() {
        dx = (this.dest.x - this.pos.x);
        dy = (this.dest.y - this.pos.y);

        this.acc.x = dx * spring;
        this.acc.y = dy * spring;
        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;

        this.vel.x *= friction;
        this.vel.y *= friction;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        if (this.radius > 0) this.radius *= this.decay;
    }

    this.render = function() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    this.update = function() {
        this.move();
        this.render();
    }

}

function Explosion() {
    let audioSrc = './audio/explosion_2.mp3';
    let particles = {
        alive: [],
        pool: []
    };

    this.alive = true;
    ctx.strokeStyle = '#fff';
    this.life = 1;
    this.pos = {
        x: 0,
        y: 0
    };

    this.create = function(x, y) {
        this.alive = true;
        this.particlesCount = randomIntFromInterval(40, 60);
        this.pos.x = x;
        this.pos.y = y;

        for (let i = 0; i < this.particlesCount; i++) {
            if (particles.pool.length > 0) {
                console.log('Particle pool');
                particles.alive.push(particles.pool.pop().create(this.pos));
            } else {
                console.log('Particle create');
                particles.alive.push(new Particle().create(this.pos));
            }
        }

        this.playAudio();
        return this;
    }

    this.playAudio = function() {
        let sample = new Audio(audioSrc);
        sample.volume = 0.5;
        sample.play();
    }

    this.update = function() {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        let particle;

        for (let i = 0; i < particles.alive.length; i++) {
            particle = particles.alive[i];
            particle.update();

            if (particle.radius < 0.5) {
                particles.alive.splice(i, 1);
                particles.pool.push(particle);
            }
        }

        if (particles.alive.length === 0) {
            this.alive = false;
        }

        ctx.restore();
    }
}

function randomIntFromInterval(mn, mx) {
    return Math.floor(Math.random() * (mx - mn + 1) + mn);
}
