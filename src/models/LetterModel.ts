import { ObservableModel } from "./ObservableModel";

export class LetterModel extends ObservableModel {
    private _isInRightSpot: boolean = false;
    
    constructor(private _letter: string) {
        super('LetterModel');

        this.makeObservable();
    }

    public get letter(): string {
        return this._letter;
    }

    public set letter(value: string) {
        this._letter = value;
    }

    public get isInRightSpot(): boolean {
        return this._isInRightSpot;
    }

    public set isInRightSpot(value: boolean) {
        this._isInRightSpot = value;
    }

    public initialize(): void {
        //
    }
}