export class DropDownAreaInfo {
    public startX: number;
    public startY: number;
    public endX: number;
    public endY: number;
    public centerX: number;
    public centerY: number;
    public isFree: boolean;
    public answer: string;
    public insertedLetter: string;

    constructor(info) {
        this.startX = info.startX;
        this.startY = info.startY;
        this.endX = info.endX;
        this.endY = info.endY;
        this.centerX = info.centerX;
        this.centerY = info.centerY;
        this.isFree = info.isFree;
        this.answer = info.answer;
    }

    public setLetter(letter: string): void {
        this.insertedLetter = letter;
        this.isFree = false;
    }
}