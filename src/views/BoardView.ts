import { lego } from '@armathai/lego';
import { Container, Rectangle } from 'pixi.js';
import { BoardModelEvents, GameModelEvents } from '../events/ModelEvents';
import { GameState } from '../models/GameModel';
import { LevelModel } from '../models/LevelModel';
import { WordView } from './WordView';

export class BoardView extends Container {
    private words: WordView[] = [];

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
        return new Rectangle(-100, 0, 1500, 1400);
    }

    private build(): void {
        //
    }

    private onLevelUpdate(level: LevelModel): void {
        this.words = level.words.map((word, i) => {
            const wordView = new WordView(word);
            wordView.y = i * 128;
            wordView.on('dragStart', (uuid) => this.onDragStart(uuid));
            this.addChild(wordView);
            return wordView;
        });
    }

    private onDragStart(uuid: string): void {
        const word = this.words.find((word) => word.uuid === uuid);
        if (word) {
            this.removeChild(word);
            this.addChild(word);
        }
    }

    private onGameStateUpdate(state: GameState): void {
        //
    }
}
