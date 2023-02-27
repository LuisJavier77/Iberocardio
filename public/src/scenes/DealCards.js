import Phaser from 'phaser';

import { cardGame, Scenes, EscenaSupuesto } from '../consts/SceneKeys';


export default class DealCards extends Phaser.Scene
{
    preload()
    {

    }

    create()
    {
        var appElement = document.getElementById('app');
        var canvas = document.querySelector('canvas');
        var div = appElement.getElementsByTagName('div')[0];

        div.style.width = canvas.style.width;
        div.style.height = canvas.style.height;

        const textCards = this.add.text(960, 540, 'Reparta las cartas a los jugadores', {
            fontSize: 50,
        })
        textCards.setOrigin(0.5, 0.5);
        const textCards2 = this.add.text(960, 640, '(INSTRUCCIONES DEL JUEGO)',{
            fontSize: 50,
        })
        textCards2.setOrigin(0.5, 0.5);
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(EscenaSupuesto);
        })
    }
}