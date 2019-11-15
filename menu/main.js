/**
 * @author Philipp Bönsch
 * @description The test is split in 3 parts which should be accessed through an in-game menu.
 */

import * as PIXI from "pixi.js";

// so the fps counter is not updated very frame
const UPDATE_FPS_COUNTER = 5;

let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas";
}

PIXI.utils.sayHello(type);

//Aliases
const Application = PIXI.Application,
    Text = PIXI.Text;

const app = new Application({width: window.innerWidth, height: window.innerHeight, backgroundColor: 0xB4CDCD});

window.addEventListener("resize", function () {
    app.renderer.resize(window.innerWidth, window.innerHeight);
});

document.body.appendChild(app.view);

let fpsCounter = new Text("FPS: ", {fontFamily: 'Arial', fontSize: 20, fill: 0xff1010});
setup();

function setup() {
    app.stage.addChild(fpsCounter);

    const labels = ["Stacking sprites", "Mixed text and images", "Particles"];
    const paths = ["../test01", "../test02", "../test03"];

    for (let i = 0; i < 3; i++) {
        const graphics = new PIXI.Graphics();
        graphics.interactive = true;
        graphics.lineStyle(3, 0x00, 1);
        graphics.beginFill(0xadbc43, 0.5);
        graphics.drawRoundedRect(window.innerWidth / 2, window.innerHeight / 2 + (i-1) * 120, 400, 80, 5);
        graphics.pivot.set(200, 40);
        graphics.endFill();
        graphics.on('pointerdown', () => window.location.replace(paths[i]));
        let text = new Text(labels[i], {fontFamily: 'Arial', fontSize: 30, fill: 0x000000});
        text.pivot.set(text.width/2, text.height/2);
        text.position.set(window.innerWidth / 2, window.innerHeight / 2 + (i-1) * 120);
        app.stage.addChild(text);
        app.stage.addChild(graphics);
    }

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