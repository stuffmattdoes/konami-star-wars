
function konamiCanvas(props) {
    // Variables
    let canvas;
    let ctx;
    let halfH = 0;
    let halfW = 0;
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
    let laserPool = [];
    let laserProps = {
        blurColor: '#2CE731',
        blurAmount: 25,
        color: '#F8FFEF',
        endCaps: 'round',
        length: 125,
        spread: 25,
        width: 10
    }
    let lasersActive = [];
    let laserVelocity = 35;
    let mouse = {
        x: 0,
        y: 0
    };
    // let pixelDensity = window.devicePixelRatio;
    let pixelDensity = 1;
    let wX = window.innerWidth;
    let wY = window.innerHeight;

    function init() {
        createCanvas();
        resize();
        requestAnimationFrame(mainUpdate);
    }

    function createCanvas() {
        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
        canvas.classList.add('konami-canvas');
        document.body.appendChild(canvas);
        window.addEventListener('mousedown', shootLaser);
    }

    function debounce(event, callback, ms) {
        let timeoutId = null;

        if (timeoutId) {
            window.clearTimeout(timeoutId);
        }

        timeoutId = window.setTimeout(callback, ms);
    }

    function laser(e) {
        this.fill = 'green';
        this.pos = {
            x: 0,
            y: 0,
            startX: 0,
            startY: 0
        }

        this.init = function() {
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
            this.pos.startX = this.pos.x;
            this.pos.startY = this.pos.y;

            this.angle = pointsToDegrees({ x: this.pos.x, y: this.pos.y }, { x: mouse.x, y: mouse.y });
            this.dist = Math.sqrt(Math.pow(mouse.x - this.pos.x, 2) + Math.pow(mouse.y - this.pos.y, 2));
            this.life = Math.ceil(this.dist / laserVelocity); // how long to keep alive
            // this.slope = (mouse.y - this.pos.y) / (mouse.x - this.pos.x);
            // this.nSlope = Math.atan2(mouse.y - this.pos.y, mouse.x - this.pos.x);
            // this.nmSlope = Math.atan(this.slope);

            this.draw();
            this.playAudio();
            return this;
        }

        this.draw = function() {
            ctx.save();

            ctx.translate(this.pos.x, this.pos.y);
            ctx.rotate(this.angle * Math.PI / 180);

            ctx.shadowColor = laserProps.blurColor;
            ctx.shadowBlur = laserProps.blurAmount;
            ctx.lineWidth = laserProps.width;
            ctx.lineCap = laserProps.endCaps;
            ctx.strokeStyle = laserProps.color;

            // First path
            ctx.beginPath();
            ctx.moveTo(-laserProps.length / 2, -laserProps.spread / 2);
            ctx.lineTo(laserProps.length / 2, -laserProps.spread / 2);
            ctx.stroke();

            // Second path
            ctx.beginPath();
            ctx.moveTo(-laserProps.length / 2, laserProps.spread / 2);
            ctx.lineTo(laserProps.length / 2, laserProps.spread / 2);
            ctx.stroke();

            ctx.restore();

            return this;
        }

        this.playAudio = function() {
            let rnd = Math.random();

            // Select random sample from array proportional to weight
            laserAudioSamples.reduce((acc, samp, i) => {
                acc += (samp.weight / laserAudioWeightTotal);

                if (rnd < acc) {
                    new Audio(laserAudioSamples[i].sample).play();
                    rnd = laserAudioWeightTotal;
                }

                return acc;
            }, 0);
            return this;
        }

        this.move = function() {
            this.life -= 1;
            this.pos.x += laserVelocity * Math.cos(this.angle * Math.PI / 180);
            this.pos.y += laserVelocity * Math.sin(this.angle * Math.PI / 180);
            return this;
        }

        this.update = function() {
            this.draw().move();
            return this;
        }

        this.init();
    }

    function resize() {
        window.addEventListener('resize', e => debounce(e, resize, 500));
        canvas.width = window.innerWidth * pixelDensity;
        canvas.height = window.innerHeight * pixelDensity;
        halfH = canvas.height / 2;
        halfW = canvas.width / 2;
    }

    function shootLaser(e) {
        mouse.x = e.clientX || e.touches[0].clientX;
        mouse.y = e.clientY || e.touches[0].clientY;

        if (laserPool.length > 0) {
            lasersActive.push(laserPool.pop().init());
        } else {
            lasersActive.push(new laser(e));
        }

        // let newLaser = laserPool.length > 0 ? laserPool.pop() : lasersActive.push(new laser(e));
    }

    function pointsToDegrees(p1, p2) {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
    }

    function pointsToRadians(p1, p2) {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    }

    function mainUpdate() {
        ctx.fillStyle = 'transparent';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let laser;
        for (let i = 0; i < lasersActive.length; i++) {
            laser = lasersActive[i];
            if (laser.life > 0) {
                laser.update();
            } else {
                lasersActive.splice(i, 1);
                laserPool.push(laser);
            }
        }
        requestAnimationFrame(mainUpdate);
    }

    init();
}

export default konamiCanvas;
