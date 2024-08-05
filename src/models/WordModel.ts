import { LetterModel } from './LetterModel';
import { ObservableModel } from './ObservableModel';

export class WordModel extends ObservableModel {
    private _mess: string;
    private _answer: string;
    private _letters: LetterModel[] = [];
    private _solved: boolean = false;

    constructor(config: WordConfig) {
        super('WordModel');

        this._mess = config.mess;
        this._answer = config.answer;

        this.makeObservable();
    }

    public get mess(): string {
        return this._mess;
    }

    public get answer(): string {
        return this._answer;
    }

    public get letters(): LetterModel[] {
        return this._letters;
    }

    public set letters(value: LetterModel[]) {
        this._letters = value;
    }

    public get solved(): boolean {
        return this._solved;
    }

    public set solved(value: boolean) {
        this._solved = value;
    }

    public initialize(): void {
        this._letters = this._mess.split('').map((letter: string) => new LetterModel(letter.toUpperCase()));
    }

    public setSolved(): void {
        this.solved = true;
    }
    
    public checkAnswer(): boolean {
        // return this._answer === answer;
        return false
    }
}
