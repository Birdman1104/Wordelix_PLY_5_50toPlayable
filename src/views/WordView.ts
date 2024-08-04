import { Container, Point } from 'pixi.js';
import { WordModel } from '../models/WordModel';
import { LetterView } from './LetterView';

export class WordView extends Container {
    private letters: LetterView[] = [];
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
        this.letters.forEach((letter) => this.disableDragEvents(letter));
    }

    public enableLettersDrag(): void {
        this.letters.forEach((letter) => this.setDragEvents(letter));
    }


    private build(): void {
        this.letters = this.config.letters.map((letter, i) => {
            const letterView = new LetterView(letter);
            letterView.x = 90 * i;
            this.setDragEvents(letterView);
            this.addChild(letterView);
            return letterView;
        });
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
        !this.dragStarted && this.emit('dragStart', this.uuid)
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
}
