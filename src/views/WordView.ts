import { Container, Point } from 'pixi.js';
import { Images } from '../assets';
import { LETTER_SIZES } from '../configs/LettersSizeConfig';
import { LetterModel } from '../models/LetterModel';
import { WordModel } from '../models/WordModel';
import { makeSprite } from '../utils';
import { LetterView } from './LetterView';

export class WordView extends Container {
    private draggableLetters: LetterView[] = [];
    private disabledLetters: LetterView[] = [];
    private canDrag = true;
    private dragPoint: Point;
    private dragStarted = false;

    private draggingLetter: LetterView | null;

    constructor(private config: WordModel) {
        super();
        this.build();
    }

    get uuid(): string {
        return this.config.uuid;
    }

    public rebuild(): void {
        //
    }

    public disableLettersDrag(): void {
        this.draggableLetters.forEach((letter) => this.disableDragEvents(letter));
    }

    public enableLettersDrag(): void {
        this.draggableLetters.forEach((letter) => this.setDragEvents(letter));
    }

    private build(): void {
        this.buildDisabledLetters();
        this.buildDraggableLetters();
        // this.buildLine();
    }

    private buildDisabledLetters(): void {
        let currentW = 0;
        this.disabledLetters = this.config.letters.map((letter, i) => {
            const letterView = this.buildLetter(letter);
            currentW = this.setLetterPosition(letterView, currentW);
            return letterView;
        });
    }

    private buildDraggableLetters(): void {
        let currentW = 0;
        this.draggableLetters = this.config.letters.map((letter, i) => {
            const letterView = this.buildLetter(letter);
            currentW = this.setLetterPosition(letterView, currentW);
            letterView.setOriginalPosition(letterView.x, letterView.y);
            this.setDragEvents(letterView);
            this.addChild(letterView);
            return letterView;
        });
    }

    private buildLine(): void {
        const line = makeSprite({ texture: Images['game/line'], anchor: new Point(1, 0.5) });
        const scaleX = 15 - this.disabledLetters.length;
        line.scale.set(scaleX, 0.2);
        line.position.set(1050, 50);
        this.addChild(line);
    }

    private setDragEvents(letterView: LetterView): void {
        letterView.interactive = true;
        letterView.on('pointerdown', (e) => this.onDragStart(e, letterView));
        letterView.on('pointerout', this.stopDrag, this);
        letterView.on('pointerup', this.stopDrag, this);
        letterView.on('disableDrag', () => (this.canDrag = false));
        letterView.on('enableDrag', () => (this.canDrag = true));
    }

    private disableDragEvents(letterView: LetterView): void {
        letterView.interactive = true;
        letterView.off('pointerdown', (e) => this.onDragStart(e, letterView));
        letterView.off('pointerout', this.stopDrag, this);
        letterView.off('pointerup', this.stopDrag, this);
        letterView.off('disableDrag', () => (this.canDrag = false));
        letterView.off('enableDrag', () => (this.canDrag = true));
    }

    private onDragStart(event, letterView: LetterView): void {
        if (!this.canDrag) return;
        !this.dragStarted && this.emit('dragStart', this.uuid);
        this.dragStarted = true;
        event.stopPropagation();
        this.draggingLetter = letterView;
        this.dragPoint = event.data.getLocalPosition(letterView.parent);
        this.dragPoint.x -= letterView.x;
        this.dragPoint.y -= letterView.y;
        this.removeChild(this.draggingLetter);
        this.addChild(this.draggingLetter);
        letterView.on('pointermove', this.onDragMove, this);
    }

    private stopDrag(): void {
        this.dragStarted = false;
        this.draggingLetter?.off('pointermove', this.onDragMove, this);
        this.draggingLetter = null;
    }

    private onDragMove(event): void {
        if (!this.canDrag || !this.draggingLetter) return;

        const newPoint = event.data.getLocalPosition(this.draggingLetter.parent);
        this.draggingLetter.x = newPoint.x - this.dragPoint.x;
        this.draggingLetter.y = newPoint.y - this.dragPoint.y;
    }

    private buildLetter(letterConfig: LetterModel): LetterView {
        const letterView = new LetterView(letterConfig);
        if (letterConfig.letter === 'Q') {
            letterView.y = 6;
        }
        if (letterConfig.letter === 'J') {
            letterView.y = 11;
        }
        this.addChild(letterView);
        return letterView;
    }

    private setLetterPosition(letterView: LetterView, currentW: number): number {
        const { width } = LETTER_SIZES[letterView.letter];
        letterView.x = currentW + width;
        currentW += width;
        return currentW
    }
}
