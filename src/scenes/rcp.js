import Phaser from '/phaser'

import { DEA } from '../consts/SceneKeys';
import { EndGame } from '../consts/SceneKeys';


export default class RCP extends Phaser.Scene
{
    preload()
    {
        this.load.image('torso', 'src/assets/images/torso.png');
    }

    create()
    {
        this.add.text(960, 100, 'RCP', { color: 'white', fontSize: '100px '}).setOrigin(0.5, 0.5);
        this.add.image(960, 520, 'torso').setOrigin(0.5, 0.5).setScale(2);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(DEA);
        })

        this.input.keyboard.once('keydown-ENTER', () => {
            this.scene.start(EndGame);
        })
    }
}