import { Container, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { LetterModel } from '../models/LetterModel';
import { makeSprite } from '../utils';
import { DropDownAreaInfo } from './DropDownAreaInfo';

export class LetterView extends Container {
    public originalX: number
    public originalY: number
    private sprite: Sprite;
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
        return this.dropArea
    }

    public setOriginalPosition(x: number, y: number): void {
        this.originalX = x;
        this.originalY = y;
    }

    public setSolved(): void {
        this.sprite.tint = 0x00ff00;
    }

    public dropTo(dropArea: DropDownAreaInfo): void {
        this.dropArea = dropArea;
        this.dropArea.setLetter(this.config.letter, this.config.uuid);
        this.originalX = dropArea.centerX;
        this.originalY = dropArea.centerY;
    }

    public startDrag(): void {
        this.dropArea?.empty()
        this.dropArea = null;
    }

    private build(): void {
        this.sprite = makeSprite({ texture: Images[`game/${this.config.letter}`] });
        this.sprite.interactive = true;
        this.sprite.tint = 0x000000;
        this.addChild(this.sprite);
        // drawBounds(this);
    }
}
