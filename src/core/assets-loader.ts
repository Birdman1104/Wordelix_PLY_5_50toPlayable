import * as PIXI from 'pixi.js';
import { assets, Images } from '../assets';
import SoundController from '../SoundController';
import { hasOwnProperty, upperPowerOfTwo } from '../utils';

export class AtlasRegion {
    public texture: PIXI.Texture;
    public frame: PIXI.Rectangle;
    public name: string;

    public constructor(name: string, texture: PIXI.Texture) {
        this.name = name;
        this.texture = texture;
        this.frame = new PIXI.Rectangle(0, 0, texture.width + 2, texture.height + 2);
    }
}

function atlasMiddleware(resource: PIXI.LoaderResource, next: () => void): void {
    const { atlases } = assets;
    const isAtlas = hasOwnProperty(atlases, resource.name);

    if (!isAtlas) {
        next();
        return;
    }

    next();
}

export class AssetsLoader extends PIXI.utils.EventEmitter {
    private _loader: PIXI.Loader;

    public constructor() {
        super();
        this._loader = PIXI.Loader.shared;
        this._loader.use(atlasMiddleware);
    }

    public async load(): Promise<void> {
        return new Promise(async (resolve) => {
            this._loadImages(assets.images);
            this._loadAtlases(assets.atlases);
            await this._loadSounds(assets.sounds);
            await new Promise((cb: (value: void | PromiseLike<void>) => void) => this._loader.load(() => cb()));
            await this._loadSuperAtlas();
            resolve();
        });
    }

    private _loadImages(images: Record<string, string>): void {
        Object.keys(images).forEach((image) => {
            this._loader.add(image, images[image]);
        });
    }

    private _loadAtlases(atlases: Record<string, { image: string }>): void {
        Object.keys(atlases).forEach((atlas) => {
            this._loader.add(atlas, atlases[atlas].image);
        });
    }

    private _loadSounds(sounds: Record<string, string>): Promise<void> {
        return new Promise((resolve) => {
            SoundController.loadSounds();
            resolve();
        });
    }

    private async _loadSuperAtlas(): Promise<void> {
        return new Promise((resolve) => {
            const regions = Object.keys(Images).map(
                (img) =>
                    new AtlasRegion(
                        Images[img as keyof typeof Images],
                        PIXI.Texture.from(Images[img as keyof typeof Images]),
                    ),
            );
            const packInfo = this._packSuperAtlas(regions);
            const renderTexture = PIXI.RenderTexture.create({
                width: upperPowerOfTwo(packInfo.w),
                height: upperPowerOfTwo(packInfo.h),
            });
            const { renderer } = window.game;
            const sprite = new PIXI.Sprite();
            const json: { frames: { [key: string]: unknown }; meta: unknown } = {
                frames: {},
                meta: {
                    format: 'RGBA8888',
                    size: {
                        w: packInfo.w,
                        h: packInfo.h,
                    },
                    scale: 1,
                },
            };
            regions.forEach((r) => {
                const { texture, frame, name } = r;
                sprite.texture = texture;
                sprite.position.x = frame.x + 1;
                sprite.position.y = frame.y + 1;
                const { width: w, height: h } = sprite;
                const f = {
                    frame: {
                        x: sprite.x,
                        y: sprite.y,
                        w,
                        h,
                    },
                    rotated: false,
                    trimmed: false,
                    spriteSourceSize: {
                        w,
                        h,
                    },
                    sourceSize: {
                        w: sprite.width,
                        h: sprite.height,
                    },
                };
                json.frames[name] = f;
                renderer.render(sprite, renderTexture, false);
                sprite.texture = PIXI.Texture.EMPTY;
                PIXI.Texture.removeFromCache(texture);
                texture.destroy(true);
            });
            const atlas = new PIXI.Spritesheet(renderTexture, json);
            atlas.parse(resolve);
        });

        // PIXI.Texture.addToCache(renderTexture, 'super-atlas');
        // const a = document.createElement('a'); //Create <a>
        // a.href = renderer.plugins.extract.base64(renderTexture);
        // a.download = 'Image.png'; //File name Here
        // a.click(); //Downloaded file
    }

    private _packSuperAtlas(regions: AtlasRegion[]): {
        w: number;
        h: number;
        fill: number;
    } {
        // calculate total box area and maximum box width
        let area = 0;
        let maxWidth = 0;

        regions.forEach((r) => {
            const { width, height } = r.frame;
            area += width * height;
            maxWidth = Math.max(maxWidth, width);
        });

        // sort the boxes for insertion by height, descending
        regions.sort((a, b) => b.frame.height - a.frame.height);

        // aim for a squarish resulting container,
        // slightly adjusted for sub-100% space utilization
        const startWidth = Math.max(Math.ceil(Math.sqrt(area / 0.95)), maxWidth);

        // start with a single empty space, unbounded at the bottom
        const spaces = [{ x: 0, y: 0, w: startWidth, h: Infinity }];

        let width = 0;
        let height = 0;

        for (const region of regions) {
            const { frame: box } = region;
            // look through spaces backwards so that we check smaller spaces first
            for (let i = spaces.length - 1; i >= 0; i--) {
                const space = spaces[i];

                // look for empty spaces that can accommodate the current box
                if (box.width > space.w || box.height > space.h) continue;

                // found the space; add the box to its top-left corner
                // |-------|-------|
                // |  box  |       |
                // |_______|       |
                // |         space |
                // |_______________|
                box.x = space.x;
                box.y = space.y;

                height = Math.max(height, box.y + box.height);
                width = Math.max(width, box.x + box.width);

                if (box.width === space.w && box.height === space.h) {
                    // space matches the box exactly; remove it
                    const last = spaces.pop() as { x: number; y: number; w: number; h: number };
                    if (i < spaces.length) spaces[i] = last;
                } else if (box.height === space.h) {
                    // space matches the box height; update it accordingly
                    // |-------|---------------|
                    // |  box  | updated space |
                    // |_______|_______________|
                    space.x += box.width;
                    space.w -= box.height;
                } else if (box.width === space.w) {
                    // space matches the box width; update it accordingly
                    // |---------------|
                    // |      box      |
                    // |_______________|
                    // | updated space |
                    // |_______________|
                    space.y += box.height;
                    space.h -= box.height;
                } else {
                    // otherwise the box splits the space into two spaces
                    // |-------|-----------|
                    // |  box  | new space |
                    // |_______|___________|
                    // | updated space     |
                    // |___________________|
                    spaces.push({
                        x: space.x + box.width,
                        y: space.y,
                        w: space.w - box.width,
                        h: box.height,
                    });
                    space.y += box.height;
                    space.h -= box.height;
                }
                break;
            }
        }

        return {
            w: width, // container width
            h: height, // container height
            fill: area / (width * height) || 0, // space utilization
        };
    }
}
