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
        return new Rectangle(0, 0, 1500, 1400);
    }

    private build(): void {
        //
    }

    private onLevelUpdate(level: LevelModel): void {
        this.buildWords(level.words);
        this.buildTitle(level.title);
    }

    private buildTitle(title: string): void {
        if (this.title) {
            this.title.text = title;
        } else {
            this.title = new Text(title, { fill: 0x000000, fontSize: 72, stroke: 0x000000, strokeThickness: 1 });
            this.title.anchor.set(0.5);
            this.title.position.set(750, 200);
            this.addChild(this.title);
        }
    }

    private buildWords(words: WordModel[]): void {
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
