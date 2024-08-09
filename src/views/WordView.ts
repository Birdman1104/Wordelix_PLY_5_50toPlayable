import { lego } from '@armathai/lego';
import anime from 'animejs';
import { Container, Point } from 'pixi.js';
import { Images } from '../assets';
import { LETTER_SIZES } from '../configs/LettersSizeConfig';
import { WordViewEvents } from '../events/MainEvents';
import { LetterModel } from '../models/LetterModel';
import { WordModel } from '../models/WordModel';
import { callIfExists, delayRunnable, makeSprite } from '../utils';
import { DropDownAreaInfo } from './DropDownAreaInfo';
import { LetterView } from './LetterView';

export class WordView extends Container {
    private draggableLetters: LetterView[] = [];
    private disabledLetters: LetterView[] = [];
    private dragPoint: Point;
    private dragStarted = false;
    private canDrag = true;
    private _allowedToDrag = true;
    private prevDragArea: DropDownAreaInfo | null = null;

    private draggingLetter: LetterView | null;

    private finalPositions: DropDownAreaInfo[] = [];

    constructor(private config: WordModel, private level: number) {
        super();
        this.build();
    }

    get uuid(): string {
        return this.config.uuid;
    }

    get answer(): string {
        return this.config.answer;
    }

    get allowedToDrag(): boolean {
        return this._allowedToDrag;
    }

    set allowedToDrag(value: boolean) {
        this._allowedToDrag = value;
    }

    public getHintPositions(): { positions: Point[]; letter: string } {
        const freeArea = this.finalPositions.find((area) => area.isFree || area.insertedLetter !== area.answer);

        if (!freeArea) {
            return {
                positions: [],
                letter: '',
            };
        }
        const index = this.finalPositions.indexOf(freeArea);

        let letter;
        if (this.isFilled()) {
            const letters = this.draggableLetters.filter((letter) => letter.letter === freeArea.answer);
            letter = letters[0];
        } else {
            const f = this.draggableLetters.filter((letter) => letter.letter === freeArea.answer);
            const l = f.find((letter) => letter.area !== freeArea && !letter.area);
            letter = f.length === 1 ? f[0] : l;
        }

        if (!letter) {
            return {
                positions: [],
                letter: '',
            };
        }

        const letterPos = this.toGlobal(new Point(letter.x, letter.y));
        const dropPos = this.toGlobal(
            new Point(this.finalPositions[index].centerX, this.finalPositions[index].centerY),
        );

        return {
            positions: [letterPos, dropPos],
            letter: letter.letter,
        };
    }

    public rebuild(): void {
        //
    }

    public setSolved(): void {
        this.draggableLetters.forEach((letter, i) => {
            const cb = (): void => {
                delayRunnable(0.1, () => {
                    lego.event.emit(WordViewEvents.WinAnimationComplete);
                })
            };
            letter.setSolved(i === 0 && cb );
        });
    }

    public disableLettersDrag(): void {
        this.allowedToDrag = false;
    }

    public enableLettersDrag(): void {
        this.allowedToDrag = true;
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
        const scaleX = (this.level === 1 ? 1100 : 1300) / line.width - this.getWordLength() / line.width;
        line.scale.set(scaleX, 0.2);
        line.position.set((this.level === 1 ? 1200 : 1400), 60);
        this.addChild(line);

        const startX = line.x - line.width;
        this.setDropAreas(startX);
    }

    private setDragEvents(letterView: LetterView): void {
        letterView.interactive = true;
        letterView.on('pointerdown', (e) => this.onDragStart(e, letterView));
        letterView.on('pointerout', this.stopDrag, this);
        letterView.on('pointerup', this.stopDrag, this);
        letterView.on('pointerupoutside', this.stopDrag, this);
        letterView.on('disableDrag', () => (this.canDrag = false));
        letterView.on('enableDrag', () => (this.canDrag = true));
    }

    private onDragStart(event, letterView: LetterView): void {
        if (!this.canDrag || !this.allowedToDrag) return;
        !this.dragStarted && this.emit('dragStart', this.uuid);
        lego.event.emit(WordViewEvents.DragStart);
        this.dragStarted = true;
        event.stopPropagation();

        this.draggingLetter = letterView;
        this.prevDragArea = this.draggingLetter.area;
        this.draggingLetter.startDrag();
        this.dragPoint = event.data.getLocalPosition(letterView.parent);
        this.dragPoint.x -= letterView.x;
        this.dragPoint.y -= letterView.y - 40;
        this.removeChild(this.draggingLetter);
        this.addChild(this.draggingLetter);
        letterView.on('pointermove', this.onDragMove, this);
    }

    private stopDrag(): void {
        this.dragStarted = false;
        if (!this.draggingLetter) return;
        lego.event.emit(WordViewEvents.DragComplete);
        this.draggingLetter.off('pointermove', this.onDragMove, this);
        this.draggingLetter.stopDrag();
        const dropArea = this.findDropArea();

        if (dropArea) {
            this.draggingLetter.emptyArea();
            if (!dropArea.isFree) {
                this.handleCollisionFromLeft(dropArea);
                this.handleCollisionFromRight(dropArea);
            }
            const cb = (): void => {
                this.isFilled() && this.checkAnswer();
            };
            this.dropLetterToArea(dropArea, this.draggingLetter, cb);
            dropArea.setLetter(this.draggingLetter.letter, this.draggingLetter.uuid);
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

    private checkAnswer(): void {
        const answer = this.finalPositions.map((area) => area.insertedLetter).join('');
        if (answer === this.answer) {
            this.disableLettersDrag();
            lego.event.emit(WordViewEvents.Solved, this.uuid);
        }
    }

    private setDropAreas(startX = 0): void {
        let prevX = startX;
        const width = 120;
        for (let i = 0; i < this.disabledLetters.length; i++) {
            const letter = this.disabledLetters[i];
            const startX = prevX;
            const endX = startX + width;
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
        const { x } = this.draggingLetter as LetterView;

        if (this.finalPositions.every((area) => area.isFree)) return this.finalPositions[0];
        let dropArea = this.finalPositions.find((area) => x >= area.startX && x <= area.endX);

        const lastArea = this.finalPositions[this.finalPositions.length - 1];
        if (!dropArea && x > lastArea.endX) {
            dropArea = lastArea;
        }

        return dropArea;
    }

    private handleCollisionFromLeft(dropArea: DropDownAreaInfo): void {
        const collidedLetter = this.draggableLetters.find((letter) => letter.uuid === dropArea.insertedLetterId);
        if (!collidedLetter) return;

        const leftSideAreas = this.finalPositions.filter((area) => area.endX <= collidedLetter.x).reverse();
        const firstFreeArea = leftSideAreas.find((area) => area.isFree);

        if (!firstFreeArea) return;

        const currentArea = collidedLetter.area;
        currentArea?.empty();

        this.dropLetterToArea(firstFreeArea, collidedLetter);
        firstFreeArea.empty();
        firstFreeArea.setLetter(collidedLetter.letter, collidedLetter.uuid);
    }

    private handleCollisionFromRight(dropArea: DropDownAreaInfo): void {
        const collidedLetter = this.draggableLetters.find((letter) => letter.uuid === dropArea.insertedLetterId);
        if (!collidedLetter) return;

        const leftSideAreas = this.finalPositions.filter((area) => area.endX >= collidedLetter.x);
        const firstFreeArea = leftSideAreas.find((area) => area.isFree);

        if (!firstFreeArea) return;

        const currentArea = collidedLetter.area;
        currentArea?.empty();

        this.dropLetterToArea(firstFreeArea, collidedLetter);
        firstFreeArea.empty();
        firstFreeArea.setLetter(collidedLetter.letter, collidedLetter.uuid);
    }

    private dropLetterToArea(dropArea: DropDownAreaInfo, letter: LetterView, cb?: () => void): void {
        anime({
            targets: letter,
            x: dropArea.centerX,
            y: dropArea.centerY,
            duration: 50,
            easing: 'easeInOutSine',
            complete: () => callIfExists(cb),
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

        if (!this.draggingLetter.area) {
            this.draggingLetter.hideOutline();
        }
    }

    private getWordLength(): number {
        return this.config.letters.reduce((acc, letter) => acc + LETTER_SIZES[letter.letter].width, 0);
    }

    private isFilled(): boolean {
        return this.finalPositions.every((area) => !area.isFree);
    }
}
