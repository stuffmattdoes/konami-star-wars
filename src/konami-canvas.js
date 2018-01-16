import Explosion from './explosion';
import Laser from './laser';

function konamiCanvas(props) {
    // Variables
    let canvas;
    let ctx;
    let explosions = {
        active: [],
        pool: []
    }
    let lasers = {
        active: [],
        pool: []
    }
    let pixelDensity = window.devicePixelRatio;

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

    function resize() {
        window.addEventListener('resize', e => debounce(e, resize, 500));
        canvas.width = window.innerWidth * pixelDensity;
        canvas.height = window.innerHeight * pixelDensity;
    }

    function shootLaser(e) {
        // let x = e.clientX || e.touches[0].clientX || 0;
        // let y = e.clientY || e.touches[0].clientY || 0;
        let x = e.clientX;
        let y = e.clientY;

        if (lasers.pool.length > 0) {
            lasers.active.push(lasers.pool.pop().create(x, y));
        } else {
            lasers.active.push(new Laser(ctx).create(x, y));
        }
    }

    function mainUpdate() {
        ctx.fillStyle = 'transparent';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Lasers
        let laser;
        for (let i = 0; i < lasers.active.length; i++) {
            laser = lasers.active[i];

            if (laser.life > 0) {
                laser.update();
            } else {
                if (explosions.pool.length > 0) {
                    explosions.active.push(explosions.pool.pop().create(lasers.active[i].pos.x, lasers.active[i].pos.y))
                } else {
                    explosions.active.push(new Explosion(ctx).create(lasers.active[i].pos.x, lasers.active[i].pos.y));
                }
                lasers.active.splice(i, 1);
                lasers.pool.push(laser);
            }
        }

        // Explosions
        let explosion;
        for (let i = 0; i < explosions.active.length; i++) {
            explosion = explosions.active[i];

            if (explosion.life > 0) {
                explosion.update();
            } else {
                explosions.active.splice(i, 1);
                explosions.pool.push(explosion);
            }

        }

        requestAnimationFrame(mainUpdate);
    }

    init();
}

export default konamiCanvas;
