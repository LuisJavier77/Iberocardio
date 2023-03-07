import Phaser from 'phaser'

import { cardGame, Config, EscenaSupuesto } from '../consts/SceneKeys'

//import imgIberocardio from 'src/assets/images/iberocardio-logo.png';


export default class TitleScreen extends Phaser.Scene
{
    preload()
    {
        this.load.image('iberocardio', 'src/assets/images/iberocardio-logo.png');
        this.load.image('panoimagen', 'src/assets/images/panoimagen-logo.svg');
        this.load.image('start', 'src/assets/images/start.png');
        this.load.image('config', 'src/assets/images/config.png');
    }

    create()
    {
        var appElement = document.getElementById('app');
        var canvas = document.querySelector('canvas');
        var div = appElement.getElementsByTagName('div')[0]

        div.style.width = canvas.style.width
        div.style.height = canvas.style.height
        
        var configButton = this.add.image(1800, 100, 'config').setInteractive({ useHandCursor: true });
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

        configButton.on('pointerdown', function (){
            this.scene.start(Config);
        }, this)
        /*this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(DealCards);
        })*/
    }    
}
