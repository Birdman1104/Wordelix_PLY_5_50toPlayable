import anime from 'animejs';
import { Graphics, Point, Rectangle, Sprite, Text } from 'pixi.js';

export const lp = (l, p) => {
    const { clientWidth: w, clientHeight: h } = document.body;
    return w > h ? l : p;
};

export const isLandscape = () => {
    const { clientWidth: w, clientHeight: h } = document.body;
    return w > h;
};

export const fitDimension = (
    dim: { width: number; height: number },
    minRatio: number,
    maxRatio: number,
): { width: number; height: number } => {
    const ratioW = dim.width / dim.height;
    const ratioH = dim.height / dim.width;

    if (ratioW < ratioH) {
        if (ratioW > maxRatio) {
            dim.width = dim.width * (maxRatio / ratioW);
        } else if (ratioW < minRatio) {
            dim.height = dim.height * (ratioW / minRatio);
        }
    } else {
        if (ratioH > maxRatio) {
            dim.height = dim.height * (maxRatio / ratioH);
        } else if (ratioH < minRatio) {
            dim.width = dim.width * (ratioH / minRatio);
        }
    }

    return dim;
};

export const delayRunnable = (delay, runnable, context?, ...args) => {
    let delayMS = delay * 1000;
    const delayWrapper = () => {
        delayMS -= window.game.ticker.deltaMS;
        if (delayMS <= 0) {
            runnable.call(context, ...args);
            window.game.ticker.remove(delayWrapper);
        }
    };
    window.game.ticker.add(delayWrapper);
    return delayWrapper;
};

export const loopRunnable = (runnable, context?, ...args) => {
    return window.game.ticker.add(runnable, context, ...args);
};

export const removeRunnable = (runnable, context?) => window.game.ticker.remove(runnable, context);

export const getGameBounds = () => {
    const { clientWidth: width, clientHeight: height } = document.body;

    return new Rectangle(0, 0, width, height);
};

export const isSquareLikeScreen = (): boolean => {
    const { width, height } = getGameBounds();
    return Math.min(width, height) / Math.max(width, height) > 0.7;
};

export const isNarrowScreen = (): boolean => {
    const { width, height } = getGameBounds();
    return Math.min(width, height) / Math.max(width, height) < 0.6;
};

export const getViewByProperty = (prop, value, parent?) => {
    const { children } = parent || window.game.stage;

    if (!children || children.length === 0) {
        return null;
    }

    for (let i = 0; i < children.length; i += 1) {
        const child = children[i];
        if (child[prop] === value) {
            return child;
        }

        const view = getViewByProperty(prop, value, child);
        if (view) {
            return view;
        }
    }

    return null;
};

export const randomInt = (min: number, max: number): number => {
    const mi = Math.ceil(min);
    const ma = Math.floor(max);
    return Math.floor(Math.random() * (ma - mi + 1)) + mi;
};

export const shuffle = (arr: any[]): void => {
    for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = randomInt(0, i);
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
};

export const tweenToCell = (grid, child, cellName, cb: any = null, duration = 200, easing = 'easeInOutSine'): void => {
    const { x: fromScaleX, y: fromScaleY } = child.scale;
    const { x: fromPositionX, y: fromPositionY } = child.position;
    grid.rebuildChild(child, cellName);
    anime({
        targets: child,
        x: [fromPositionX, child.x],
        y: [fromPositionY, child.y],
        duration,
        easing,
        complete: () => callIfExists(cb),
    });
    anime({
        targets: child.scale,
        x: [fromScaleX, child.scale.x],
        y: [fromScaleY, child.scale.y],
        duration,
        easing,
    });
};

export const callIfExists = (callback: any): void => {
    if (typeof callback === 'function') {
        callback();
    }
};

export const openStore = () => {
    //
};

export const hasOwnProperty = <X extends Record<string, unknown>, Y extends PropertyKey>(
    obj: X,
    prop: Y,
): obj is X & Record<Y, unknown> => {
    return Object.prototype.hasOwnProperty.call(obj, prop);
};

export const getValueOfKey = <T, K extends keyof T>(obj: T, key: K): T[K] => obj[key];

export const upperPowerOfTwo = (v: number): number => {
    v--;
    v |= v >> 1;
    v |= v >> 2;
    v |= v >> 4;
    v |= v >> 8;
    v |= v >> 16;
    v++;
    return v;
};

export const makeSprite = (config: SpriteConfig): PIXI.Sprite => {
    const {
        texture,
        tint = 0,
        position = new Point(0, 0),
        scale = new Point(1, 1),
        anchor = new Point(0.5, 0.5),
    } = config;

    const img = Sprite.from(texture);

    img.scale.copyFrom(scale);
    img.anchor.copyFrom(anchor);
    img.position.copyFrom(position);

    if (tint) img.tint = tint;

    return img;
};

export const drawBounds = (container: any, color = 0xffffff * Math.random(), alpha = 0.5): Graphics => {
    const { x, y, width, height } = container.getBounds();
    const gr = new Graphics();
    gr.beginFill(color, alpha);
    gr.drawRect(x, y, width, height);
    gr.endFill();
    container.addChild(gr);
    return gr;
};

export const fitText = (textGameObject: Text, width: number, height: number) => {
    const { width: textWidth, height: textHeight } = textGameObject;
    const { fontSize } = textGameObject.style;
    const ratioW = width ? width / textWidth : 1;
    const ratioH = height ? height / textHeight : 1;
    const ratio = Math.min(Math.min(ratioW, ratioH), 1);

    if (typeof fontSize === 'number') {
        const newFontSize = fontSize * ratio;
        textGameObject.style.fontSize = newFontSize;
    }
};

export const sample = (arr: any[]): any => {
    return arr[Math.floor(Math.random() * arr.length)];
};

export const difference = (arrA: any[], arrB: any[]): any[] => {
    return arrA.filter((x) => !arrB.includes(x));
};