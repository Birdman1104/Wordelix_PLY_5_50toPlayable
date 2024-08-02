import { LEVELS_CONFIG } from '../configs/LevelsConfig';
import { LevelModel } from './LevelModel';
import { ObservableModel } from './ObservableModel';

export class BoardModel extends ObservableModel {
    private _level: LevelModel;
    private _currentLevel: number = 0;

    constructor() {
        super('BoardModel');

        this.makeObservable();
    }

    public get level(): LevelModel {
        return this._level;
    }

    public set level(value: LevelModel) {
        this._level = value;
    }

    public initialize(): void {
        const levelConfig = LEVELS_CONFIG[this._currentLevel]
        this.level = new LevelModel(levelConfig);
        this.level.initialize();
    }
}
