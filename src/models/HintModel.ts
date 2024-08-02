import { GAME_CONFIG } from '../configs/GameConfig';
import { delayRunnable, removeRunnable } from '../utils';
import { ObservableModel } from './ObservableModel';

export enum HintState {
    Card,
    Letter,
    Disabled,
}
export class HintModel extends ObservableModel {
    private _visible: boolean;
    private _state: HintState;
    private visibilityTimer: any;

    public constructor() {
        super('HintModel');

        this._visible = false;
        this.makeObservable();
    }

    get visible(): boolean {
        return this._visible;
    }

    get state(): HintState {
        return this._state;
    }

    set state(state: HintState) {
        this._state = state;
    }

    set visible(value: boolean) {
        this._visible = value;
        this.stopVisibilityTimer();
    }

    public setState(state: HintState): void {
        this._state = state;
    }

    public destroy(): void {
        this.stopVisibilityTimer();
    }

    public setVisibility(value: boolean): void {
        this.visible = value;
    }

    public startVisibilityTimer(time?: number): void {
        this.visibilityTimer = delayRunnable(time || GAME_CONFIG.HintOnIdle, () => (this._visible = true), this);
    }

    public stopVisibilityTimer(): void {
        removeRunnable(this.visibilityTimer);
        this.visibilityTimer = null;
    }
}
