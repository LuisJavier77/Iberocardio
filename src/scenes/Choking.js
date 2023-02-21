import Phaser from 'phaser';

import { SelectMinigame } from '../consts/SceneKeys';
import { EndGame } from '../consts/SceneKeys';


export default class Choking extends Phaser.Scene
{
    modaldisplayed = false;

    init(data)
    {
        this.supuestoScene = data.escenaSupuesto;
    }

    preload()
    {
        this.load.image('atragantamiento', 'src/assets/images/atragantamiento.png');
        this.load.image("modalBackground", 'src/assets/images/modalBackground.png');       
        this.load.image('modalChocking', 'src/assets/images/rulesChocking.png');
        this.load.image('help', 'src/assets/images/help.png');
        this.load.image('continue', 'src/assets/images/continue.png');
    }

    create()
    {       
        this.add.text(960, 50, 'ATRAGANTAMIENTO', { color: 'white', fontSize: '100px'}).setOrigin(0.5, 0.5);

        var helpButton = this.add.image(1800, 100, 'help').setScale(0.2);
        helpButton.setInteractive({cursor: 'pointer'});
        if(!this.supuestoScene.chokingModalDisplayed){
            this.showModal();           
        }       

        this.add.image(960, 500, 'atragantamiento').setOrigin(0.5, 0.5).setScale(1.5);
        var circle = this.add.circle(959, 560, 35, 0xFFFFFF, 1).setInteractive({ useHandCursor: true });
        this.input.on('pointerdown', this.startDrag, this);
        helpButton.on('pointerdown', function () {
            helpButton.setTint(0xff0000);          
        }, this);

        helpButton.on('pointerup', function () {
            helpButton.clearTint();
            this.showModal();
        }, this);
    }

    startDrag(pointer, targets)
    {    
        //this.input.once('pointerdown', this.startDrag, this);
        this.dragObj = targets[0];
        this.input.on('pointermove', this.doDrag, this);
        this.input.on('pointerup', this.stopDrag, this);
    }

    doDrag(pointer, targets)
    {
        if (typeof this.dragObj !== "undefined")
        {
            targets[0].fillColor = 0xffffff;
            if(pointer.y > 320 && pointer.y < 790)
            {
                this.dragObj.y = pointer.y;
            }
        }
    }

    stopDrag(pointer, targets)
    {
        //this.input.on('pointerdown', this.startDrag, this);
        this.input.off('pointermove', this.doDrag, this);
        this.input.off('pointerup', this.stopDrag, this);
        if(targets[0] != undefined)
        {
            if(pointer.y > 710 && pointer.y < 760)
            {
                targets[0].fillColor = 0x00ff00;
                var resultLabel = this.add.text(960, 910, '¡Enhorabuena! Has finalizado el minijuego', { color: 'white', fontSize: '40px'}).setOrigin(0.5, 0.5);
                var continueButton = this.add.image(960, 1000, 'continue').setOrigin(0.5, 0.5).setScale(0.5).setInteractive({ useHandCursor: true });
                continueButton.on('pointerdown', function () {
                    this.supuestoScene.scene.setVisible(true);
                    this.supuestoScene.scene.wake();
                    this.scene.stop();
                }, this);              
            }
            else{
                targets[0].fillColor = 0x880808;
            }
        }
    }

    showModal()
    {
        this.supuestoScene.chokingModalDisplayed = true;
        /********* SHOW MODAL *********/
        var modalBackground = this.add.image(960, 540, 'modalBackground').setDepth(2).setInteractive();
        modalBackground.setOrigin(0.5, 0.5);
        modalBackground.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);
        modalBackground.setAlpha(0.6);
        var modal = this.add.image(960, 540, 'modalChocking').setOrigin(0.5, 0.5).setDepth(3).setInteractive();
        /********* END SHOW MODAL *********/

        /********* CLOSE MODAL *********/
        modal.once('pointerdown', function () {
            modal.destroy();
            modalBackground.destroy();
        }, this);

        modalBackground.once('pointerdown', function () {
            modal.destroy();
            modalBackground.destroy();
        }, this);
        /********* CLOSE MODAL END *********/
    }
}