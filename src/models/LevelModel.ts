import { ObservableModel } from './ObservableModel';
import { WordModel } from './WordModel';

export class LevelModel extends ObservableModel {
    private _level: number;
    private _title: string;
    private _words: WordModel[] = [];

    constructor(config: LevelConfig) {
        super('LevelModel');
        this.level = config.level;
        this.title = config.title;
        this.words = config.words.map((wc: WordConfig) => {
            const wordModel = new WordModel(wc)
            wordModel.initialize();
            return wordModel;
        });
        this.makeObservable();
    }

    public get level(): number {
        return this._level;
    }

    public set level(value: number) {
        this._level = value;
    }

    public set title(value: string) {
        this._title = value;
    }

    public get title(): string {
        return this._title;
    }

    public get words(): WordModel[] {
        return this._words;
    }

    public set words(value: WordModel[]) {
        this._words = value;
    }

    public getWordModelByUuid(uuid: string): WordModel | undefined {
        return this.words.find((wordModel: WordModel) => wordModel.uuid === uuid);
    }

    public initialize(): void {
        //
    }
}
