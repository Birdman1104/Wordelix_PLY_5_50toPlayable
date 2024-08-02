import { ObservableModel } from './ObservableModel';

export class BoardModel extends ObservableModel {
    constructor() {
        super('BoardModel');

        this.makeObservable();
    }

    public initialize(): void {
        //
    }
}
