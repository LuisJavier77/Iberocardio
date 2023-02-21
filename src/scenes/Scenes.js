import Phaser from '/phaser';

import { cardGame } from '../consts/SceneKeys';

import eventsCenter from '../helpers/eventEmitter';


export default class Scenes extends Phaser.Scene
{
    preload()
    {
        this.load.image('supuesto', 'src/assets/images/supuesto.png');
    }

    create()
    {
        var appElement = document.getElementById('app');
        var canvas = document.querySelector('canvas');
        var div = appElement.getElementsByTagName('div')[0];

        div.style.width = canvas.style.width;
        div.style.height = canvas.style.height;

        var numberScene = 1;
        this.titleScene1 = this.add.text(960, 100, 'Supuesto 1', {fontSize: 50}).setOrigin(0.5, 0.5);
        this.titleScene2 = this.add.text(960, 160, 'Paso ' + numberScene, {fontSize: 50}).setOrigin(0.5, 0.5);
        this.add.image(960, 450, 'supuesto').setOrigin(0.5, 0.5).setScale(1.7);
        
        var cardGameScene = this.scene.launch(cardGame, {scene: this});
        this.scene.bringToTop(cardGame);      

        eventsCenter.on('supuesto', this.addSupuesto, this);
    }

    addSupuesto(supuesto){
        console.log(supuesto);
        const scenePlace = this.add.text(960, 690, "LUGAR: " + supuesto.place, {fontSize: 30});
        scenePlace.setOrigin(0.5, 0.5);
        const sceneVictim = this.add.text(960, 730, "VÍCTIMA: " + supuesto.victim, {fontSize: 30});
        sceneVictim.setOrigin(0.5, 0.5);       
    }
}