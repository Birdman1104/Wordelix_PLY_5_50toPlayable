import { lego } from '@armathai/lego';
import { Container, Rectangle, Text } from 'pixi.js';
import { BoardModelEvents, GameModelEvents } from '../events/ModelEvents';
import { GameState } from '../models/GameModel';
import { LevelModel } from '../models/LevelModel';
import { WordModel } from '../models/WordModel';
import { WordView } from './WordView';
import { WordsContainer } from './WordsContainer';

export class BoardView extends Container {
    private title: Text;
    private words: WordView[] = [];
    private wordsContainer: WordsContainer;
    private level: number = 1;

    constructor() {
        super();

        lego.event
            .on(GameModelEvents.StateUpdate, this.onGameStateUpdate, this)
            .on(BoardModelEvents.LevelUpdate, this.onLevelUpdate, this);

        this.build();
    }

    get viewName() {
        return 'BoardView';
    }

    public getBounds(skipUpdate?: boolean | undefined, rect?: PIXI.Rectangle | undefined): Rectangle {
        return new Rectangle(0, this.level === 1 ? 0 : -100, 1500, this.level === 1 ? 520 : 2000);
    }

    public rebuild(): void {
        //
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
        const fontSize = this.level === 1 ? 106 : 148;
        if (this.title) {
            this.title.style.fontSize = fontSize;
            this.title.text = title;
        } else {
            this.title = new Text(title, { fill: 0x000000, fontSize, stroke: 0x000000, strokeThickness: 1 });
            this.title.anchor.set(0.5);
            this.title.position.set(750, -150);
            this.wordsContainer.addChild(this.title);
        }
    }

    private buildWords(words: WordModel[], level: number): void {
        if (this.wordsContainer && this.words.length !== 0) {
            this.wordsContainer.destroy();
            this.words.forEach((w) => w.destroy());
            this.words = [];
        }
        this.wordsContainer = new WordsContainer();
        this.words = words.map((word, i) => {
            const wordView = new WordView(word);
            wordView.y = i * 128 + 50;
            wordView.on('dragStart', (uuid) => this.onDragStart(uuid));
            this.wordsContainer.addChild(wordView);
            return wordView;
        });
        this.wordsContainer.position.set(0, this.height / 2);
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

    private onGameStateUpdate(state: GameState): void {
        //
    }
}
