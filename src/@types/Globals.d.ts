interface Window {
    game: any;
    gameStart_: boolean;
    createGame: () => void;
    installCTA: () => void;
    gameReadyCall: () => void;
    soundMute: (value: boolean) => void;
}

type AssetNameAndPath = {
    name: string;
    path: string;
};

declare namespace GlobalMixins {
    interface DisplayObjectEvents {
        hideComplete: [string];
        showComplete: [string];
        click: [string];
    }
}

type SpriteConfig = {
    texture: string;
    tint?: number;
    scale?: PIXI.Point;
    anchor?: PIXI.Point;
    position?: PIXI.Point;
};

type CardConfig = {
    question: string;
    answers: string[];
};
