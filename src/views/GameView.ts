import { lego } from '@armathai/lego';
import { ICellConfig, PixiGrid } from '@armathai/pixi-grid';
import { Graphics } from 'pixi.js';
import { CARD_HEIGHT, CARD_WIDTH, GENERATED_TEXTURES, INPUT_HEIGHT, INPUT_WIDTH } from '../configs/constants';
import { getGameViewGridConfig } from '../configs/gridConfigs/GameViewGC';
import { GameModelEvents, HintModelEvents } from '../events/ModelEvents';
import { BoardModel } from '../models/BoardModel';
import { HintState } from '../models/HintModel';
import { BoardView } from './BoardView';

export class GameView extends PixiGrid {
    private board: BoardView;

    constructor() {
        super();

        lego.event
            .on(GameModelEvents.BoardUpdate, this.onBoardUpdate, this)
            .on(HintModelEvents.StateUpdate, this.onHintStateUpdate, this);
        this.build();
    }

    public getGridConfig(): ICellConfig {
        return getGameViewGridConfig();
    }

    public update(): void {
        //
    }

    public rebuild(config?: ICellConfig | undefined): void {
        super.rebuild(this.getGridConfig());
    }

    private build(): void {
        const gr = new Graphics();
        // gray card bkg
        gr.lineStyle(3, 0x808080, 1);
        gr.beginFill(0xffffff);
        gr.drawRoundedRect(0, 0, CARD_WIDTH, CARD_HEIGHT, 10);
        gr.endFill();
        GENERATED_TEXTURES.cardBkgMain = window.game.renderer.generateTexture(gr);

        gr.clear();

        // blue card bkg
        gr.lineStyle(3, 0x0237a1, 1);
        gr.beginFill(0xffffff);
        gr.drawRoundedRect(0, 0, CARD_WIDTH, CARD_HEIGHT, 10);
        gr.endFill();

        GENERATED_TEXTURES.cardBkgSelected = window.game.renderer.generateTexture(gr);

        gr.clear();

        // input area

        gr.lineStyle(5, 0x000000, 1);
        gr.beginFill(0xffffff);
        gr.drawRoundedRect(0, 0, INPUT_WIDTH, INPUT_HEIGHT, 10);
        gr.endFill();
        GENERATED_TEXTURES.inputArea = window.game.renderer.generateTexture(gr);

        gr.destroy();
    }

    private onHintStateUpdate(state: HintState): void {
        //
    }

    private onBoardUpdate(board: BoardModel | null): void {
        board ? this.buildBoard() : this.destroyBoard();
    }

    private buildBoard() {
        this.board = new BoardView();
        this.setChild('board', this.board);
    }

    private destroyBoard(): void {
        this.board.destroy();
    }
}
