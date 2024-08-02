import { ObservableModel } from './ObservableModel';

export enum SoundState {
    Unknown,
    On,
    Off,
}

export class SoundModel extends ObservableModel {
    private _state: SoundState;

    public constructor() {
        super('SoundModel');

        this._state = SoundState.Unknown;
        this.makeObservable();
    }

    get state(): SoundState {
        return this._state;
    }

    set state(value: SoundState) {
        this._state = value;
    }

    public initialize(): void {
        this._state = SoundState.On;
    }
}
