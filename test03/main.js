/*
 * Particles - make a demo that shows an awesome fire effect. Please keep number of images low (max 10 sprites on
 * screen at once). Feel free to use existing libraries how you would use them in a real project.
 */

const UPDATE_FPS_COUNTER = 5;

let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas";
}

//Aliases
const Application = PIXI.Application,
    loader = PIXI.Loader.shared,
    resources = loader.resources,
    Text = PIXI.Text,
    Container = PIXI.Container,
    Sprite = PIXI.Sprite;

const app = new Application({width: window.innerWidth, height: window.innerHeight, backgroundColor: 0x000000});

// Fullscreen in pixi is resizing the renderer to be window.innerWidth by window.innerHeight
// https://codepen.io/iamnotsam/pen/RgeOrK
window.addEventListener("resize", function () {
    app.renderer.resize(window.innerWidth, window.innerHeight);
});

document.body.appendChild(app.view);

loader.add("res/logs.png").load(setup);

const container = new Container();
let emitter = new PIXI.particles.Emitter(
    container,
    ["res/particle.png", "res/fire.png"],
    {
        "alpha": {
            "list": [
                {"value":0.05, "time":0},
                {"value":0.4, "time":0.1},
                {"value":0.3, "time":0.4},
                {"value":0.05, "time":1.5},

            ],
            "isStepped": false
        },
        "scale": {
            "list": [
                {"value":0.5, "time":0},
                {"value":1.0, "time":1.2}
            ],
            "isStepped": false
        },
        "color": {
            "list": [
                {"value":"feef5a", "time":0},
                {"value":"fed62e", "time":0.05},
                {"value":"fecd49", "time":0.1},
                {"value":"f4792c", "time":0.2},
                {"value":"f04c2b", "time":0.4},
                {"value":"ee132a", "time":0.45},
                {"value":"111111", "time":0.5},
                {"value":"333333", "time":1.0},
            ],
            "isStepped": false
        },
        "speed": {
            "list": [
                {"value":150, "time":0},
                {"value":220, "time":1.2},
                {"value":220, "time":1.5},
            ],
            "isStepped": false
        },
        "startRotation": {
            "min": 270,
            "max": 270
        },
        "rotationSpeed": {
            "min": 30,
            "max": 30
        },
        "lifetime": {
            "min": 0.5,
            "max": 1.5
        },
        "blendMode": "normal",
        "frequency": 0.001,
        "emitterLifetime": 0,
        "maxParticles": 700,
        "pos": {
            "x": 0,
            "y": 0
        },
        "addAtBack": false,
        "spawnType": "circle",
        "spawnCircle": {
            "x": 0,
            "y": 0,
            "r": 60
        }
    });


const fpsCounter = new Text("FPS: ", {fontFamily: 'Arial', fontSize: 20, fill: 0xff1010});

function setup() {
    const logsSprite = new Sprite(resources["res/logs.png"].texture);
    logsSprite.anchor.set(0.5, 0.5);
    logsSprite.scale.set(0.6, 0.6);
    app.stage.addChild(fpsCounter);
    app.stage.addChild(logsSprite);
    app.stage.addChild(container);

    logsSprite.position.x = window.innerWidth / 2;
    logsSprite.position.y = window.innerHeight / 2 + 30;

    container.position.x = window.innerWidth / 2;
    container.position.y = window.innerHeight / 2;

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