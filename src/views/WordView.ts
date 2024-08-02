import { Container } from "pixi.js";
import { WordModel } from "../models/WordModel";
import { LetterView } from "./LetterView";

export class WordView extends Container {
    private letters: LetterView[] = []; 
    
    constructor(private config: WordModel) {
        super();
        this.build();
    }

    get viewName() {
        return 'WordView';
    }

    public rebuild(): void {
        //
    }

    private build(): void {
        this.letters = this.config.letters.map((letter,i) => {
            const letterView = new LetterView(letter)
            letterView.x = i * letterView.width;
            this.addChild(letterView);
            return letterView;
        });
    }
}