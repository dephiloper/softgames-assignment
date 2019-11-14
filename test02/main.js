/*
 * Create a tool that will allow mixed text and images in an easy way (for example displaying text with emoticons or
 * prices with money icon). It should come up every 2 seconds a random text with images in random configuration
 * (image + text + image, image + image + image, image + image + text, text + image + text etc) and a random font size.
 */

const APP_WIDTH = 800;
const APP_HEIGHT = 600;
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
    Sprite = PIXI.Sprite;

const app = new Application({width: APP_WIDTH, height: APP_HEIGHT, backgroundColor: 0xB4CDCD});

document.body.appendChild(app.view);
// loader.add("res/white-card.png").load(setup);

let fpsCounter = new Text("FPS: ", {fontFamily: 'Arial', fontSize: 20, fill: 0xff1010});

function setup() {
    app.stage = new PIXI.display.Stage();
    app.stage.addChild(fpsCounter);
    app.ticker.add(delta => gameLoop(delta));
}

let frameCount = 0;
function gameLoop(delta) {
    frameCount++;

    // every n frames update fps counter
    if (frameCount % UPDATE_FPS_COUNTER) {
        const fps = calculateFps(delta);
        fpsCounter.text = "FPS: " + fps.toFixed(2);
    }
}

function calculateFps(delta) {
    return 1000 / (delta / PIXI.settings.TARGET_FPMS);
}