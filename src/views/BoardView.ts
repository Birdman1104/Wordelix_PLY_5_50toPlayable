import { lego } from '@armathai/lego';
import { Container } from 'pixi.js';
import { GameModelEvents } from '../events/ModelEvents';
import { GameState } from '../models/GameModel';

export class BoardView extends Container {
    constructor() {
        super();

        lego.event.on(GameModelEvents.StateUpdate, this.onGameStateUpdate, this);

        this.build();
    }

    get viewName() {
        return 'BoardView';
    }

    public rebuild(): void {
        //
    }

    private build(): void {
        //
    }

    private onGameStateUpdate(state: GameState): void {
        //
    }
}
