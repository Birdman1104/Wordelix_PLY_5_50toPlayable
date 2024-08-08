import { lego } from '@armathai/lego';
import { AdStatus } from '../models/AdModel';
import { GameState } from '../models/GameModel';
import Head from '../models/HeadModel';
import { HintState } from '../models/HintModel';
import { unMapCommands } from './EventCommandPairs';
import {
    ctaModelGuard,
    gameModelGuard,
    hintModelGuard,
    hintParamGuard,
    isCurrentLevelCompleteGuard,
    isGameOverGuard,
    soundParamGuard,
} from './Guards';

export const initAdModelCommand = (): void => Head.initializeADModel();

export const onMainViewReadyCommand = (): void => {
    lego.command
        //
        .execute(initAdModelCommand)

        .payload(AdStatus.Game)
        .execute(setAdStatusCommand);
};

const initializeGameModelCommand = (): void => Head.initializeGameModel();
const initializeCtaModelCommand = (): void => Head.ad?.initializeCtaModel();
const initializeSoundModelCommand = (): void => Head.ad?.initializeSoundModel();
const initializeHintModelCommand = (): void => Head.ad?.initializeHintModel();

const setHintStateCommand = (state: HintState): void => Head.ad?.hint?.setState(state);
const startHintVisibilityTimerCommand = (time?: number): void => Head.ad?.hint?.startVisibilityTimer(time);
const stopHintVisibilityTimerCommand = (): void => Head.ad?.hint?.stopVisibilityTimer();

const initializeModelsCommand = (): void => {
    lego.command

        .execute(initializeGameModelCommand)

        .execute(initializeCtaModelCommand)

        .guard(soundParamGuard)
        .execute(initializeSoundModelCommand)

        .guard(hintParamGuard)
        .execute(initializeHintModelCommand)

        .guard(hintParamGuard)
        .execute(startHintVisibilityTimerCommand);
};

const hideHintCommand = (): void => {
    lego.command.payload(false).execute(setHintVisibleCommand);
};

const setHintVisibleCommand = (value: boolean): void => {
    Head.ad?.hint?.setVisibility(value);
};

const destroyGameModelCommand = (): void => Head.destroyGameModel();
const destroyCtaModelCommand = (): void => Head.ad?.destroyCtaModel();
const destroySoundModelCommand = (): void => Head.ad?.destroySoundModel();
const destroyHintModelCommand = (): void => Head.ad?.destroyHintModel();
const setAdStatusCommand = (status: AdStatus): void => Head.ad?.setAdStatus(status);

const shutdownModelsCommand = (): void => {
    lego.command

        .guard(gameModelGuard)
        .execute(destroyGameModelCommand)

        .guard(ctaModelGuard)
        .execute(destroyCtaModelCommand)

        .guard(soundParamGuard)
        .execute(destroySoundModelCommand)

        .guard(hintModelGuard)
        .execute(destroyHintModelCommand);
};

export const onAdStatusUpdateCommand = (status: AdStatus): void => {
    switch (status) {
        case AdStatus.Game:
            lego.command
                //
                .execute(initializeModelsCommand);

            break;
        case AdStatus.PreCta:
            lego.command
                //
                .execute(unMapCommands)

                .guard(hintModelGuard)
                .execute(destroyHintModelCommand);
            break;
        case AdStatus.Cta:
            // lego.command.guard(gameModelGuard).execute(destroyGameModelCommand);
            lego.command
                //
                // .execute(takeToStoreCommand)
                .execute(showCtaCommand);

            break;
        default:
            break;
    }
};

const setGameStateCommand = (state: GameState): void => Head.gameModel?.setState(state);
const showCtaCommand = (): void => Head.ad?.cta?.show();

const turnOffTutorialModeCommand = (): void => Head.gameModel?.turnOffTutorialMode();

export const onWordSolvedCommand = (uuid: string): void => {
    lego.command
        .payload(uuid)
        .execute(setWordToSolvedCommand)

        .execute(increaseWordsSolvedCommand)

        .execute(turnOffTutorialModeCommand)

        .guard(hintModelGuard)
        .execute(destroyHintModelCommand)

        .guard(isGameOverGuard)
        .payload(AdStatus.Cta)
        .execute(setAdStatusCommand)

        .guard(isCurrentLevelCompleteGuard)
        .execute(switchToNextLevelCommand);
};

const setWordToSolvedCommand = (uuid: string): void => {
    Head.gameModel?.board?.getWordModelByUuid(uuid)?.setSolved();
};

const increaseWordsSolvedCommand = (): void => {
    Head.gameModel?.board?.increaseWordsSolved();
};

const switchToNextLevelCommand = (): void => {
    Head.gameModel?.board?.switchToNextLevel();
};

export const onGameStateUpdateCommand = (state: GameState): void => {
    switch (state) {
        case GameState.Idle:
            //
            break;

        default:
            break;
    }
};

export const onDragStartCommand = (): void => {
    lego.command
        //
        .guard(hintModelGuard)
        .execute(hideHintCommand)

        .guard(hintModelGuard)
        .execute(stopHintVisibilityTimerCommand);
};

export const onDragCompleteCommand = (): void => {
    lego.command
        //
        .guard(hintModelGuard)
        .execute(startHintVisibilityTimerCommand);
};

export const restartHintCommand = (): void => {
    lego.command
        //
        .guard(hintModelGuard)
        .execute(hideHintCommand)

        .guard(hintModelGuard)
        .execute(stopHintVisibilityTimerCommand)

        .guard(hintModelGuard)
        .execute(startHintVisibilityTimerCommand);
};

export const resizeCommand = (): void => {
    lego.command.execute(restartHintCommand);
};

export const takeToStoreCommand = (): void => {
    console.warn('TAKE ME TO STORE');
    
    window.installCTA && window.installCTA();
};
