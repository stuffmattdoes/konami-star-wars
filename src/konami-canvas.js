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
                new Explosion().create(lasers.active[i].pos.x, lasers.active[i].pos.y);
                lasers.active.splice(i, 1);
                lasers.pool.push(laser);
            }
        }

        // Explosions
        var indexesToRemove = [];
        for(var i = 0; i < explosions.active.length; i++) {
            let explosion = explosions.active[i];

            if (explosion.alive) {
                explosion.update();
            } else {
                indexesToRemove.push(i);
            }
        }

        // if (indexesToRemove.length) {
        //     for(var i = 0; i < indexesToRemove.length; i++) {
        //         particles.splice(indexesToRemove[i], 1);
        //     }
        // }
        //
        // if (mouseDown && mouseMoved) {
        //     particles.push(new Particle(mousePosition.x * pixelDensity, mousePosition.y * pixelDensity));
        // }

        requestAnimationFrame(mainUpdate);
    }

    init();
}

export default konamiCanvas;
