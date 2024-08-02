export const AdModelEvents = {
    StatusUpdate: 'AdModelStatusUpdate',
    CtaUpdate: 'AdModelCtaUpdate',
    SoundUpdate: 'AdModelSoundUpdate',
    HintUpdate: 'AdModelHintUpdate',
};

export const BoardModelEvents = { LevelUpdate: 'BoardModelLevelUpdate' };

export const CtaModelEvents = { VisibleUpdate: 'CtaModelVisibleUpdate' };

export const GameModelEvents = {
    StateUpdate: 'GameModelStateUpdate',
    IsTutorialUpdate: 'GameModelIsTutorialUpdate',
    BoardUpdate: 'GameModelBoardUpdate',
};

export const HeadModelEvents = { GameModelUpdate: 'HeadModelGameModelUpdate', AdUpdate: 'HeadModelAdUpdate' };

export const HintModelEvents = { StateUpdate: 'HintModelStateUpdate', VisibleUpdate: 'HintModelVisibleUpdate' };

export const LetterModelEvents = {
    LetterUpdate: 'LetterModelLetterUpdate',
    IsInRightSpotUpdate: 'LetterModelIsInRightSpotUpdate',
};

export const LevelModelEvents = {
    LevelUpdate: 'LevelModelLevelUpdate',
    TitleUpdate: 'LevelModelTitleUpdate',
    WordsUpdate: 'LevelModelWordsUpdate',
};

export const SoundModelEvents = { StateUpdate: 'SoundModelStateUpdate' };

export const WordModelEvents = { LettersUpdate: 'WordModelLettersUpdate' };
