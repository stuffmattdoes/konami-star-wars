function Laser() {
    let blurColor = '#17ED22';
    let blur = 25;
    let color = '#F8FFEF';
    let endCaps = 'round';
    let len = 150;
    let spread = 20;
    let vel = 45;
    let width = 10;
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

    this.alive = true;
    this.pos = {};
    this.pos.x = 0;
    this.pos.y = 0;
    this.pos.dx = 0;
    this.pos.dy = 0;

    this.create = function(dx, dy) {
        this.alive = true;
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
        this.life = Math.ceil(this.dist / vel);

        this.render();
        this.playAudio();
        return this;
    }

    this.move = function() {
        this.pos.x += vel * Math.cos(this.angle * Math.PI / 180);
        this.pos.y += vel * Math.sin(this.angle * Math.PI / 180);
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
    }

    this.render = function() {
        ctx.save();

        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.angle * Math.PI / 180);

        this.renderLaser(blurColor, width, -1);       // left outer green laser
        this.renderLaser(color, width, -1);           // Left inner white laser
        this.renderLaser(blurColor, width, 1);        // right outer green laser
        this.renderLaser(color, width, 1);            // right inner white laser

        ctx.restore();
    }

    this.renderLaser = function(color, width, offset) {
        ctx.beginPath();
        ctx.lineCap = endCaps;
        ctx.lineWidth = width;
        ctx.shadowBlur = blur;
        ctx.shadowColor = color;
        ctx.strokeStyle = color;
        ctx.moveTo(-len / 2, offset * spread / 2);
        ctx.lineTo(len / 2, offset * spread / 2);
        ctx.stroke();
    }

    this.update = function() {
        this.life -= 1;

        if (this.life <= 0) {
            this.alive = false;
        }

        this.move();
        this.render();
    }
}
