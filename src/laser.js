let ctx;
let laserProps = {
    blurColor: '#17ED22',
    blurAmount: 25,
    color: '#F8FFEF',
    endCaps: 'round',
    flashSize: 150,
    length: 150,
    spread: 20,
    velocity: 45,
    width: 10
}
let laserAudioSamples = [
    {
        sample: './audio/laser_1.mp3',
        weight: 8
    },
    {
        sample: './audio/laser_3.mp3',
        weight: 1
    }
];
let laserAudioWeightTotal = laserAudioSamples.reduce((acc, sample) => acc += sample.weight, 0);

function Laser(context) {
    ctx = context;
    let wX = window.innerWidth;
    let wY = window.innerHeight;
    this.pos = {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0
    }

    this.create = function(dx, dy) {
        this.pos.dx = dx;
        this.pos.dy = dy;

        // Determine at random which window side & location for laser origin
        let side = Math.floor(Math.random() * Math.floor(4));

        if (side === 0) {
            // Window top
            this.pos.y = 0;
            this.pos.x = Math.floor(Math.random() * Math.floor(wX));
        } else if (side === 1) {
            // Window right
            this.pos.y = Math.floor(Math.random() * Math.floor(wY));
            this.pos.x = wX;
        } else if (side === 2) {
            // Window bottom
            this.pos.x = Math.floor(Math.random() * Math.floor(wX));
            this.pos.y = wY;
        } else {
            // Window left
            this.pos.x = 0;
            this.pos.y = Math.floor(Math.random() * Math.floor(wY));
        }

        this.angle = pointsToDegrees({ x: this.pos.x, y: this.pos.y }, { x: dx, y: dy });
        this.dist = Math.sqrt(Math.pow(dx - this.pos.x, 2) + Math.pow(dy - this.pos.y, 2));
        this.life = Math.ceil(this.dist / laserProps.velocity);

        this.draw();
        this.playAudio();

        return this;
    }

    this.draw = function() {
        ctx.save();

        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.angle * Math.PI / 180);

        this.renderLaser(laserProps.blurColor, laserProps.width, -1);       // Left inner white laser
        this.renderLaser(laserProps.color, laserProps.width, -1);           // left outer green laser
        this.renderLaser(laserProps.blurColor, laserProps.width, 1);        // right inner white laser
        this.renderLaser(laserProps.color, laserProps.width, 1);            // right outer green laser

        ctx.restore();

        return this;
    }

    this.flash = function() {
        let alpha = this.life !== 0 ? 1 - (1 / this.life) : 0.1;
        let size = alpha * laserProps.flashSize;
        let gradient = ctx.createRadialGradient(this.pos.dx, this.pos.dy, size, this.pos.dx, this.pos.dy, 0);

        ctx.save();
        ctx.rect(this.pos.dx - size, this.pos.dy - size, size * 2, size * 2);
        ctx.globalAlpha = alpha;
        gradient.addColorStop(0, '#17ED2200');
        gradient.addColorStop(1, '#17ED22');
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.restore();

        return this;
    }

    this.renderLaser = function(color, width, offset) {
        ctx.beginPath();
        ctx.lineCap = laserProps.endCaps;
        ctx.lineWidth = width;
        ctx.shadowBlur = laserProps.blurAmount;
        ctx.shadowColor = color;
        ctx.strokeStyle = color;
        ctx.moveTo(-laserProps.length / 2, offset * laserProps.spread / 2);
        ctx.lineTo(laserProps.length / 2, offset * laserProps.spread / 2);
        ctx.stroke();
    }

    this.playAudio = function() {
        let rnd = Math.random();
        let sample;

        // Select random sample from array proportional to weight
        laserAudioSamples.reduce((acc, samp, i) => {
            acc += (samp.weight / laserAudioWeightTotal);

            if (rnd < acc) {
                sample = new Audio(laserAudioSamples[i].sample);
                rnd = laserAudioWeightTotal;
            }

            return acc;
        }, 0);

        sample.volume = 0.5;
        sample.play();
        return this;
    }

    this.move = function() {
        this.life -= 1;
        this.pos.x += laserProps.velocity * Math.cos(this.angle * Math.PI / 180);
        this.pos.y += laserProps.velocity * Math.sin(this.angle * Math.PI / 180);
        return this;
    }

    this.update = function() {
        this.draw().move();

        // if (this.life < 5 && this.life > 0) {
        //     this.flash();
        // }

        return this;
    }
}

function pointsToDegrees(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
}

// function pointsToRadians(p1, p2) {
//     return Math.atan2(p2.y - p1.y, p2.x - p1.x);
// }

export default Laser;
