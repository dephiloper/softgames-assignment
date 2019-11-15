/**
 * @author Philipp Bönsch
 * @description The test is split in 3 parts which should be accessed through an in-game menu.
 */

import {UPDATE_FPS_COUNTER, calculateFps, Application, Text} from "../utils.js";

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

    let buttonWidth = 400,
        buttonHeight = 80,
        buttonMargin = 40,
        fontSize = 30;

    if (PIXI.utils.isMobile.any && window.innerHeight > window.innerWidth) {
        buttonWidth *= 1.5;
        buttonHeight *= 1.5;
        buttonMargin *= 1.5;
        fontSize *= 1.5;
    }

    for (let i = 0; i < 3; i++) {
        const graphics = new PIXI.Graphics();
        graphics.interactive = true;
        graphics.buttonMode = true;
        graphics.lineStyle(3, 0x00, 1);
        graphics.beginFill(0xadbc43, 0.5);
        graphics.drawRoundedRect(
            window.innerWidth / 2,
            window.innerHeight / 2 + (i - 1) * (buttonHeight + buttonMargin),
            buttonWidth,
            buttonHeight,
            5
        );
        graphics.pivot.set(buttonWidth / 2, buttonHeight / 2);
        graphics.endFill();
        graphics.on('pointerdown', () => window.location.replace(paths[i]));
        let text = new Text(labels[i], {fontFamily: 'Arial', fontSize: fontSize, fill: 0x000000});
        text.pivot.set(text.width / 2, text.height / 2);
        text.position.set(window.innerWidth / 2, window.innerHeight / 2 + (i - 1) * (buttonHeight + buttonMargin));
        app.stage.addChild(graphics);
        app.stage.addChild(text);
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