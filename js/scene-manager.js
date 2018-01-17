let canvas;
let ctx;
let wX = window.innerWidth;
let wY = window.innerHeight;

function sceneManager(props) {
    let explosions = {
        alive: [],
        pool: []
    }
    let lasers = {
        alive: [],
        pool: []
    }
    // let pixelDensity = window.devicePixelRatio;
    let pixelDensity = 1;

    function init() {
        document.addEventListener('keyup', Konami.code(onKonamiCodeSuccess));
        window.addEventListener('resize', e => debounce(e, resize, 100));
    }

    function onKonamiCodeSuccess() {
        createCanvas();
        resize();

        setTimeout(() => lasers.alive.push(new Laser().create(wX / 2,  wY / 2)), 10);

        requestAnimationFrame(mainUpdate);
    }

    function createCanvas() {
        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
        canvas.classList.add('konami-canvas');
        document.body.appendChild(canvas);
        window.addEventListener('mousedown', shootLaser);
    }

    function resize() {
        wX = window.innerWidth * pixelDensity;
        wY = window.innerHeight * pixelDensity;
        canvas.width = wX;
        canvas.height = wY;
    }

    function shootLaser(e) {
        // let x = e.clientX || e.touches[0].clientX || 0;
        // let y = e.clientY || e.touches[0].clientY || 0;
        let x = e.clientX;
        let y = e.clientY;

        if (lasers.pool.length > 0) {
            lasers.alive.push(lasers.pool.pop().create(x, y));
        } else {
            lasers.alive.push(new Laser().create(x, y));
        }
    }

    function mainUpdate(ms) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Lasers
        for (let i = 0; i < lasers.alive.length; i++) {
            if (lasers.alive[i].alive) {
                lasers.alive[i].update();
            } else {
                if (explosions.pool.length > 0) {
                    explosions.alive.push(explosions.pool.pop().create(lasers.alive[i].pos.x, lasers.alive[i].pos.y))
                } else {
                    explosions.alive.push(new Explosion().create(lasers.alive[i].pos.x, lasers.alive[i].pos.y));
                }
                lasers.pool.push(lasers.alive[i]);
                lasers.alive.splice(i, 1);
            }
        }

        // Explosions
        for (let i = 0; i < explosions.alive.length; i++) {
            if (explosions.alive[i].alive) {
                explosions.alive[i].update();
            } else {
                explosions.pool.push(explosions.alive[i]);
                explosions.alive.splice(i, 1);
            }
        }

        requestAnimationFrame(mainUpdate);
    }

    init();
    // onKonamiCodeSuccess();
}

function debounce(event, callback, ms) {
    let timeoutId = null;

    if (timeoutId) {
        window.clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(callback, ms);
}

function pointsToDegrees(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
}

function pointsToRadians(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

sceneManager();
