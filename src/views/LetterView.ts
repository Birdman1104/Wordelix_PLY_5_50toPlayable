import { Container, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { BoundsType, GAME_CONFIG } from '../configs/GameConfig';
import { LetterModel } from '../models/LetterModel';
import { makeSprite } from '../utils';
import { DropDownAreaInfo } from './DropDownAreaInfo';

export class LetterView extends Container {
    public originalX: number;
    public originalY: number;
    private sprite: Sprite;
    private outline: Sprite | undefined;
    private dropArea: DropDownAreaInfo | null = null;

    constructor(private config: LetterModel) {
        super();
        this.build();
    }

    get uuid(): string {
        return this.config.uuid;
    }

    get letter(): string {
        return this.config.letter;
    }

    get area(): DropDownAreaInfo | null {
        return this.dropArea;
    }

    public setOriginalPosition(x: number, y: number): void {
        this.originalX = x;
        this.originalY = y;
    }

    public setSolved(): void {
        this.sprite.tint = 0x00ff00;
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

    public dropTo(dropArea: DropDownAreaInfo): void {
        this.dropArea = dropArea;
        this.dropArea.setLetter(this.config.letter, this.config.uuid);
        this.originalX = dropArea.centerX;
        this.originalY = dropArea.centerY;
    }

    public startDrag(): void {
        this.dropArea?.empty();
        this.dropArea = null;
        this.showOutline();
    }

    private build(): void {
        this.buildLetter();
        this.buildOutline();
    }

    private buildLetter(): void {
        this.sprite = makeSprite({ texture: Images[`game/${this.config.letter}`] });
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

        
        this.outline && (this.outline.visible = false);
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
