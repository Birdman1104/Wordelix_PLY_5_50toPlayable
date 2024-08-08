export enum BoundsType {
    SQUARE = 'square',
    LINE = 'line',
    NONE = 'none',
}

export const GAME_CONFIG = Object.freeze({
    HintOnIdle: 1, // Seconds
    Hint: true,
    Sound: true,

    // Параметры для разных версий
    // 1word
    // wordsFromSecondLevel: 1,
    // bounds: BoundsType.NONE,
    
    // 2word
    // wordsFromSecondLevel: 2,
    // bounds: BoundsType.NONE,
    
    // 3word
    // wordsFromSecondLevel: 3,
    // bounds: BoundsType.NONE,
    
    // line_1word
    // wordsFromSecondLevel: 1,
    // bounds: BoundsType.LINE,
    
    // line_2word
    // wordsFromSecondLevel: 2,
    // bounds: BoundsType.LINE,
    
    // line_3word
    // wordsFromSecondLevel: 3,
    // bounds: BoundsType.LINE,
    
    // square_1word
    // wordsFromSecondLevel: 1,
    // bounds: BoundsType.SQUARE,
    
    // square_2word
    // wordsFromSecondLevel: 2,
    // bounds: BoundsType.SQUARE,
    
    // square_3word
    wordsFromSecondLevel: 3,
    bounds: BoundsType.SQUARE,

});

export const DEFAULT_FONT = 'Arial';
