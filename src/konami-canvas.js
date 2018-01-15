
function konamiCanvas(props) {
    // Variables
    let canvas;
    let context;
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
    let laserVelocity = 35;
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
        context = canvas.getContext('2d');
        canvas.classList.add('konami-canvas');
        canvas.fillStyle = '#000';
        document.body.appendChild(canvas);
        window.addEventListener('mousedown', shootLaser);
    }

    function debounce(event, callback) {
        let timeoutId = null;
        let timeoutInt = 500;

        if (timeoutId) {
            window.clearTimeout(timeoutId);
        }

        timeoutId = window.setTimeout(callback, timeoutInt);
    }

    function laser(e) {
        this.fill = 'green';
        this.pos = {
            dx: e.clientX || e.touches[0].clientX,
            dy: e.clientY || e.touches[0].clientY,
            x: 0,
            y: 0,
        }

        this.create = function() {
            // Determine at random which window side & location for laser origin
            let side = Math.floor(Math.random() * Math.floor(4));

            switch(side) {
                case 0: {
                    // Window top
                    this.pos.y = 0;
                    this.pos.x = Math.floor(Math.random() * Math.floor(wX));
                    break;
                }
                case 1: {
                    // Window right
                    this.pos.y = Math.floor(Math.random() * Math.floor(wY));
                    this.pos.x = wX;
                    break;
                }
                case 2: {
                    // Window bottom
                    this.pos.x = Math.floor(Math.random() * Math.floor(wX));
                    this.pos.y = wY;
                    break;
                }
                case 3: {
                    // Window left
                    this.pos.x = 0;
                    this.pos.y = Math.floor(Math.random() * Math.floor(wY));
                    break;
                }
            }

            this.angle = pointsToDegrees({ x: this.pos.x, y: this.pos.y }, { x: this.pos.dx, y: this.pos.dy });
            this.dist = Math.sqrt(Math.pow(this.pos.dx - this.pos.x, 2) + Math.pow(this.pos.dy - this.pos.y, 2));
            this.life = Math.ceil(this.dist / laserVelocity); // how long to keep alive

            // Red
            context.save();
            context.fillStyle = 'red';
            context.beginPath();
            context.arc(Math.floor(this.pos.x), Math.floor(this.pos.y), 35, 0, Math.PI * 2);
            context.fill();
            context.restore();
        }

        this.draw = function() {
            context.save();
            context.fillStyle = this.fill;
            context.beginPath();
            context.arc(Math.floor(this.pos.x), Math.floor(this.pos.y), 35, 0, Math.PI * 2);
            context.fill();
            context.restore();
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
        }

        this.move = function() {
            this.life -= 1;
            this.pos.x += Math.floor((laserVelocity * Math.cos(this.angle * Math.PI / 180)));
            this.pos.y += Math.floor((laserVelocity * Math.sin(this.angle * Math.PI / 180)));
        }

        this.update = function() {
            this.draw();
            this.move();
        }

        this.create();
        this.playAudio();
        laserPool.push(this);
    }

    function resize() {
        window.addEventListener('resize', e => debounce(e, resize));
        canvas.width = window.innerWidth * pixelDensity;
        canvas.height = window.innerHeight * pixelDensity;
        halfH = canvas.height / 2;
        halfW = canvas.width / 2;
    }

    function shootLaser(e) {
        new laser(e);
    }

    function pointsToDegrees(p1, p2) {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
    }

    function pointsToRadians(p1, p2) {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    }

    function mainUpdate() {
        context.fillStyle = 'transparent';
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillRect(0, 0, canvas.width, canvas.height);
        laserPool.forEach((laser, i) => laser.life >= 0 ? laser.update() : laserPool.splice(i, 1));
        requestAnimationFrame(mainUpdate);
    }

    init();
}

export default konamiCanvas;
