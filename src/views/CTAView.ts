import { lego } from '@armathai/lego';
import { ICellConfig, PixiGrid } from '@armathai/pixi-grid';
import anime from 'animejs';
import { Graphics } from 'pixi.js';
import { Images } from '../assets';
import { getCTAGridConfig } from '../configs/gridConfigs/CTAViewGC';
import { TakeMe } from '../events/MainEvents';
import { CtaModelEvents } from '../events/ModelEvents';
import { isAppleDevice, makeSprite } from '../utils';

export class CTAView extends PixiGrid {
    private blocker: Graphics;

    constructor() {
        super();

        lego.event.on(CtaModelEvents.VisibleUpdate, this.visibleUpdate, this);
        this.build();
    }

    public getGridConfig(): ICellConfig {
        return getCTAGridConfig();
    }

    public rebuild(config?: ICellConfig | undefined): void {
        super.rebuild(this.getGridConfig());
    }

    private build(): void {
        this.blocker = new Graphics();
        this.blocker.beginFill(0x000000, 1);
        this.blocker.drawRect(0, 0, 10, 10);
        this.blocker.endFill();
        this.blocker.alpha = 0;
        this.setChild('blocker', this.blocker);
    }

    private visibleUpdate(visible: boolean): void {
        if (isAppleDevice()) {
            this.blocker.interactive = true;
            this.blocker.alpha = 0.7;
            this.buildPackShot();
        } else {
            this.blocker.interactive = true;
            this.blocker.alpha = 0.5;
            this.blocker.on('pointerdown', () => {
                lego.event.emit(TakeMe.ToStore);
            });
        }
    }

    private buildPackShot(): void {
        const logo = makeSprite({ texture: Images['game/logo'] });
        logo.interactive = true;
        logo.on('pointerdown', () => {
            lego.event.emit(TakeMe.ToStore);
        });
        this.setChild('logo', logo);

        const name = makeSprite({ texture: Images['game/wordelix'] });
        this.setChild('name', name);

        const button = makeSprite({ texture: Images['game/cta_button'] });
        button.interactive = true;
        button.on('pointerdown', () => {
            lego.event.emit(TakeMe.ToStore);
        });
        this.setChild('button', button);

        const ls = logo.scale.x;
        const bs = button.scale.x;
        const ns = name.scale.x;

        logo.scale.set(0);
        button.scale.set(0);
        name.scale.set(0);

        anime({
            targets: button.scale,
            x: bs,
            y: bs,
            duration: 200,
            easing: 'easeInOutSine',
        });
        anime({
            targets: logo.scale,
            x: ls,
            y: ls,
            duration: 200,
            easing: 'easeInOutSine',
            complete: () => {
                anime({
                    targets: button.scale,
                    x: [bs, bs * 1.1, bs],
                    y: [bs, bs * 1.1, bs],
                    duration: 500,
                    easing: 'easeInOutSine',
                    directions: 'alternate',
                    loop: true,
                });
            },
        });
        anime({
            targets: name.scale,
            x: ns,
            y: ns,
            duration: 200,
            easing: 'easeInOutSine',
        });
    }
}
