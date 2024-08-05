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
    public insertedLetterId: string;

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

    public setLetter(letter: string, uuid: string): void {
        this.insertedLetter = letter;
        this.insertedLetterId = uuid;
        this.isFree = false;
    }

    public empty(): void {
        this.insertedLetter = '';
        this.insertedLetterId = '';
        this.isFree = true;
    }
}