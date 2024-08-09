import { lego } from '@armathai/lego';
import anime from 'animejs';
import { Container, Point, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { HintModelEvents } from '../events/ModelEvents';
import { getViewByProperty, makeSprite } from '../utils';
import { DummyLetterView } from './DummyLetterView';

export class HintView extends Container {
    private hand: Sprite;
    private hintPositions: Point[] = [];
    private currentPoint = 0;
    private letter: string;
    private dummyLetter: DummyLetterView | null;

    constructor() {
        super();

        lego.event.on(HintModelEvents.VisibleUpdate, this.onHintVisibleUpdate, this);

        this.build();
        this.hide();
    }

    get viewName() {
        return 'HintView';
    }

    public destroy(): void {
        this.removeTweens();
        lego.event.off(HintModelEvents.VisibleUpdate, this.onHintVisibleUpdate, this);

        super.destroy();
    }

    private onHintVisibleUpdate(visible: boolean): void {
        visible ? this.show() : this.hide();
    }

    private build(): void {
        this.hand = makeSprite({ texture: Images['game/hand'] });
        this.hand.anchor.set(0);
        this.addChild(this.hand);
    }

    private show(): void {
        this.removeTweens();
        this.hintPositions = this.getHintPosition();
        this.currentPoint = 0;

        this.showFirstTime();
    }

    private hide(): void {
        this.removeTweens();
        this.hand.visible = false;
    }

    private showFirstTime(): void {
        const point = this.hintPositions[this.currentPoint];
        this.hand.scale.set(0.8);
        this.hand.alpha = 0;
        this.hand.position.set(point.x, point.y);
        this.hand.angle = 0;
        this.hand.visible = true;

        this.pointHand();
    }

    private pointHand(): void {
        anime({
            targets: this.hand,
            alpha: 1,
            duration: 500,
            easing: 'easeInOutCubic',
        })
        anime({
            targets: this.hand.scale,
            x: 0.6,
            y: 0.6,
            duration: 500,
            easing: 'easeInOutCubic',
            complete: () => {
                this.currentPoint += 1;
                if (this.currentPoint >= this.hintPositions.length) {
                    this.currentPoint = 0;
                }
                if (this.currentPoint === 1) {
                    const bw = getViewByProperty('viewName', 'BoardView');
                    this.dummyLetter = new DummyLetterView(this.letter);
                    this.dummyLetter.position.set(-300, -300)
                    this.dummyLetter.scale.set(bw.scale.x, bw.scale.y);
                    this.addChild(this.dummyLetter);
                    this.removeChild(this.hand);
                    this.addChild(this.hand);
                }
                this.moveHand(this.hintPositions[this.currentPoint]);
            },
        });
    }

    private moveHand(pos): void {
        anime({
            targets: this.hand,
            x: pos.x,
            y: pos.y,
            duration: 500,
            easing: 'easeInOutCubic',
            complete: () => this.scaleUp(),
            update: () => {
                if (this.dummyLetter) {
                    this.dummyLetter.position.set(this.hand.x, this.hand.y);
                }
            },
        });
    }

    private scaleUp(): void {
        anime({
            targets: this.hand.scale,
            x: 0.8,
            y: 0.8,
            duration: 500,
            easing: 'easeInOutCubic',
        });
        anime({
            targets: [this.hand, this.dummyLetter],
            alpha: 0,
            duration: 500,
            easing: 'easeInOutCubic',
            complete: () => {
                this.currentPoint++
                if (this.currentPoint >= this.hintPositions.length) {
                    this.currentPoint = 0;
                }
                const point = this.hintPositions[this.currentPoint];
                this.hand.scale.set(0.8);
                this.hand.alpha = 0;
                this.hand.position.set(point.x, point.y);
                if(this.dummyLetter) {
                    this.removeChild(this.dummyLetter);
                    this.dummyLetter.destroy()
                    this.dummyLetter = null;
                };

                this.pointHand()
            }
        });
    }

    private removeTweens(): void {
        anime.remove(this.hand);
        anime.remove(this.hand.scale);
        anime.remove(this.dummyLetter);
        if(this.dummyLetter) {
            this.removeChild(this.dummyLetter);
            this.dummyLetter.destroy()
            this.dummyLetter = null;
        };
    }

    private getHintPosition(): Point[] {
        const bw = getViewByProperty('viewName', 'BoardView');
        const wordView = bw.getFirstWord();
        if (!wordView) return [new Point(0, 0)];
        const { positions, letter } = wordView.getHintPositions();

        this.letter = letter;
        return positions;
    }
}
