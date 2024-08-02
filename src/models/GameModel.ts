import { BoardModel } from './BoardModel';
import { ObservableModel } from './ObservableModel';

export enum GameState {
    Unknown = 'Unknown',
    Idle = 'Idle',
}

export class GameModel extends ObservableModel {
    private _state: GameState = GameState.Unknown;
    private _board: BoardModel | null = null;
    private _isTutorial: boolean = false;

    constructor() {
        super('GameModel');

        this._state = GameState.Unknown;
        this.makeObservable();
    }

    get state(): GameState {
        return this._state;
    }

    set state(value: GameState) {
        this._state = value;
    }

    get isTutorial(): boolean {
        return this._isTutorial;
    }

    set isTutorial(value: boolean) {
        this._isTutorial = value;
    }

    get board(): BoardModel | null {
        return this._board;
    }

    set board(value: BoardModel) {
        this._board = value;
    }

    public setState(state: GameState): void {
        this._state = state;
    }

    public turnOffTutorialMode(): void {
        this._isTutorial = false;
    }

    public initialize(): void {
        this._state = GameState.Idle;
        this._isTutorial = true;
        this._board = new BoardModel();
        this._board.initialize();
    }

    public destroy(): void {
        this._board?.destroy();
        this._board = null;
    }
}
