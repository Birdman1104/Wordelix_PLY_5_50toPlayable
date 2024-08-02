export const AdModelEvents = {
    StatusUpdate: 'AdModelStatusUpdate',
    CtaUpdate: 'AdModelCtaUpdate',
    SoundUpdate: 'AdModelSoundUpdate',
    HintUpdate: 'AdModelHintUpdate',
};

export const BoardModelEvents = {
    ActiveCardUpdate: 'BoardModelActiveCardUpdate',
    CardsUpdate: 'BoardModelCardsUpdate',
    TypedTextUpdate: 'BoardModelTypedTextUpdate',
    IsGameOverUpdate: 'BoardModelIsGameOverUpdate',
};

export const CardModelEvents = {
    AnswersRemainingUpdate: 'CardModelAnswersRemainingUpdate',
    CompletedUpdate: 'CardModelCompletedUpdate',
    InteractivityUpdate: 'CardModelInteractivityUpdate',
};

export const CtaModelEvents = { VisibleUpdate: 'CtaModelVisibleUpdate' };

export const GameModelEvents = {
    StateUpdate: 'GameModelStateUpdate',
    IsTutorialUpdate: 'GameModelIsTutorialUpdate',
    BoardUpdate: 'GameModelBoardUpdate',
};

export const HeadModelEvents = { GameModelUpdate: 'HeadModelGameModelUpdate', AdUpdate: 'HeadModelAdUpdate' };

export const HintModelEvents = { StateUpdate: 'HintModelStateUpdate', VisibleUpdate: 'HintModelVisibleUpdate' };

export const SoundModelEvents = { StateUpdate: 'SoundModelStateUpdate' };
