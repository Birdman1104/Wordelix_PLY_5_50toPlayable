import { GAME_CONFIG } from '../configs/GameConfig';
import { delayRunnable, removeRunnable } from '../utils';
import { CtaModel } from './CtaModel';
import { HintModel } from './HintModel';
import { ObservableModel } from './ObservableModel';
import { SoundModel } from './SoundModel';

export const enum AdStatus {
    Unknown,
    Game,
    PreCta,
    Cta,
}

export class AdModel extends ObservableModel {
    private _cta: CtaModel | null = null;
    private _sound: SoundModel | null = null;
    private _hint: HintModel | null = null;
    private _status: AdStatus = AdStatus.Unknown;

    private idleTimer: any;

    public constructor() {
        super('AdModel');

        this.makeObservable();
    }

    get status(): AdStatus {
        return this._status;
    }

    set status(value: AdStatus) {
        this._status = value;
    }

    get cta(): CtaModel | null {
        return this._cta;
    }

    set cta(value: CtaModel | null) {
        this._cta = value;
    }

    get sound(): SoundModel | null {
        return this._sound;
    }

    set sound(value: SoundModel | null) {
        this._sound = value;
    }

    get hint(): HintModel | null {
        return this._hint;
    }

    set hint(value: HintModel | null) {
        this._hint = value;
    }

    public setAdStatus(status: AdStatus): void {
        this._status = status;
    }

    // CTA
    public initializeCtaModel(): void {
        this._cta = new CtaModel();
        this._cta.initialize();
    }

    public destroyCtaModel(): void {
        this._cta?.destroy();
        this._cta = null;
    }

    // HINT
    public initializeHintModel(): void {
        this._hint = new HintModel();
        this._hint.initialize();
    }

    public destroyHintModel(): void {
        this._hint?.destroy();
        this._hint = null;
    }

    // SOUND;
    public initializeSoundModel(): void {
        this._sound = new SoundModel();
        this._sound.initialize();
    }

    public destroySoundModel(): void {
        this._sound?.destroy();
        this._sound = null;
    }

    public startIdleTimer(): void {
        this.idleTimer = delayRunnable(
            GAME_CONFIG.IdleTime,
            () => {
                this._status = AdStatus.Cta;
            },
            this,
        );
    }

    public stopIdleTimer(): void {
        removeRunnable(this.idleTimer);
        this.idleTimer = null;
    }
}
