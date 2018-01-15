/*************************************************************************************
 * Called from boilerplate code and is debounced by 100ms
 * Creates all the images used in the demo.
 ************************************************************************************/
var onResize = function(){
    // create a background as drawable image
    background = imageTools.createImage(canvas.width,canvas.height);
    // create tile image
    tile = imageTools.createImage(64,64);
    tile.ctx.fillStyle = imageTools.createGradient(ctx,"linear",0,0,64,64,["#555","#666"]);
    tile.ctx.fillRect(0,0,64,64);
    tile.ctx.fillStyle = "#333"; // add colour
    tile.ctx.globalCompositeOperation = "lighter";
    tile.ctx.fillRect(0,0,62,2);
    tile.ctx.fillRect(0,0,2,62);
    tile.ctx.fillStyle = "#AAA"; // multiply colour to darken
    tile.ctx.globalCompositeOperation = "multiply";
    tile.ctx.fillRect(62,1,2,62);
    tile.ctx.fillRect(1,62,62,2);
    for(var y = -32; y < canvas.height; y += 64 ){
        for(var x = -32; x < canvas.width; x += 64 ){
            background.ctx.drawImage(tile,x,y);
        }
    }
    background.ctx.globalCompositeOperation = "multiply"; // setup for rendering burn marks

    burn = imageTools.createImage(flashSize/2,flashSize/2);
    burn.ctx.fillStyle = imageTools.createGradient(ctx,"radial",flashSize/4,flashSize/4,0,flashSize/4,["#444","#444","#333","#000","#0000"]);
    burn.ctx.fillRect(0,0,flashSize/2,flashSize/2);


    glowRed = imageTools.createImage(flashSize,flashSize);
    glowRed.ctx.fillStyle = imageTools.createGradient(ctx,"radial",flashSize/2,flashSize/2,0,flashSize/2,["#855F","#8000"]);
                                                    // #855F is non standard colour last digit is alpha
                                                    // 8,8 is ceneter 0 first radius 8 second
    glowRed.ctx.fillRect(0,0,flashSize,flashSize);

    glowGreen = imageTools.createImage(flashSize,flashSize);
    glowGreen.ctx.fillStyle = imageTools.createGradient(ctx,"radial",flashSize/2,flashSize/2,0,flashSize/2,["#585F","#0600"]);
                                                    // #855F is non standard colour last digit is alpha
                                                    // 8,8 is ceneter 0 first radius 8 second
    glowGreen.ctx.fillRect(0,0,flashSize,flashSize);

    // draw the laser
    laserLen = 32;
    laserWidth = 4;
    laserRed = imageTools.createImage(laserLen,laserWidth);
    laserGreen = imageTools.createImage(laserLen,laserWidth);
    laserRed.ctx.lineCap = laserGreen.ctx.lineCap = "round";
    laserRed.ctx.lineWidth = laserGreen.ctx.lineWidth = laserWidth;
    laserRed.ctx.strokeStyle = "#F33";
    laserGreen.ctx.strokeStyle = "#3F3";
    laserRed.ctx.beginPath();
    laserGreen.ctx.beginPath();
    laserRed.ctx.moveTo(laserWidth/2 + 1,laserWidth/2);
    laserGreen.ctx.moveTo(laserWidth/2 + 1,laserWidth/2);
    laserRed.ctx.lineTo(laserLen - (laserWidth/2 + 1),laserWidth/2);
    laserGreen.ctx.lineTo(laserLen - (laserWidth/2 + 1),laserWidth/2);
    laserRed.ctx.stroke();
    laserGreen.ctx.stroke();

    // draw the laser glow FX
    var glowSize = 8;
    laserGRed = imageTools.createImage(laserLen + glowSize * 2,laserWidth + glowSize * 2);
    laserGGreen = imageTools.createImage(laserLen + glowSize * 2,laserWidth + glowSize * 2);
    laserGRed.ctx.lineCap = laserGGreen.ctx.lineCap = "round";
    laserGRed.ctx.shadowBlur = laserGGreen.ctx.shadowBlur = glowSize;
    laserGRed.ctx.shadowColor = "#F33"
    laserGGreen.ctx.shadowColor = "#3F3";
    laserGRed.ctx.lineWidth = laserGGreen.ctx.lineWidth = laserWidth;
    laserGRed.ctx.strokeStyle = "#F33";
    laserGGreen.ctx.strokeStyle = "#3F3";
    laserGRed.ctx.beginPath();
    laserGGreen.ctx.beginPath();
    laserGRed.ctx.moveTo(laserWidth/2 + 1 + glowSize,laserWidth/2 + glowSize);
    laserGGreen.ctx.moveTo(laserWidth/2 + 1 + glowSize,laserWidth/2 + glowSize);
    laserGRed.ctx.lineTo(laserLen + glowSize * 2 - (laserWidth/2 + 1 + glowSize),laserWidth/2 + glowSize);
    laserGGreen.ctx.lineTo(laserLen + glowSize * 2 - (laserWidth/2 + 1 + glowSize),laserWidth/2 + glowSize);
    laserGRed.ctx.stroke();
    laserGGreen.ctx.stroke();

    readyToRock = true;

}
var flashSize = 16;
const flashBrightNorm = 4 * (flashSize/2) * (flashSize/2) * Math.PI; // area of the flash
var background,tile,glowRed,glowGreen,grad, laserGreen,laserRed,laserGGreen,laserGRed,readyToRock,burn;
readyToRock = false;

/*************************************************************************************
 * create or reset a bullet
 ************************************************************************************/
function createShot(x,y,xx,yy,speed,type,bullet){ // create a bullet object
    if(bullet === undefined){
        bullet = {};
    }
    var nx = xx-x; // normalise
    var ny = yy-y;
    var dist = Math.sqrt(nx*nx+ny*ny);
    nx /= dist;
    ny /= dist;
    bullet.x = x;
    bullet.y = y;
    bullet.speed = speed;
    bullet.type = type;
    bullet.xx = xx;
    bullet.yy = yy;
    bullet.nx = nx; // normalised vector
    bullet.ny = ny;
    bullet.rot =  Math.atan2(ny,nx); // will draw rotated so get the rotation
    bullet.life = Math.ceil(dist/speed); // how long to keep alive

    return bullet;
}
// semi static array with object pool.
var bullets=[]; // array of bullets
var bulletPool=[]; // array of used bullets. Use to create new bullets this stops GC messing with frame rate
const BULLET_TYPES = {
    red : 0,
    green : 1,
}
/*************************************************************************************
 * Add a bullet to the bullet array
 ************************************************************************************/
function addBullet(xx,yy,type){
    var bullet,x,y;
    if(bulletPool.length > 0){
        bullet = bulletPool.pop(); // get bullet from pool
    }
    if(type === BULLET_TYPES.red){
        x = canvas.width + 16 + 32 * Math.random();
        y = Math.random() * canvas.height;
    }else if(type === BULLET_TYPES.green){
        x = - 16 - 32 * Math.random();
        y = Math.random() * canvas.height;
    }
    // randomise shoot to position
    var r = Math.random() * Math.PI * 2;
    var d = Math.random() * 128 + 16;
    xx += Math.cos(r)* d;
    yy += Math.sin(r)* d;
    bullets[bullets.length] = createShot(x,y,xx,yy,16,type,bullet);

}
/*************************************************************************************
 * update and draw bullets
 ************************************************************************************/
function updateDrawAllBullets(){
    var i,img,imgGlow;
    for(i = 0; i < bullets.length; i++){
        var b = bullets[i];
        b.life -= 1;
        if(b.life <= 0){ // bullet end remove it and put it in the pool
            bulletPool[bulletPool.length] = bullets.splice(i,1)[0];
            i--; // to stop from skipping a bullet
        }else{

            if(b.life < 5){
                if(b.life===4){
                    b.x += b.nx * b.speed * 0.5;  // set to front of laser
                    b.y += b.ny * b.speed * 0.5;
                    var scale = 0.9 + Math.random() *1;
                    background.ctx.setTransform(scale,0,0,scale,b.x,b.y);
                    background.ctx.globalAlpha = 0.1 + Math.random() *0.2;;
                    background.ctx.drawImage(burn,-burn.width /2 ,-burn.height/2);
                }
                if(b.type === BULLET_TYPES.red){
                    img = glowRed;
                }else{
                    img = glowGreen;
                }
                ctx.globalCompositeOperation = "lighter";
                imageTools.drawImage(img,b.x,b.y,(4-b.life)*(4-b.life),b.rot,1);//b.life/4);
                imageTools.drawImage(img,b.x,b.y,4,b.rot,b.life/4);
                ctx.globalCompositeOperation = "source-over";


            }else{
                b.x += b.nx * b.speed;
                b.y += b.ny * b.speed;

                if(b.type === BULLET_TYPES.red){
                    img = laserRed;
                    imgGlow = laserGRed;
                }else{
                    img = laserGreen;
                    imgGlow = laserGGreen;
                }
                ctx.globalCompositeOperation = "lighter";
                imageTools.drawImage(imgGlow,b.x,b.y,1,b.rot,1);
                imageTools.drawImage(imgGlow,b.x,b.y,2,b.rot,Math.random()/2);
                ctx.globalCompositeOperation = "source-over";
                imageTools.drawImage(img,b.x,b.y,1,b.rot,1);
            }
        }
    }


}
/*************************************************************************************
 * Main display loop
 ************************************************************************************/
function display() {
    if(readyToRock){
        ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
        ctx.globalAlpha = 1; // reset alpha
        ctx.drawImage(background,0,0);
        ctx.globalCompositeOperation = "source-over";
        if(mouse.buttonRaw & 1){
            addBullet(mouse.x,mouse.y,BULLET_TYPES.red);
            addBullet(mouse.x,mouse.y,BULLET_TYPES.green);
        }
        updateDrawAllBullets();
    }

}

/*************************************************************************************
 * Tools for creating canvas images and what not
 ************************************************************************************/
var imageTools = (function () {
    // This interface is as is. No warenties no garenties, and NOT to be used comercialy
    var workImg,workImg1,keep; // for internal use
    var xdx,xdy,spr; // static vars for drawImage and drawSprite
    keep = false;
    var tools = {
        canvas : function (width, height) {  // create a blank image (canvas)
            var c = document.createElement("canvas");
            c.width = width;
            c.height = height;
            return c;
        },
        createImage : function (width, height) {
            var i = this.canvas(width, height);
            i.ctx = i.getContext("2d");
            return i;
        },
        drawImage : function(image, x, y, scale, ang, alpha) {
            ctx.globalAlpha = alpha;
            xdx = Math.cos(ang) * scale;
            xdy = Math.sin(ang) * scale;
            ctx.setTransform(xdx, xdy, -xdy, xdx, x, y);
            ctx.drawImage(image, -image.width/2,-image.height/2);
        },
        hex2RGBA : function(hex){ // Not CSS colour as can have extra 2 or 1 chars for alpha
                                  // #FFFF & #FFFFFFFF last F and FF are the alpha range 0-F & 00-FF
            if(typeof hex === "string"){
                var str = "rgba(";
                if(hex.length === 4 || hex.length === 5){
                    str += (parseInt(hex.substr(1,1),16) * 16) + ",";
                    str += (parseInt(hex.substr(2,1),16) * 16) + ",";
                    str += (parseInt(hex.substr(3,1),16) * 16) + ",";
                    if(hex.length === 5){
                        str += (parseInt(hex.substr(4,1),16) / 16);
                    }else{
                        str += "1";
                    }
                    return str + ")";
                }
                if(hex.length === 7 || hex.length === 8){
                    str += parseInt(hex.substr(1,2),16) + ",";
                    str += parseInt(hex.substr(3,2),16) + ",";
                    str += parseInt(hex.substr(5,2),16) + ",";
                    if(hex.length === 5){
                        str += (parseInt(hex.substr(7,2),16) / 255).toFixed(3);
                    }else{
                        str += "1";
                    }
                    return str + ")";
                }
                return "rgba(0,0,0,0)";
            }
        },
        createGradient : function(ctx, type, x, y, xx, yy, colours){ // Colours MUST be array of hex colours NOT CSS colours
                                                                     // See this.hex2RGBA for details of format
            var i,g,c;
            var len = colours.length;
            if(type.toLowerCase() === "linear"){
                g = ctx.createLinearGradient(x,y,xx,yy);
            }else{
                g = ctx.createRadialGradient(x,y,xx,x,y,yy);
            }
            for(i = 0; i < len; i++){
                c = colours[i];
                if(typeof c === "string"){
                    if(c[0] === "#"){
                        c = this.hex2RGBA(c);
                    }
                    g.addColorStop(Math.min(1,i / (len -1)),c); // need to clamp top to 1 due to floating point errors causes addColorStop to throw rangeError when number over 1
                }
            }
            return g;

        },
    };
    return tools;
})();



// CODE FROM HERE DOWN IS SUPPORT CODE AN HAS LITTLE TO DO WITH THE ANSWER




//==================================================================================================
// The following code is support code that provides me with a standard interface to various forums.
// It provides a mouse interface, a full screen canvas, and some global often used variable
// like canvas, ctx, mouse, w, h (width and height), globalTime
// This code is not intended to be part of the answer unless specified and has been formated to reduce
// display size. It should not be used as an example of how to write a canvas interface.
// By Blindman67
if(typeof onResize === "undefined"){
    window["onResize"] = undefined;  // create without the JS parser knowing it exists.
                                     // this allows for it to be declared in an outside
                                     // modal.
}
const RESIZE_DEBOUNCE_TIME = 100;
var w, h, cw, ch, canvas, ctx, mouse, createCanvas, resizeCanvas, setGlobals, globalTime = 0, resizeCount = 0;
createCanvas = function () {
    var c,
    cs;
    cs = (c = document.createElement("canvas")).style;
    cs.position = "absolute";
    cs.top = cs.left = "0px";
    cs.zIndex = 1000;
    document.body.appendChild(c);
    return c;
}
resizeCanvas = function () {
    if (canvas === undefined) {
        canvas = createCanvas();
    }
    canvas.width = window.innerWidth-2;
    canvas.height = window.innerHeight-2;
    ctx = canvas.getContext("2d");
    if (typeof setGlobals === "function") {
        setGlobals();
    }
    if (typeof onResize === "function") {
        resizeCount += 1;
        setTimeout(debounceResize, RESIZE_DEBOUNCE_TIME);
    }
}
function debounceResize() {
    resizeCount -= 1;
    if (resizeCount <= 0) {
        onResize();
    }
}
setGlobals = function () {
    cw = (w = canvas.width) / 2;
    ch = (h = canvas.height) / 2;
    mouse.updateBounds();
}
mouse = (function () {
    function preventDefault(e) {
        e.preventDefault();
    }
    var mouse = {
        x : 0,
        y : 0,
        w : 0,
        alt : false,
        shift : false,
        ctrl : false,
        buttonRaw : 0,
        over : false,
        bm : [1, 2, 4, 6, 5, 3],
        active : false,
        bounds : null,
        crashRecover : null,
        mouseEvents : "mousemove,mousedown,mouseup,mouseout,mouseover,mousewheel,DOMMouseScroll".split(",")
    };
    var m = mouse;
    function mouseMove(e) {
        var t = e.type;
        m.x = e.clientX - m.bounds.left;
        m.y = e.clientY - m.bounds.top;
        m.alt = e.altKey;
        m.shift = e.shiftKey;
        m.ctrl = e.ctrlKey;
        if (t === "mousedown") {
            m.buttonRaw |= m.bm[e.which - 1];
        } else if (t === "mouseup") {
            m.buttonRaw &= m.bm[e.which + 2];
        } else if (t === "mouseout") {
            m.buttonRaw = 0;
            m.over = false;
        } else if (t === "mouseover") {
            m.over = true;
        } else if (t === "mousewheel") {
            m.w = e.wheelDelta;
        } else if (t === "DOMMouseScroll") {
            m.w = -e.detail;
        }
        if (m.callbacks) {
            m.callbacks.forEach(c => c(e));
        }
        if ((m.buttonRaw & 2) && m.crashRecover !== null) {
            if (typeof m.crashRecover === "function") {
                setTimeout(m.crashRecover, 0);
            }
        }
        e.preventDefault();
    }
    m.updateBounds = function () {
        if (m.active) {
            m.bounds = m.element.getBoundingClientRect();
        }
    }
    m.addCallback = function (callback) {
        if (typeof callback === "function") {
            if (m.callbacks === undefined) {
                m.callbacks = [callback];
            } else {
                m.callbacks.push(callback);
            }
        } else {
            throw new TypeError("mouse.addCallback argument must be a function");
        }
    }
    m.start = function (element, blockContextMenu) {
        if (m.element !== undefined) {
            m.removeMouse();
        }
        m.element = element === undefined ? document : element;
        m.blockContextMenu = blockContextMenu === undefined ? false : blockContextMenu;
        m.mouseEvents.forEach(n => {
            m.element.addEventListener(n, mouseMove);
        });
        if (m.blockContextMenu === true) {
            m.element.addEventListener("contextmenu", preventDefault, false);
        }
        m.active = true;
        m.updateBounds();
    }
    m.remove = function () {
        if (m.element !== undefined) {
            m.mouseEvents.forEach(n => {
                m.element.removeEventListener(n, mouseMove);
            });
            if (m.contextMenuBlocked === true) {
                m.element.removeEventListener("contextmenu", preventDefault);
            }
            m.element = m.callbacks = m.contextMenuBlocked = undefined;
            m.active = false;
        }
    }
    return mouse;
})();

// Clean up. Used where the IDE is on the same page.
var done = function () {
    window.removeEventListener("resize", resizeCanvas)
    mouse.remove();
    document.body.removeChild(canvas);
    canvas = ctx = mouse = undefined;
}

resizeCanvas();
mouse.start(canvas, true);
mouse.crashRecover = done;
window.addEventListener("resize", resizeCanvas);

function update(timer) { // Main update loop
    globalTime = timer;
    display(); // call demo code
    requestAnimationFrame(update);
}
requestAnimationFrame(update);
/** SimpleFullCanvasMouse.js end **/
