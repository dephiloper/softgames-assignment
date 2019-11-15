/**
 * @author Philipp Bönsch
 * @description Create a tool that will allow mixed text and images in an easy way (for example displaying text with
 * emoticons or prices with money icon). It should come up every 2 seconds a random text with images in random
 * configuration (image + text + image, image + image + image, image + image + text, text + image + text etc) and a
 * random font size.
 */

const UPDATE_FPS_COUNTER = 5;
const TEXT_VISIBLE_DURATION_MS = 2000;

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

const app = new Application({width: window.innerWidth, height: window.innerHeight, backgroundColor: 0xB4CDCD});

window.addEventListener("resize", function() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
});

let englishWords = [];
let emojiFileNames = [];

document.body.appendChild(app.view);

fetch('res/english_words_10000.txt')
    .then(response => response.text())
    .then(text => {
        englishWords = textToList(text, 200)
    });

fetch('res/openmoji-list.txt')
    .then(response => response.text())
    .then(text => {
        emojiFileNames = textToList(text, 50);
        loader.add([emojiFileNames, "../res/1F519.png"]).load(setup);
    });

let fpsCounter = new Text("FPS: ", {fontFamily: 'Arial', fontSize: 20, fill: 0xff1010});
let container = new Container();

function setup() {
    app.stage.addChild(fpsCounter);

    refillContainer(container,2, 10, 10);
    container.position.x = randomValue(0, window.innerWidth - container.width, 40);
    container.position.y = randomValue(0, window.innerHeight - container.height, 40);
    app.stage.addChild(container);

    createBackButton(app.stage);

    app.ticker.add(delta => gameLoop(delta));
}

let frameCount = 0;
let changeTextTime = 0;

function gameLoop(delta) {
    frameCount++;
    changeTextTime += delta / PIXI.settings.TARGET_FPMS;

    if (englishWords.length > 0 && emojiFileNames.length > 0) {

        if (changeTextTime >= TEXT_VISIBLE_DURATION_MS) {
            refillContainer(container,2, 10, 10);
            container.position.x = randomValue(0, window.innerWidth - container.width, 40);
            container.position.y = randomValue(0, window.innerHeight - container.height, 40);
            changeTextTime = 0;
        }
    }

    // every n frames update fps counter
    if (frameCount % UPDATE_FPS_COUNTER) {
        const fps = calculateFps(delta);
        fpsCounter.text = "FPS: " + fps.toFixed(2);
    }

}

function textToList(text, amount) {
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

function calculateFps(delta) {
    return 1000 / (delta / PIXI.settings.TARGET_FPMS);
}

function refillContainer(container, minElementCount, maxElementCount, margin) {
    let elementCount = Math.floor(Math.random() * (maxElementCount - minElementCount)) + minElementCount;
    while(container.children[0]) {
        container.removeChild(container.children[0]);
    }

    let lastElement = null;
    for (let i = 0; i < elementCount; i++) {
        let element;

        // either create sprite or text both with a probability of 0.5
        if (Math.random() > 0.5) {
            element = new Sprite(resources[emojiFileNames[Math.floor(Math.random() * emojiFileNames.length)]].texture);
            element.scale.set(0.8, 0.8);
        } else {
            element = new Text(englishWords[Math.floor(Math.random() * englishWords.length)]);
            element.style.fontSize = 10 + Math.floor(Math.random() * 20);
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

function randomValue(min, max, bounds) {
    console.assert(min < max);
    min = min + bounds;
    max = max - bounds;
    return min + Math.floor(Math.random() * (max - min));
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