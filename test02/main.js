/**
 * @author Philipp Bönsch
 * @description Create a tool that will allow mixed text and images in an easy way (for example displaying text with
 * emoticons or prices with money icon). It should come up every 2 seconds a random text with images in random
 * configuration (image + text + image, image + image + image, image + image + text, text + image + text etc) and a
 * random font size.
 */

import {
    UPDATE_FPS_COUNTER,
    Application,
    Text,
    Sprite,
    Container,
    resources,
    loader,
    calculateFps,
    createBackButton,
    isMobile
}
    from "../utils.js";

const TEXT_VISIBLE_DURATION_MS = 2000;
const app = new Application({width: window.innerWidth, height: window.innerHeight, backgroundColor: 0xB4CDCD});

window.addEventListener("resize", function () {
    app.renderer.resize(window.innerWidth, window.innerHeight);
});

let englishWords = [];
let emojiFileNames = [];

document.body.appendChild(app.view);

// read random english words from a given file
fetch('res/english_words_10000.txt')
    .then(response => response.text())
    .then(text => {
        englishWords = shuffleReadToList(text, 200)
    });

// get names of random emojis and load them into the app
fetch('res/openmoji-list.txt')
    .then(response => response.text())
    .then(text => {
        emojiFileNames = shuffleReadToList(text, 50);
        loader.add([emojiFileNames, "../res/1F519.png"]).load(setup);
    });

let fpsCounter = new Text("FPS: ", {fontFamily: 'Arial', fontSize: 20, fill: 0xff1010});
let configContainer = new Container();
function setup() {
    app.stage.addChild(fpsCounter);
    refillContainer(configContainer, 2, 8, 10);
    configContainer.position.x = randomValue(0, window.innerWidth - configContainer.width, 60);
    configContainer.position.y = randomValue(0, window.innerHeight - configContainer.height, 60);
    app.stage.addChild(configContainer);

    createBackButton(app.stage);

    app.ticker.add(delta => gameLoop(delta));
}

let frameCount = 0;
let changeConfigurationTime = 0;
function gameLoop(delta) {
    frameCount++;
    changeConfigurationTime += delta / PIXI.settings.TARGET_FPMS;

    // change configuration after defined time
    if (changeConfigurationTime >= TEXT_VISIBLE_DURATION_MS) {
        refillContainer(configContainer, 2, 10, 10);
        configContainer.position.x = randomValue(0, window.innerWidth - configContainer.width, 40);
        configContainer.position.y = randomValue(0, window.innerHeight - configContainer.height, 40);
        changeConfigurationTime = 0;
    }

    // every n frames update fps counter
    if (frameCount % UPDATE_FPS_COUNTER) {
        const fps = calculateFps(delta);
        fpsCounter.text = "FPS: " + fps.toFixed(2);
    }
}

/**
 * Reads given amount of random lines into an list.
 * @param text multiline text
 * @param amount max boundary for the amount of lines
 * @returns {[]} list of n random lines
 */
function shuffleReadToList(text, amount) {
    const lines = text.split(/\r\n|\n/);
    let list = [];
    for (let i = 0; i < amount; i++) {
        let randomLine = lines[Math.floor(Math.random() * lines.length)];
        if (list.indexOf(randomLine) === -1) {
            list.push(randomLine);
        } else {
            i--;
        }
    }

    return list;
}

/**
 * Creating configuration with random amount of images and texts in random order.
 * @param container object to refill
 * @param minElementCount min count of elements stacked in horizontal order
 * @param maxElementCount min count of elements stacked in horizontal order
 * @param margin width between single objects
 */
function refillContainer(container, minElementCount, maxElementCount, margin) {
    let elementScale = 0.8,
        minFontSize = 16,
        maxFontSize = 36;

    if (isMobile()) {
        elementScale = 1;
        minFontSize *= 1.5;
        maxFontSize *= 1.5;
        maxElementCount = maxElementCount > 5 ? 5 : maxElementCount;
    }

    let elementCount = Math.floor(Math.random() * (maxElementCount - minElementCount)) + minElementCount;
    while (container.children[0]) {
        container.removeChild(container.children[0]);
    }

    let lastElement = null;
    for (let i = 0; i < elementCount; i++) {
        let element;

        // either create sprite or text both with a probability of 0.5
        if (Math.random() > 0.5) {
            element = new Sprite(resources[emojiFileNames[Math.floor(Math.random() * emojiFileNames.length)]].texture);
            element.scale.set(elementScale, elementScale);
        } else {
            element = new Text(englishWords[Math.floor(Math.random() * englishWords.length)]);
            element.style.fontSize = minFontSize + Math.floor(Math.random() * (maxFontSize - minFontSize));
        }

        // set the anchor of the element to the center of the element
        element.anchor.set(0.5, 0.5);

        if (lastElement !== null) {
            /**
             *        |-----||------||---|
             * [last element](margin)[element]
             */
            element.x = lastElement.x + lastElement.width / 2 + margin + element.width / 2;
        }

        container.addChild(element);
        lastElement = element;
    }
}

/**
 * Generated random value between two given values.
 * @param min boundary min value
 * @param max boundary max value
 * @param bounds additional bounds added to the given min and max
 * @returns {*} random value
 */
function randomValue(min, max, bounds) {
    console.assert(min < max);
    min = min + bounds;
    max = max - bounds;
    return min + Math.floor(Math.random() * (max - min));
}