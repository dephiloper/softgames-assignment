// Aliases
export const Application = PIXI.Application,
    loader = PIXI.Loader.shared,
    resources = loader.resources,
    Text = PIXI.Text,
    Container = PIXI.Container,
    Sprite = PIXI.Sprite;

// so the fps counter is not updated very frame
export const UPDATE_FPS_COUNTER = 5;

// creates a back button on the defined page
export function createBackButton(stage) {
    const graphics = new PIXI.Graphics();
    const backSprite = new PIXI.Sprite(PIXI.Loader.shared.resources["../res/1F519.png"].texture);
    let backButtonRadius = 30;
    let backSpriteScale = 0.3;

    if (isMobile()) {
        backButtonRadius *= 1.75;
        backSpriteScale *= 1.75;
    }

    graphics.interactive = true;
    graphics.buttonMode = true;
    graphics.beginFill(0xadbc43, 1);
    graphics.lineStyle(3, 0x00, 1);
    graphics.drawCircle(window.innerWidth - backButtonRadius * 2, backButtonRadius * 2, backButtonRadius);
    graphics.endFill();
    graphics.on('pointerdown', () => window.location.replace("../menu"));
    backSprite.position.set(window.innerWidth - backButtonRadius * 2, backButtonRadius * 2);
    backSprite.scale.set(backSpriteScale, backSpriteScale);
    backSprite.anchor.set(0.5, 0.5);
    stage.addChild(graphics);
    stage.addChild(backSprite);
}

/**
 * Determines the currently displayed frames per second.
 * @param delta frame delta since last frame
 * @returns {number} frames per second
 */
export function calculateFps(delta) {
    return 1000 / (delta / PIXI.settings.TARGET_FPMS);
}

/**
 * Interpolates linearly between two given values
 * @param a start value
 * @param b end value
 * @param fraction current fraction between both values
 * @returns {*} interpolated value
 */
export function lerp(a, b, fraction) {
    fraction = fraction < 0 ? 0 : fraction;
    fraction = fraction > 1 ? 1 : fraction;
    return a + (b - a) * fraction;
}

/**
 * Checks if current usage is via smartphone or tablet and if the device is in portrait orientation.
 * @returns {boolean} returns if condition is met
 */
export function isMobile() {
    return PIXI.utils.isMobile.any && window.innerHeight > window.innerWidth;
}