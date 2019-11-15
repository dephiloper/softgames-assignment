/**
 * @author Philipp Bönsch
 * @description Create 144 sprites (NOT graphics object) that are stacked on each other like cards in a deck (so object
 * above covers bottom one, but not completely). Every second 1 object from top of stack goes to other stack -
 * animation of moving should be 2 seconds long. So at the end of whole process you should have reversed stack. Display
 * number of fps in left top corner and make sure, that this demo runs well on mobile devices.
 */

// so the fps counter is not updated very frame
const UPDATE_FPS_COUNTER = 5;
const SPRITE_COUNT = 144;
const SPRITE_Y_OFFSET = 1.0;
const STACK_POP_DURATION_MS = 1000;
const ANIMATION_DURATION_MS = 2000;

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

const app = new Application({width: window.innerWidth, height: window.innerHeight, backgroundColor: 0xB4CDCD});

// Fullscreen in pixi is resizing the renderer to be window.innerWidth by window.innerHeight
// https://codepen.io/iamnotsam/pen/RgeOrK
window.addEventListener("resize", function() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
});


document.body.appendChild(app.view);
loader.add(["res/white-card.png","../res/1F519.png"]).load(setup);

let fpsCounter = new Text("FPS: ", {fontFamily: 'Arial', fontSize: 20, fill: 0xff1010});

const firstStackGroup = new PIXI.display.Group(0, true);
const secondStackGroup = new PIXI.display.Group(1, true);

let animationSprites = [];

function setup() {
    app.stage = new PIXI.display.Stage();
    app.stage.addChild(fpsCounter);
    app.stage.addChild(new PIXI.display.Layer(firstStackGroup));
    app.stage.addChild(new PIXI.display.Layer(secondStackGroup));

    const texture = resources["res/white-card.png"].texture;
    const firstStackX = window.innerWidth / 2 - texture.width * 2;
    const secondStackX = window.innerWidth / 2 + texture.width * 2;

    for (let i = 0; i < SPRITE_COUNT; i++) {
        let sprite = new Sprite(texture);
        sprite.x = firstStackX;
        sprite.y = window.innerHeight / 1.5 - i * SPRITE_Y_OFFSET;
        sprite.tint = Math.random() * 0xFFFFFF;
        sprite.anchor = {x: 0.5, y: 0.5};

        animationSprites.push(
            {
                sprite: sprite,
                positionStart:
                    {
                        x: sprite.x,
                        y: sprite.y
                    },
                positionEnd:
                    {
                        x: secondStackX,
                        y: window.innerHeight / 1.5 - (SPRITE_COUNT - 1 - i) * SPRITE_Y_OFFSET
                    },
                animationTime: 0.0
            });

        sprite.parentGroup = firstStackGroup;
        app.stage.addChild(sprite);
    }

    createBackButton(app.stage);

    app.ticker.add(delta => gameLoop(delta));
}

let frameCount = 0;
let currentSpriteIndex = 0;
let popSpriteTime = 0;
let activeSprites = [];

function gameLoop(delta) {
    frameCount++;
    popSpriteTime += delta / PIXI.settings.TARGET_FPMS;

    // every second add new sprite as activeSprite, so that it is animated
    if (popSpriteTime >= STACK_POP_DURATION_MS) {
        if (currentSpriteIndex < SPRITE_COUNT) {
            let newActiveSprite = animationSprites[SPRITE_COUNT - currentSpriteIndex - 1];
            newActiveSprite.sprite.parentGroup = secondStackGroup;
            newActiveSprite.sprite.zOrder = currentSpriteIndex;
            activeSprites.push(newActiveSprite);
            popSpriteTime = 0;
            currentSpriteIndex++;
        }
    }

    // move all currently active sprites from their start to end position
    for (let activeSprite of activeSprites) {
        activeSprite.animationTime += delta / PIXI.settings.TARGET_FPMS;

        const fraction = activeSprite.animationTime / ANIMATION_DURATION_MS;
        activeSprite.sprite.x = lerp(activeSprite.positionStart.x, activeSprite.positionEnd.x, fraction);
        activeSprite.sprite.y = lerp(activeSprite.positionStart.y, activeSprite.positionEnd.y, fraction);

        if (activeSprite.sprite.x >= activeSprite.positionEnd.x) {
            activeSprite.sprite.x = activeSprite.positionEnd.x;
            activeSprite.sprite.y = activeSprite.positionEnd.y;
            let indexToRemove = activeSprites.indexOf(activeSprite);
            activeSprites.splice(indexToRemove, indexToRemove + 1);
            activeSprite.animationTime = 0;
        }
    }


    // every n frames update fps counter
    if (frameCount % UPDATE_FPS_COUNTER) {
        const fps = calculateFps(delta);
        fpsCounter.text = "FPS: " + fps.toFixed(2);
    }
}

function calculateFps(delta) {
    return 1000 / (delta / PIXI.settings.TARGET_FPMS);
}

function lerp(a, b, fraction) {
    fraction = fraction < 0 ? 0 : fraction;
    fraction = fraction > 1 ? 1 : fraction;
    return a + (b - a) * fraction;
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