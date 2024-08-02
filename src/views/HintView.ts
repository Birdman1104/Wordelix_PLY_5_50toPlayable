import { lego } from '@armathai/lego';
import anime from 'animejs';
import { Container, Point, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { GameModelEvents, HintModelEvents } from '../events/ModelEvents';
import { GameState } from '../models/GameModel';
import { getViewByProperty, makeSprite } from '../utils';

export class HintView extends Container {
    private hand: Sprite;
    private hintPositions: Point[] = [];
    private currentPoint = 0;
    private isTyping = false;

    constructor() {
        super();

        lego.event
            .on(HintModelEvents.VisibleUpdate, this.onHintVisibleUpdate, this)
            .on(GameModelEvents.StateUpdate, this.onGameStateUpdate, this);

        this.build();
        this.hide();
    }

    get viewName() {
        return 'HintView';
    }

    public destroy(): void {
        this.removeTweens();
        lego.event.off(HintModelEvents.VisibleUpdate, this.onHintVisibleUpdate, this);
        lego.event.off(GameModelEvents.StateUpdate, this.onGameStateUpdate, this);

        super.destroy();
    }

    private onGameStateUpdate(state: GameState): void {
        this.isTyping = state === GameState.Typing;
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
        this.hand.alpha = 1;
        this.hand.position.set(point.x, point.y);
        this.hand.angle = 0;
        this.hand.visible = true;

        this.pointHand();
    }

    private pointHand(): void {
        anime({
            targets: this.hand.scale,
            x: 0.6,
            y: 0.6,
            duration: 500,
            easing: 'easeInOutCubic',
            direction: 'alternate',
            complete: () => {
                this.currentPoint += 1;
                this.currentPoint = this.hintPositions.length % this.currentPoint;
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
            complete: () => this.pointHand(),
        });
    }

    private removeTweens(): void {
        anime.remove(this.hand);
        anime.remove(this.hand.scale);
    }

    private getHintPosition(): Point[] {
        return [new Point(0, 0)];
    }

    private getCardHintPositions() {
        const board = getViewByProperty('viewName', 'BoardView');
        const boardPos = board.getHintPosition();
        const pos = this.toLocal(boardPos);
        return [pos];
    }

    private getKeyHintPositions() {
        const keyboardView = getViewByProperty('viewName', 'KeyboardView');
        const keyPos = keyboardView.getHintPosition();
        const pos = this.toLocal(keyPos);
        return [pos];
    }
}
