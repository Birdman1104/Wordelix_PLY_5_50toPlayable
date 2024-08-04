import { Container, Point } from 'pixi.js';
import { WordModel } from '../models/WordModel';
import { LetterView } from './LetterView';

export class WordView extends Container {
    private letters: LetterView[] = [];
    private canDrag = true;
    private dragPoint: Point;

    private draggingLetter: LetterView | null;

    constructor(private config: WordModel) {
        super();
        this.build();
    }

    get viewName() {
        return 'WordView';
    }

    public rebuild(): void {
        //
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
        letterView.on('pointerout', () => this.stopDrag(letterView), this);
        letterView.on('pointerup', () => this.stopDrag(letterView), this);
        letterView.on('disableDrag', () => (this.canDrag = false));
        letterView.on('enableDrag', () => (this.canDrag = true));
    }

    private onDragStart(event, letterView: LetterView): void {
        if (!this.canDrag) return;
        event.stopPropagation();
        this.draggingLetter = letterView;
        this.dragPoint = event.data.getLocalPosition(letterView.parent);
        this.dragPoint.x -= letterView.x;
        this.dragPoint.y -= letterView.y;
        letterView.on('pointermove', this.onDragMove, this);
    }

    private stopDrag(letterView: LetterView): void {
        letterView.off('pointermove', this.onDragMove, this);
        this.draggingLetter = null;
        
    }

    private onDragMove(event): void {
        if (!this.canDrag || !this.draggingLetter) return;
        
        const newPoint = event.data.getLocalPosition(this.draggingLetter.parent);
        this.draggingLetter.x = newPoint.x - this.dragPoint.x;
        this.draggingLetter.y = newPoint.y - this.dragPoint.y;
    }
}
