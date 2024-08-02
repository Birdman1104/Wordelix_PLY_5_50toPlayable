import '../styles/index.scss';
import App from './App';

window.soundMute = (value) => {
    window.game.soundMute(value);
};

window.createGame = () => {
    window.game = new App();
    window.game.init();

    window.addEventListener('resize', () => window.game.appResize());
    window.addEventListener('orientationchange', () => window.game.appResize());
    window.addEventListener('focus', () => window.game.onFocusChange(true));
    window.addEventListener('blur', () => window.game.onFocusChange(false));
};
