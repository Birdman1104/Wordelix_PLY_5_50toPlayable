import anime from 'animejs';
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

    private finalPositions: DropDownAreaInfo[] = [];

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
        this.buildLine();
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
            return letterView;
        });
    }

    private buildLine(): void {
        const color = 0xffffff * Math.random();
        const line = makeSprite({ texture: Images['game/line'], anchor: new Point(1, 0.5) });
        const scaleX = 1200 / line.width - this.getWordLength() / line.width;
        line.scale.set(scaleX, 0.2);
        line.position.set(1250, 50);
        this.addChild(line);

        let prevX = line.x - line.width;
        for (let i = 0; i < this.disabledLetters.length; i++) {
            const letter = this.disabledLetters[i];
            const startX = prevX;
            const endX = startX + LETTER_SIZES[letter.letter].width;
            const startY = letter.y - letter.height / 2;
            const endY = letter.y + letter.height / 2;
            const centerX = startX + (endX - startX) / 2;
            const centerY = startY + (endY - startY) / 2;
            this.finalPositions.push({ startX, startY, endX, endY, centerX, centerY, isFree: true });
            prevX = Math.max(prevX, endX + 2);
            // drawPoint(this, startX, startY, color);
            // drawPoint(this, endX, endY, color);
        }
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

        if (!this.draggingLetter) return;
        const { x, y } = this.draggingLetter as LetterView;

        let dropArea = this.finalPositions.find((area) => x > area.startX && x < area.endX && y > area.startY && y < area.endY && area.isFree);

        const lastArea = this.finalPositions[this.finalPositions.length - 1];
        if(!dropArea && x > lastArea.endX && y > lastArea.startY && y < lastArea.endY && lastArea.isFree) {
            dropArea = lastArea;
        }

        if (dropArea) {
            anime({
                targets: this.draggingLetter,
                x: dropArea.centerX,
                y: dropArea.centerY,
                duration: 50,
                easing: 'easeInOutSine',
            });
            dropArea.isFree = false;
            // this.emit('letterDrop', this.uuid, this.draggingLetter.letter);
        } else {
            anime({
                targets: this.draggingLetter,
                x: this.draggingLetter.originalX,
                y: this.draggingLetter.originalY,
                duration: 200,
                easing: 'easeInOutSine',
            });
        }

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
        return currentW;
    }

    private getWordLength(): number {
        return this.config.letters.reduce((acc, letter) => acc + LETTER_SIZES[letter.letter].width, 0);
    }
}
