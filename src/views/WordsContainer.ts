import { Container, Rectangle } from "pixi.js";


export class WordsContainer extends Container {
  public level = 1
    constructor() {
        super();
    }

    getBounds(skipUpdate?: boolean | undefined, rect?: PIXI.Rectangle | undefined): PIXI.Rectangle {
        return new Rectangle(0, 0, 1500, this.level === 1 ? 520 : 1400);
    }
}