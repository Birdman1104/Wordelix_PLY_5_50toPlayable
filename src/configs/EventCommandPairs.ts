import { lego } from '@armathai/lego';
import { MainGameEvents, TakeMe, WordViewEvents } from '../events/MainEvents';
import { AdModelEvents, GameModelEvents } from '../events/ModelEvents';
import {
    onAdStatusUpdateCommand,
    onDragCompleteCommand,
    onDragStartCommand,
    onGameStateUpdateCommand,
    onMainViewReadyCommand,
    onWordSolvedCommand,
    resizeCommand,
    takeToStoreCommand
} from './Commands';

export const mapCommands = () => {
    eventCommandPairs.forEach(({ event, command }) => {
        lego.event.on(event, command);
    });
};

export const unMapCommands = () => {
    eventCommandPairs.forEach(({ event, command }) => {
        lego.event.off(event, command);
    });
};

const eventCommandPairs = Object.freeze([
    {
        event: MainGameEvents.MainViewReady,
        command: onMainViewReadyCommand,
    },
    {
        event: AdModelEvents.StatusUpdate,
        command: onAdStatusUpdateCommand,
    },
    {
        event: GameModelEvents.StateUpdate,
        command: onGameStateUpdateCommand,
    },
    {
        event: WordViewEvents.Solved,
        command: onWordSolvedCommand,
    },
    {
        event: WordViewEvents.DragStart,
        command: onDragStartCommand,
    },
    {
        event: WordViewEvents.DragComplete,
        command: onDragCompleteCommand,
    },
    {
        event: MainGameEvents.Resize,
        command: resizeCommand,
    },
    {
        event: TakeMe.ToStore,
        command: takeToStoreCommand,
    },
]);
