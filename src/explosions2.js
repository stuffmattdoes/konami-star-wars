function Explosions() {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    const minSize = 10;
    const maxSize = 35;
    const clickAmount = 40;
    const colors = [
        '#FF637D',
        '#FF6666',
        '#53D68E',
        '#807EE5',
        '#23CAEF',
    ];
    // const backgroundColor = '#FCF0D6';
    const backgroundColor = 'transparent';
    const pixelDensity = window.devicePixelRatio;

    let mouseDown = false;
    let mouseMoved = false;
    let mousePosition;
    let particles = [];
    let raf;

    init();

    function init() {
        canvas.width = window.innerWidth * pixelDensity;
        canvas.height = window.innerHeight * pixelDensity;

        document.addEventListener('mousedown', (e) => {
            clickEffect(e);
            mouseDown = true;
            mousePosition = {
                x: e.clientX || e.touches[0].clientX,
                y: e.clientY || e.touches[0].clientY
            }
            mouseMoved = false;
        });
        document.addEventListener('mouseup', (e) => {
            mouseDown = false;
            mouseMoved = false;
        });
        // document.addEventListener('mousemove', function(e) {
        //     mousePosition = {
        //         x: e.clientX || e.touches[0].clientX,
        //         y: e.clientY || e.touches[0].clientY
        //     }
        //     mouseMoved = true;
        // });
        document.addEventListener('touchstart', function(e) {
            mouseDown = true;
            mouseMoved = false;
            mousePosition = {
                x: e.clientX || e.touches[0].clientX,
                y: e.clientY || e.touches[0].clientY
            };
            window.navigator.vibrate(5);
        });
        document.addEventListener('touchend', function(e) {
            mouseDown = false;
            mouseMoved = false;
        });
        // document.addEventListener('touchmove', function(e) {
        //     mousePosition = {
        //         x: e.clientX || e.touches[0].clientX,
        //         y: e.clientY || e.touches[0].clientY
        //     }
        //     mouseMoved = true;
        // });

        raf = requestAnimationFrame(drawLoop);
    }

    function drawLoop() {
        raf = requestAnimationFrame(drawLoop);
        context.fillStyle = backgroundColor;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillRect(0, 0, canvas.width, canvas.height);
        var indexesToRemove = [];
        for(var i = 0; i < particles.length; i++) {
            if(particles[i].alive) {
                particles[i].draw();
                particles[i].update();
            } else {
                indexesToRemove.push(i);
            }
        }

        if(indexesToRemove.length) {
            for(var i = 0; i < indexesToRemove.length; i++) {
                particles.splice(indexesToRemove[i], 1);
            }
        }

        if(mouseDown && mouseMoved) {
            particles.push(new Particle(mousePosition.x * pixelDensity, mousePosition.y * pixelDensity));
        }
    }

    function clickEffect(e) {
        let clickedX = e.clientX || e.touches[0].clientX;
        let clickedY = e.clientY || e.touches[0].clientY;
        clickedX *= pixelDensity;
        clickedY *= pixelDensity;

        for (var i = 0; i < clickAmount; i++) {
            particles.push(new Particle(clickedX, clickedY));
        }
    }

    function Particle(x, y) {
        this.x = x;
        this.y = y;
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

        this.draw = function() {
            context.save();
            context.globalAlpha = this.alpha;
            context.fillStyle = this.fill;
            if(this.shape === 'circle') {
                context.beginPath();
                context.arc(Math.floor(this.x),Math.floor(this.y),this.size,0,2*Math.PI);
            } else if(this.shape === 'square') {
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
        }

        this.update = function() {
            this.x += Math.floor((this.velocity * Math.cos(this.angle * Math.PI / 180)) * 2.5);
            this.y += Math.floor((this.velocity * Math.sin(this.angle * Math.PI / 180)) * 2.5);
            this.size -= 0.75 * pixelDensity;
            if(this.velocity <= 1) {
                this.alpha -= 0.1;
                if(this.alpha <= 0) {
                    this.alpha = 0;
                }
            }
            this.angle += 1;
            this.velocity -= 0.3 * pixelDensity;
            if(this.size <= 0) {
                this.size = 0;
            }
        }

    }

    function resize() {
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
    }

    function debounce(event) {
        this.timeoutId = null;

        if(debounce.timeoutId) {
            window.clearTimeout(debounce.timeoutId);
        }

        this.timeoutId = window.setTimeout(resize, 600);
    }

    resize();
    window.addEventListener('resize', debounce);

    for(var i = 0; i < clickAmount; i++) {
        particles.push(new Particle(canvas.width / 2, canvas.height / 2));
    }
}

export default Explosions;
