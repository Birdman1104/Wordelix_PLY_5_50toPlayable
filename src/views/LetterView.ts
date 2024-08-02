import { Container, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { LetterModel } from '../models/LetterModel';
import { makeSprite } from '../utils';

export class LetterView extends Container {
    private sprite: Sprite;

    constructor(private config: LetterModel) {
        super();
        this.build();
    }

    get uuid(): string {
        return this.config.uuid;
    }

    public setSolved(): void {
        this.sprite.tint = 0x00ff00;
    }

    private build(): void {
        this.sprite = makeSprite({ texture: Images[`game/${this.config.letter}`] });
        this.sprite.interactive = true;
        this.sprite.tint = 0x000000;
        this.addChild(this.sprite);
        console.warn('LetterView.build', this.config.letter);
        
    }
}
