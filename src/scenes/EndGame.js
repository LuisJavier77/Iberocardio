import Phaser from 'phaser'

import { Scenes, TitleScreen } from '../consts/SceneKeys'


export default class EndGame extends Phaser.Scene
{
    preload()
    {
        this.load.image('restart', 'src/assets/images/restart.png');
    }

    create()
    {
        this.add.text(960, 400, 'Has terminado.', { color: 'white', fontSize: '31px '})
        .setOrigin(0.5, 0.5);
        this.add.text(960, 450, 'Enhorabuena por tu actuación.', { color: 'white', fontSize: '31px '})
        .setOrigin(0.5, 0.5);
        this.add.text(960, 500, 'Esperamos que hayas aprendido y te hayas divertido.', { color: 'white', fontSize: '31px '})
        .setOrigin(0.5, 0.5);
        this.add.text(960, 600, 'Tu puntuación es: 150 puntos', { color: 'white', fontSize: '50px '}).setOrigin(0.5, 0.5);
        var restart = this.add.image(960, 800, 'restart').setInteractive({ useHandCursor: true });
        
        restart.on('pointerdown', function () {
            window.location.reload();     
        }, this);
    }
}