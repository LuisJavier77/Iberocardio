import Phaser from '/phaser'

import { cardGame, DealCards, EscenaSupuesto } from '../consts/SceneKeys'
import Supuesto from '../helpers/supuestos';


export default class TitleScreen extends Phaser.Scene
{
    preload()
    {
        this.load.image('iberocardio', 'src/assets/images/iberocardio-logo.png');
        this.load.image('panoimagen', 'src/assets/images/panoimagen-logo.svg');
        this.load.image('start', 'src/assets/images/start.png');
    }

    create()
    {
        var appElement = document.getElementById('app');
        var canvas = document.querySelector('canvas');
        var div = appElement.getElementsByTagName('div')[0]

        div.style.width = canvas.style.width
        div.style.height = canvas.style.height
        
        const title1 = this.add.text(960, 300, 'JUEGO', {
            fontSize: 100
        })
        title1.setOrigin(0.5, 0.5)
        const title2 = this.add.text(960, 400, 'DE', {
            fontSize: 100
        })
        title2.setOrigin(0.5, 0.5)
        const title3 = this.add.text(960, 500, 'FORMACIÓN', {
            fontSize: 100,
        })
        title3.setOrigin(0.5, 0.5)

        var startButton = this.add.image(960, 670, 'start').setOrigin(0.5, 0.5).setScale(0.4).setInteractive({ useHandCursor: true });

        this.add.image(960, 850, 'iberocardio').setOrigin(0.5, 0.5).setScale(1)
        this.add.image(960, 900, 'panoimagen').setOrigin(0.5, 0.5).setScale(1)
        this.add.text(960, 950, 'Jorge Fernández Sanz', {fontSize: '30px', color: '#000000', fontStyle:'bold'}).setOrigin(0.5, 0.5)
        
        startButton.on('pointerdown', function () {
            //this.scene.start(DealCards); 
            this.scene.start(EscenaSupuesto);     
        }, this);
        /*this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(DealCards);
        })*/
    }    
}
