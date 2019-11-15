/**
 * @author Philipp Bönsch
 * @description Particles - make a demo that shows an awesome fire effect. Please keep number of images low (max 10
 * sprites on screen at once). Feel free to use existing libraries how you would use them in a real project.
 */

const UPDATE_FPS_COUNTER = 5;

let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas";
}

PIXI.utils.sayHello(type);

//Aliases
const Application = PIXI.Application,
    loader = PIXI.Loader.shared,
    resources = loader.resources,
    Text = PIXI.Text,
    Container = PIXI.Container,
    Sprite = PIXI.Sprite;

const app = new Application({width: window.innerWidth, height: window.innerHeight, backgroundColor: 0x000000});
let emitterConfig = null;

window.addEventListener("resize", function () {
    app.renderer.resize(window.innerWidth, window.innerHeight);
});

document.body.appendChild(app.view);


fetch('res/particle-emitter-config.json')
    .then(response => response.json())
    .then(json => {
        emitterConfig = json;
        loader.add(["res/logs.png", "../res/1F519.png"]).load(setup);
    });

const container = new Container();
const fpsCounter = new Text("FPS: ", {fontFamily: 'Arial', fontSize: 20, fill: 0xff1010});
let emitter;
let setupCalled = false;

function setup() {
    setupCalled = true;
    const logsSprite = new Sprite(resources["res/logs.png"].texture);
    logsSprite.anchor.set(0.5, 0.5);
    logsSprite.scale.set(0.6, 0.6);

    emitter = new PIXI.particles.Emitter(
        container,
        ["res/particle.png", "res/fire.png"],
        emitterConfig);

    app.stage.addChild(fpsCounter);
    app.stage.addChild(logsSprite);
    app.stage.addChild(container);

    logsSprite.position.x = window.innerWidth / 2;
    logsSprite.position.y = window.innerHeight / 2 + 30;

    container.position.x = window.innerWidth / 2;
    container.position.y = window.innerHeight / 2;

    createBackButton(app.stage);

    app.ticker.add(delta => gameLoop(delta));
    emitter.emit = true;
}

let frameCount = 0;


let elapsed = Date.now();
function gameLoop(delta) {
    frameCount++;

    let now = Date.now();
    emitter.update((now - elapsed) * 0.001);
    elapsed = now;

    // every n frames update fps counter
    if (frameCount % UPDATE_FPS_COUNTER) {
        const fps = calculateFps(delta);
        fpsCounter.text = "FPS: " + fps.toFixed(2);
    }
}

function calculateFps(delta) {
    return 1000 / (delta / PIXI.settings.TARGET_FPMS);
}

function createBackButton(stage) {
    const graphics = new PIXI.Graphics();
    const backSprite = new Sprite(resources["../res/1F519.png"].texture);
    graphics.interactive = true;
    graphics.beginFill(0xffffff, 1);
    graphics.drawCircle(window.innerWidth - 60, 60, 30);
    graphics.endFill();
    graphics.on('pointerdown', () => window.location.replace("../menu"));
    backSprite.position.set(window.innerWidth - 60, 60);
    backSprite.anchor.set(0.5, 0.5);
    stage.addChild(graphics);
    stage.addChild(backSprite);
}