class SoundControl {
    private sounds: any;
    public constructor() {
        this.sounds = {};
    }

    public loadSounds(): void {
        // this.sounds.click = new Howl({ src: click });
    }

    private playClick(): void {
        this.sounds.click.play();
    }
}

const SoundController = new SoundControl();
export default SoundController;
