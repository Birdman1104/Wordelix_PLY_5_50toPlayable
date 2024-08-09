import { lego } from '@armathai/lego';
import { Container, Graphics, Rectangle, Text } from 'pixi.js';
import { BoardModelEvents, GameModelEvents, WordModelEvents } from '../events/ModelEvents';
import { GameState } from '../models/GameModel';
import { LevelModel } from '../models/LevelModel';
import { WordModel } from '../models/WordModel';
import { WordView } from './WordView';
import { WordsContainer } from './WordsContainer';

export class BoardView extends Container {
    private title: Text;
    private words: WordView[] = [];
    private wordsContainer: WordsContainer;
    private level: number = 2;
    private bnds: Graphics;

    constructor() {
        super();

        lego.event
            .on(GameModelEvents.StateUpdate, this.onGameStateUpdate, this)
            .on(GameModelEvents.IsTutorialUpdate, this.onGameTutorialUpdate, this)
            .on(BoardModelEvents.LevelUpdate, this.onLevelUpdate, this)
            .on(WordModelEvents.SolvedUpdate, this.onWordSolvedUpdate, this);

        this.build();
    }

    get viewName() {
        return 'BoardView';
    }

    public getFirstWord(): WordView | undefined {
        return this.words[0];
    }

    public getBounds(skipUpdate?: boolean | undefined, rect?: PIXI.Rectangle | undefined): Rectangle {
        return new Rectangle(0, -220, this.level === 1 ? 1250 : 1450, this.level === 1 ? 820 : 1900);
    }

    public getWordByUuid(uuid: string): WordView | undefined {
        return this.words.find((word) => word.uuid === uuid);
    }

    public rebuild(): void {
        // this.bnds?.clear();
        // this.bnds?.destroy();
        // this.bnds = drawBounds(this);
        this.updateTransform();
        this.calculateBounds();
    }

    private build(): void {
        //
    }

    private onLevelUpdate(level: LevelModel): void {
        this.level = level.level;
        this.buildWords(level.words, level.level);
        this.buildTitle(level.title);
        this.emit('rebuild');
    }

    private buildTitle(title: string): void {
        const fontSize = this.level === 1 ? 92 : 148;
        if (this.title) {
            this.title.destroy();
            // this.title = null;
        }

        this.title = new Text(title, { fill: 0x000000, fontSize, stroke: 0x000000, strokeThickness: 1 });
        this.title.anchor.set(0.5);
        this.title.position.set(this.level === 1 ? 625 : 725, -150);
        this.wordsContainer.addChild(this.title);
    }

    private buildWords(words: WordModel[], level: number): void {
        if (this.wordsContainer && this.words.length !== 0) {
            this.wordsContainer.destroy();
            this.words.forEach((w) => w.destroy());
            this.words = [];
        }
        this.wordsContainer = new WordsContainer();
        this.words = words.map((word, i) => {
            const wordView = new WordView(word, this.level);
            wordView.y = i * 150 + 50;
            wordView.on('dragStart', (uuid) => this.onDragStart(uuid));
            this.wordsContainer.addChild(wordView);
            return wordView;
        });
        // this.wordsContainer.position.set(0, this.height / 2);
        this.addChild(this.wordsContainer);
    }

    private onDragStart(uuid: string): void {
        const word = this.words.find((word) => word.uuid === uuid);
        if (word) {
            this.wordsContainer.removeChild(word);
            this.wordsContainer.addChild(word);
            word.position.set(word.x, word.y);
        }
    }

    private onWordSolvedUpdate(solved: boolean, wasSolved: boolean, uuid: string): void {
        const word = this.getWordByUuid(uuid);
        if (!word) return;

        solved && word.setSolved();
    }

    private onGameTutorialUpdate(newValue: boolean, oldValue: boolean): void {
        if (newValue) {
            this.words.forEach((word, i) => {
                i !== 0 && word.disableLettersDrag();
            });
        } else {
            this.words.forEach((word, i) => {
                i !== 0 && word.enableLettersDrag();
            });
        }
    }

    private onGameStateUpdate(state: GameState): void {
        //
    }
}
