import Phaser from 'phaser'

import { EndGame } from '../consts/SceneKeys'



export default class LateralPosition extends Phaser.Scene
{
    resultLabel;
    modalDisplayed = false;

    init(data)
    {
        this.supuestoScene = data.cardScene;
    }

    preload()
    {
        this.load.image('modalPLS', 'src/assets/images/rulesPLS.png');
        this.load.image("modalBackground", 'src/assets/images/modalBackground.png');
        this.load.image('help', 'src/assets/images/help.png');
        this.load.image('pls1', 'src/assets/images/pls1.jpg');
        this.load.image('pls2', 'src/assets/images/pls2.jpg');
        this.load.image('pls3', 'src/assets/images/pls3.jpg');
        this.load.image('pls4', 'src/assets/images/pls4.jpg');
    }

    create()
    {   
        if(!this.supuestoScene.lateralPositionModalDisplayed){     
            this.showModal();
        }

        /********* SET SCENE ELEMENTS *********/
        this.add.text(960, 100, 'POSICION LATERAL DE SEGURIDAD (PLS)', { color: 'white', fontSize: '50px '}).setOrigin(0.5, 0.5);
        var helpButton = this.add.image(1800, 100, 'help').setScale(0.2);
        helpButton.setInteractive({cursor: 'pointer'});
        this.add.image(960, 400, 'pls1').setOrigin(0.5, 0.5).setScale(1.6);
        var circle1 = this.add.circle(1210, 430, 35, 0x38b01e, 1).setInteractive({ useHandCursor: true });
        var circle2 = this.add.circle(1040, 470, 35, 0x38b01e, 1).setInteractive({ useHandCursor: true });
        var circle3 = this.add.circle(810, 320, 35, 0x38b01e, 1).setInteractive({ useHandCursor: true });
        var circle4 = this.add.circle(810, 450, 35, 0x38b01e, 1).setInteractive({ useHandCursor: true });

        circle1.setDepth(2);
        circle2.setDepth(2);
        circle3.setDepth(2);
        circle4.setDepth(2);

        this.resultLabel = this.add.text(960, 600, '', { color: 'white', fontSize: '40px '}).setOrigin(0.5, 0.5);
        /********* END SET SCENE ELEMENTS *********/

        var c2Guess = false;
        var c3Guess = false;

        this.input.keyboard.once('keydown-SPACE', () => {
            this.supuestoScene.scene.setVisible(true);
            this.supuestoScene.scene.wake();
            this.scene.stop();     
        })

        helpButton.on('pointerdown', function () {
            helpButton.setTint(0xff0000);       
        }, this);

        helpButton.on('pointerup', function () {
            helpButton.clearTint();
            this.showModal();
        }, this);

        circle1.on('pointerdown', function () {       
            this.resultLabel.setText("No es correcto");

            // Circle is red during 1/2 second
            circle1.setFillStyle(0x880808);
            setTimeout(() => {
                circle1.setFillStyle(0x38b01e);
            }, 500);

            // Show text during 2 seconds
            setTimeout(() => {
                this.resultLabel.setText('');
            }, 2000);
        }, this);

        circle2.on('pointerdown', function () {
            this.add.image(960, 400, 'pls2').setOrigin(0.5, 0.5).setScale(1.6);
            circle2.setPosition(1320, 450);
            circle3.setPosition(820, 320);
            circle4.setPosition(820, 440);
            c2Guess = true;
            circle2.disableInteractive(true);
        }, this);

        circle3.on('pointerdown', function () {
            if(c2Guess) {
                this.add.image(960, 400, 'pls3').setOrigin(0.5, 0.5).setScale(1.6);
                circle2.setPosition(1320, 470);
                circle3.setPosition(800, 340);
                circle4.setPosition(800, 460);
                c3Guess = true;
                circle3.disableInteractive(true);
            }
            else {
                this.resultLabel.setText("No es correcto");
                // circle is red during 1/2 second
                circle3.setFillStyle(0x880808);
                setTimeout(() => {
                    circle3.setFillStyle(0x38b01e);
                }, 500);

                setTimeout(() => {
                    this.resultLabel.setText('');
                }, 2000);
            }
        }, this);

        circle4.on('pointerdown', function () {
            if(c3Guess){
                this.add.image(960, 400, 'pls4').setOrigin(0.5, 0.5).setScale(1.6);
                circle1.destroy();
                circle2.destroy();
                circle3.destroy();
                circle4.destroy();
                this.resultLabel.setText("¡Enhorabuena! Has finalizado el minijuego.");

                var continueButton = this.add.image(960, 750, 'continue').setOrigin(0.5, 0.5).setScale(0.5).setInteractive({ useHandCursor: true });
                continueButton.on('pointerdown', function () {
                    this.supuestoScene.scene.setVisible(true);
                    this.supuestoScene.scene.wake();
                    this.scene.stop(); 
                }, this);
            }
            else{
                this.resultLabel.setText("No es correcto");
                // circle is red during 1/2 seconds
                circle4.setFillStyle(0x880808);
                setTimeout(() => {
                    circle4.setFillStyle(0x38b01e);
                }, 500);

                setTimeout(() => {
                    this.resultLabel.setText('');
                }, 2000);
            }
        }, this);     
    }

    showModal(){
        this.supuestoScene.lateralPositionModalDisplayed = true;
        /********* SHOW MODAL *********/
        var modalBackground = this.add.image(960, 540, 'modalBackground').setDepth(3).setInteractive();
        modalBackground.setOrigin(0.5, 0.5);
        modalBackground.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);
        modalBackground.setAlpha(0.6);
        var modal = this.add.image(960, 540, 'modalPLS').setOrigin(0.5, 0.5).setDepth(3).setInteractive();
        /********* END SHOW MODAL *********/

        /********** CLOSE MODAL **********/
        modal.once('pointerdown', function () {
            modal.destroy();
            modalBackground.destroy();
        }, this);

        modalBackground.once('pointerdown', function () {
            modal.destroy();
            modalBackground.destroy();
        }, this);
        /********** END CLOSE MODAL **********/
    }
}