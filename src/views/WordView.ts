import { lego } from '@armathai/lego';
import anime from 'animejs';
import { Container, Point } from 'pixi.js';
import { Images } from '../assets';
import { LETTER_SIZES } from '../configs/LettersSizeConfig';
import { WordViewEvents } from '../events/MainEvents';
import { LetterModel } from '../models/LetterModel';
import { WordModel } from '../models/WordModel';
import { makeSprite } from '../utils';
import { DropDownAreaInfo } from './DropDownAreaInfo';
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

    get answer(): string {
        return this.config.answer;
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
            currentW = this.setLetterInitialPosition(letterView, currentW);
            return letterView;
        });
    }

    private buildDraggableLetters(): void {
        let currentW = 0;
        this.draggableLetters = this.config.letters.map((letter) => {
            const letterView = this.buildLetter(letter);
            currentW = this.setLetterInitialPosition(letterView, currentW);
            letterView.setOriginalPosition(letterView.x, letterView.y);
            this.setDragEvents(letterView);
            return letterView;
        });
    }

    private buildLine(): void {
        const line = makeSprite({ texture: Images['game/line'], anchor: new Point(1, 0.5) });
        const scaleX = 1200 / line.width - this.getWordLength() / line.width;
        line.scale.set(scaleX, 0.2);
        line.position.set(1250, 50);
        this.addChild(line);

        const startX = line.x - line.width;
        this.setDropAreas(startX);
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
        this.draggingLetter.startDrag();
        this.dragPoint = event.data.getLocalPosition(letterView.parent);
        this.dragPoint.x -= letterView.x;
        this.dragPoint.y -= letterView.y;
        this.removeChild(this.draggingLetter);
        this.addChild(this.draggingLetter);
        letterView.on('pointermove', this.onDragMove, this);
    }

    private stopDrag(): void {
        this.dragStarted = false;
        if (!this.draggingLetter) return;
        this.draggingLetter.off('pointermove', this.onDragMove, this);

        const dropArea = this.findDropArea();
        if (dropArea) {
            this.dropLetterToArea(dropArea, this.draggingLetter);
            dropArea.setLetter(this.draggingLetter.letter, this.draggingLetter.uuid);
            this.isFilled() && this.checkAnswer();
        } else {
            this.dropLetterToOriginalPosition();
        }

        this.draggingLetter = null;
    }

    private onDragMove(event): void {
        if (!this.canDrag || !this.draggingLetter) return;

        const newPoint = event.data.getLocalPosition(this.draggingLetter.parent);
        this.draggingLetter.x = newPoint.x - this.dragPoint.x;
        this.draggingLetter.y = newPoint.y - this.dragPoint.y;

        this.handleCollisionFromLeft();
        this.handleCollisionFromRight()
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

    private setLetterInitialPosition(letterView: LetterView, currentW: number): number {
        const { width } = LETTER_SIZES[letterView.letter];
        letterView.x = currentW + width;
        currentW += width;
        return currentW;
    }

    private getWordLength(): number {
        return this.config.letters.reduce((acc, letter) => acc + LETTER_SIZES[letter.letter].width, 0);
    }

    private isFilled(): boolean {
        return this.finalPositions.every((area) => !area.isFree);
    }

    private checkAnswer(): void {
        const answer = this.finalPositions.map((area) => area.insertedLetter).join('');
        if (answer === this.answer) {
            this.disableLettersDrag()
            lego.event.emit(WordViewEvents.Solved, this.uuid);
            console.warn('COMPLETED');
        } else {
            console.warn('WRONG');
        }
    }

    private setDropAreas(startX = 0): void {
        let prevX = startX;
        for (let i = 0; i < this.disabledLetters.length; i++) {
            const letter = this.disabledLetters[i];
            const startX = prevX;
            const endX = startX + LETTER_SIZES[letter.letter].width;
            const startY = letter.y - letter.height / 2;
            const endY = letter.y + letter.height / 2;
            const centerX = startX + (endX - startX) / 2;
            const centerY = startY + (endY - startY) / 2;
            const dropDownAreaInfo = new DropDownAreaInfo({
                startX,
                startY,
                endX,
                endY,
                centerX,
                centerY,
                isFree: true,
                answer: this.answer[i],
            });
            this.finalPositions.push(dropDownAreaInfo);
            prevX = Math.max(prevX, endX + 2);
        }
    }

    private findDropArea(): DropDownAreaInfo | undefined {
        const { x, y } = this.draggingLetter as LetterView;
        let dropArea = this.finalPositions.find(
            (area) => x > area.startX && x < area.endX && area.isFree,
        );

        const lastArea = this.finalPositions[this.finalPositions.length - 1];
        if (!dropArea && x > lastArea.endX && lastArea.isFree) {
            dropArea = lastArea;
        }

        return dropArea;
    }

    private handleCollisionFromLeft(): void {
        const { x } = this.draggingLetter as LetterView;
        const dropArea = this.finalPositions.find((area) => x > area.startX && x <= area.centerX);
        if (!dropArea || dropArea.isFree) return;
        const collidedLetter = this.draggableLetters.find((letter) => letter.uuid === dropArea.insertedLetterId);
        if(!collidedLetter) return;

        const leftSideAreas = this.finalPositions.filter(area => area.endX <= collidedLetter.x).reverse();
        const firstFreeArea = leftSideAreas.find(area => area.isFree);

        if(!firstFreeArea) return;

        const currentArea = collidedLetter.area
        currentArea?.empty();

        this.dropLetterToArea(firstFreeArea, collidedLetter);
        firstFreeArea.empty()
        firstFreeArea.setLetter(collidedLetter.letter, collidedLetter.uuid);
    }
    
    private handleCollisionFromRight(): void {
        const { x } = this.draggingLetter as LetterView;
        const dropArea = this.finalPositions.find((area) => x > area.centerX && x <= area.endX);
        if (!dropArea || dropArea.isFree) return;
        const collidedLetter = this.draggableLetters.find((letter) => letter.uuid === dropArea.insertedLetterId);
        if(!collidedLetter) return;

        const leftSideAreas = this.finalPositions.filter(area => area.endX >= collidedLetter.x);
        const firstFreeArea = leftSideAreas.find(area => area.isFree);

        if(!firstFreeArea) return;

        const currentArea = collidedLetter.area
        currentArea?.empty();

        this.dropLetterToArea(firstFreeArea, collidedLetter);
        firstFreeArea.empty()
        firstFreeArea.setLetter(collidedLetter.letter, collidedLetter.uuid);
    }

    private dropLetterToArea(dropArea: DropDownAreaInfo, letter: LetterView): void {
        anime({
            targets: letter,
            x: dropArea.centerX,
            y: dropArea.centerY,
            duration: 50,
            easing: 'easeInOutSine',
        });
        letter.dropTo(dropArea);
    }

    private dropLetterToOriginalPosition(): void {
        if (!this.draggingLetter) return;
        anime({
            targets: this.draggingLetter,
            x: this.draggingLetter.originalX,
            y: this.draggingLetter.originalY,
            duration: 200,
            easing: 'easeInOutSine',
        });
    }
}
