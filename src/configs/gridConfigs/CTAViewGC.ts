import { CellScale } from '@armathai/pixi-grid';
import { lp } from '../../utils';

export const getCTAGridConfig = () => {
    return lp(getCTAGridLandscapeConfig, getCTAGridPortraitConfig).call(null);
};

const getCTAGridLandscapeConfig = () => {
    const bounds = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
    return {
        name: 'mainCell',
        debug: { color: 0xff5027 },
        bounds,
        cells: [
            {
                name: 'blocker',
                scale: CellScale.fill,
                bounds: { x: 0, y: 0, width: 1, height: 1 },
            },
            {
                name: 'logo',
                bounds: { x: 0.3, y: 0.15, width: 0.4, height: 0.4 },
            },
            {
                name: 'name',
                bounds: { x: 0.35, y: 0.575, width: 0.3, height: 0.15 },
            },
            {
                name: 'button',
                bounds: { x: 0.35, y: 0.725, width: 0.3, height: 0.2 },
            },
        ],
    };
};

const getCTAGridPortraitConfig = () => {
    const bounds = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
    return {
        name: 'mainCell',
        debug: { color: 0xff5027 },
        bounds,
        cells: [
            {
                name: 'blocker',
                scale: CellScale.fill,
                bounds: { x: 0, y: 0, width: 1, height: 1 },
            },
            {
                name: 'logo',
                bounds: { x: 0.3, y: 0.2, width: 0.4, height: 0.4 },
            },
            {
                name: 'name',
                bounds: { x: 0.3, y: 0.575, width: 0.4, height: 0.2 },
            },
            {
                name: 'button',
                bounds: { x: 0.35, y: 0.725, width: 0.3, height: 0.2 },
            },
        ],
    };
};
