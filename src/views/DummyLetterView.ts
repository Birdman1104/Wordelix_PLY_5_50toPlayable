import { Container, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { BoundsType, GAME_CONFIG } from '../configs/GameConfig';
import { makeSprite } from '../utils';

export class DummyLetterView extends Container {
    private sprite: Sprite;
    private outline: Sprite | undefined;

    constructor(public letter: string) {
        super();
        this.build();
    }

    public showOutline(): void {
        if (this.outline) {
            this.outline.visible = true;
        }
    }

    public hideOutline(): void {
        if (this.outline) {
            this.outline.visible = false;
        }
    }

    private build(): void {
        this.buildLetter();
        this.buildOutline();
    }

    private buildLetter(): void {
        this.sprite = makeSprite({ texture: Images[`game/${this.letter}`] });
        this.sprite.interactive = true;
        this.sprite.tint = 0x000000;
        this.addChild(this.sprite);
    }

    private buildOutline(): void {
        switch (GAME_CONFIG.bounds) {
            // @ts-ignore
            case BoundsType.SQUARE:
                this.buildSquareOutline();
                break;

            // @ts-ignore
            case BoundsType.LINE:
                this.buildLineOutline();
                break;

            default:
                break;
        }

        this.outline && (this.outline.tint = 0x000000);
    }

    private buildSquareOutline(): void {
        this.outline = makeSprite({ texture: Images['game/square'] });
        this.addChild(this.outline);
    }

    private buildLineOutline(): void {
        this.outline = makeSprite({ texture: Images['game/line'] });
        this.outline.scale.set(120 / this.outline.width, 0.1);
        this.outline.y = this.sprite.height / 2;
        this.addChild(this.outline);
    }
}
