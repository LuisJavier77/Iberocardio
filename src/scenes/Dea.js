import Phaser from 'phaser'

import { EndGame } from '../consts/SceneKeys'



var patch1;
var patch2;
var patchContainer1;
var patchContainer2;
var dragend1 = false;
var dragend2 = false;
var patch1_OK = false;
var patch2_OK = false;
var resultLabel;
var counter = 0;
var shock = false;


export default class DEA extends Phaser.Scene
{
    continueButton;
    modalDisplayed = false;

    init(data)
    {
        this.supuestoScene = data.cardScene;
    }

    preload()
    {
        this.load.image('modalDEA', 'src/assets/images/rulesDEA.png');
        this.load.image("modalBackground", 'src/assets/images/modalBackground.png');
        this.load.image('help', 'src/assets/images/help.png');
        this.load.image('dea', 'src/assets/images/dea.png');
        this.load.image('patch', 'src/assets/images/plane.png');
        this.load.image('zone', 'src/assets/images/zone.png');
        this.load.image('continue', 'src/assets/images/continue.png');
    }

    create()
    { 
        patch1_OK = false;
        patch2_OK = false;
        if(!this.supuestoScene.deaModalDisplayed){
            this.showModal();
        } 
        this.supuestoScene.deaModalDisplayed = true;     
        counter = 0;
        this.add.text(960, 100, 'DEA', { color: 'white', fontSize: '100px'}).setOrigin(0.5, 0.5);
        var helpButton = this.add.image(1800, 100, 'help').setScale(0.2);
        helpButton.setInteractive({cursor: 'pointer'});
        var image = this.add.image(960, 500, 'dea').setOrigin(0.5, 0.5).setScale(2);
        resultLabel = this.add.text(960, 850, '', { color: 'white', fontSize: '40px' }).setOrigin(0.5, 0.5);
        image.setPipeline('Light2D');
        this.lights.addLight(610, 286, 59).setColor(0x00ff00).setIntensity(0);     
        var yellowButton = this.add.circle(610, 330, 10, 0xffff00, 1).setInteractive({ useHandCursor: true });
        yellowButton.setDepth(-1);
        var greenButton = this.add.circle(610, 355, 10, 0x00ff00, 1).setInteractive({ useHandCursor: true });
        greenButton.setDepth(-1);
        this.lights.enable().setAmbientColor(0xFFFFFF);
        patch1 = this.physics.add.image(640, 670, 'patch');
        patch2 = this.physics.add.image(760, 670, 'patch').setAngle(90);       
        patch1.depth = 1;
        patch2.depth = 1;
        dragend1 = false;
        dragend2 = false;

        // Reduce patch collision boxes
        patch1.setSize(10, 10, true);
        patch2.setSize(10, 10, true);

        patchContainer1 = this.physics.add.image(995, 540, "zone");
        patchContainer2 = this.physics.add.image(1155, 685, "zone");

        patchContainer1.setSize(20, 20, true);
        patchContainer2.setSize(20, 20, true);
        patchContainer1.setDepth(-1);
        patchContainer2.setDepth(-1);
  
        this.physics.add.collider(patch1, [patchContainer1, patchContainer2]);
        this.physics.add.collider(patch2, [patchContainer1, patchContainer2]);

        // Create yellow light with Intensity 0 (turn off)
        var yellowLight  = this.lights.addLight(610, 330, 58).setColor(0xffff00).setIntensity(0);

        this.continueButton = this.add.image(960, 950, 'continue').setOrigin(0.5, 0.5).setScale(0.5).setInteractive({ useHandCursor: true });
        this.continueButton.on('pointerdown', function () {
            this.supuestoScene.scene.setVisible(true);
            this.supuestoScene.scene.wake();
            this.scene.stop();
        }, this);
        this.continueButton.setVisible(false);

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            // patch1 dragend
            if(gameObject==patch1)
            {
                dragend1 = false;
            }

            // patch2 dragend
            if(gameObject==patch2)
            {
                dragend2 = false;
            }

            gameObject.tint = 0xFFFFFF;
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        helpButton.on('pointerdown', function () {
            helpButton.setTint(0xff0000);       
        }, this);

        helpButton.on('pointerup', function () {
            helpButton.clearTint();
            this.showModal();
        }, this);

        this.input.on('dragend', function (pointer, gameObject) {
            if(gameObject==patch1)
            {
                dragend1 = true;
            }
            
            if(gameObject==patch2)
            {
                dragend2 = true;
            }
        });

        /*this.input.keyboard.once('keydown-SPACE', () => {
            this.supuesto.scene.setVisible(true);
            this.supuesto.scene.wake();
            this.scene.stop();
        })

        this.input.keyboard.once('keydown-ENTER', () => {
            this.supuesto.scene.setVisible(true);
            this.supuesto.scene.wake();
            this.scene.stop();
        })*/

        greenButton.once('pointerdown', function () {
            var greenLight  = this.lights.addLight(610, 355, 58).setColor(0x00ff00).setIntensity(160);

            // Activate patchs when green light is turn on
            patch1.setInteractive({ useHandCursor: true });
            patch2.setInteractive({ useHandCursor: true });
            this.input.setDraggable(patch1);
            this.input.setDraggable(patch2);
            resultLabel.text = '(audio) Coloque los parches';
        }, this);

        yellowButton.on('pointerdown', function () {
            if(patch1_OK && patch2_OK && shock)
            {                        
                yellowLight.setIntensity(100);
                resultLabel.setText('Descarga realizada');
                this.continueButton.setVisible(true);
                //this.rcpQuestion();         
            }
        }, this);
    }

    rcpQuestion(){
        setTimeout(() => {
            resultLabel.setText('Deberá continuar intercalando RCP y el uso del desfibrilador cada 2 minutos.');
            const question = this.add.text(960, 900, '¿Hasta cuando realizar la RCP?', { color: 'white', fontSize: '40px'}).setOrigin(0.5, 0.5);
            var falseAnswer1 = this.add.text(960, 960, '1 - Hasta que responda o respire con normalidad', {fontSize: 20});
            falseAnswer1.setOrigin(0.5, 0.5);
            const falseAnswer2 = this.add.text(960, 990, '2 - Hasta que llegue personal más capacitado y asuma el control', {fontSize: 20});
            falseAnswer2.setOrigin(0.5, 0.5);
            const falseAnswer3 = this.add.text(960, 1020, '3 - Hasta que esté extenuado si estoy solo y exclusivamente solo', {fontSize: 20});
            falseAnswer3.setOrigin(0.5, 0.5);
            var trueAnswer = this.add.text(960, 1050, '4 - Todas las anteriores', {fontSize: 20});
            trueAnswer.setOrigin(0.5, 0.5);
            this.input.keyboard.on('keydown-FOUR', () => {
                resultLabel.text = '';
                resultLabel.text = 'La respuesta es correcta';
                question.text = '';
                falseAnswer1.text ='';
                falseAnswer2.text = '';
                falseAnswer3.text = '';
                trueAnswer.text = '';
                resultLabel.setOrigin(0.5, 0.5);
                setTimeout(() => {
                    resultLabel.setText('');
                    this.supuestoScene.scene.setVisible(true);
                    this.supuestoScene.scene.wake();
                    this.scene.stop(); 
                    //this.scene.start(EndGame);
                }, 3000);                      
            })
        }, 3000);
    }
    
    messageShocking()
    {
        if(counter == 0){ // Only execute once
            resultLabel.setText('(audio) No toque al paciente. Analizando ritmo cardiaco...');
            setTimeout(() => {
                Phaser.Math.RND;
                var value = Phaser.Math.Between(0, 1);
                if(value == 1){
                    resultLabel.setText('(audio) Recomiendo descarga');
                    shock = true;
                }
                else {
                    resultLabel.setText('(audio) NO Recomiendo descarga. Comience RCP');
                    shock = false;
                    this.continueButton.setVisible(true);
                    //this.rcpQuestion();
                }               
            }, 3000);          
            counter++;
        }
    }

    showModal()
    {
        /********* SHOW MODAL *********/
        var modalBackground = this.add.image(960, 540, 'modalBackground').setDepth(3).setInteractive();
        modalBackground.setOrigin(0.5, 0.5);
        modalBackground.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);
        modalBackground.setAlpha(0.6);
        var modal = this.add.image(960, 540, 'modalDEA').setOrigin(0.5, 0.5).setDepth(3).setInteractive();
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

    update()
    {   
        if(dragend1)
        {
            if(this.physics.collide(patch1, patchContainer1))
            {
                patch1.tint = 0x00ff00;
                patch1_OK = true;
                if(patch2_OK){
                    this.messageShocking();
                }
                else{
                    resultLabel.text = '';
                }
            }
            else{
                patch1.tint = 0x880808;
                patch1_OK = false;
            }
        }

        if(dragend2)
        {
            if(this.physics.collide(patch2, patchContainer2))
            {
                patch2.tint = 0x00ff00;
                patch2_OK = true;
                if(patch1_OK){
                    this.messageShocking();
                }
                else{
                    resultLabel.text = '';
                }
            }
            else{
                patch2.tint = 0x880808;
                patch2_OK = false;
            }
        }
    }
}
