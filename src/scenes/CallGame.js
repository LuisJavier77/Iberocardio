import Phaser from '/phaser'
import Supuesto from "../helpers/supuestos";

import { EscenaSupuesto, LateralPosition, RCP, EndGame } from '../consts/SceneKeys'


export default class CallGame extends Phaser.Scene
{ 
    init(data)
    {
        this.message = data.msg;
        this.breathe = data.breathe;
        this.reply = data.reply;
        this.supuestoScene = data.escenaSupuesto;
    }

    preload ()
    {
        this.load.html('nameform', 'src/assets/text/nameform.html');
        this.load.image('continue', 'src/assets/images/continue.png');
    }
    
    create ()
    {    
        this.add.text(960, 100, 'LLAMADA AL 112', { color: 'white', fontSize: '100px'}).setOrigin(0.5, 0.5);
        var question = this.add.text(960, 350, '112: Buenas, ¿Su nombre?', {color: 'white', fontSize: '50px'}).setOrigin(0.5, 0.5);
        
        var appElement = document.getElementById('app');
        var canvas = document.querySelector('canvas');
        var div = appElement.getElementsByTagName('div')[0];

        div.style.width = canvas.style.width;
        div.style.height = canvas.style.height;

        var divWidth = div.style.width.slice(0,-2);
        var divHeight = div.style.height.slice(0,-2);

        var text = '';
        var inputText = this.add.rexInputText(divWidth/2, divHeight/2.4, divWidth/5, divHeight/31, {
            type: 'textarea',
            text: 'Introduce tu nombre',
            fontSize: (divHeight/27) * 0.74 + 'px',
            backgroundColor: '#76b5c5'
        })
            .resize(canvas.style.width / 2, canvas.style.height / 23)
            .setOrigin(0.5, 0)
            .on('focus', function (inputText) {
                inputText.text = '';
            })
            .on('blur', function (inputText) {
                text = inputText.text;
            })
            .on('click', function (inputText) {
                inputText.text = '';
            })
        
        var button = this.add.dom(divWidth/2, (divHeight/2.2)+40, 'button', 'width: ' + divWidth/7 + 'px; height: ' + divHeight/21 + 'px; font: ' + (divHeight/41) + 'px Arial', 'Aceptar')
            .on('click', function () {  
                // Have they entered anything?
                if (text !== '')
                {
                    // Turn off the click events
                    this.removeListener('click');
                    inputText.removeListener('focus');
                    inputText.removeListener('blur');
                    inputText.removeListener('click');
    
                    // Hide html elements
                    this.setVisible(false);
                    inputText.setVisible(false);
    
                    // Show questions
                    question.setText('112: ¿' + text + ', donde se encuentra?');
                    trueAnswer.setText('1- PARQUE DEL EBRO (Correcta)');
                    falseAnswer1.setText('2- N-111 PASADO ISLALLANA, AL LADO DEL PUENTE DE VIGUERA');
                    falseAnswer2.setText('3- A12 HACIA SANTO DOMINGO, PASADO HERVÍAS');
                }
                else
                {
                    // Flash the prompt
                    this.scene.tweens.add({
                        targets: text,
                        alpha: 0.2,
                        duration: 250,
                        ease: 'Power3',
                        yoyo: true
                    });
                }
            })
        
        var trueAnswer = this.add.text(960, 500, '', { color: 'white', fontSize: '30px'}).setOrigin(0.5, 0.5);
        var falseAnswer1 = this.add.text(960, 560, '', { color: 'white', fontSize: '30px'}).setOrigin(0.5, 0.5);
        var falseAnswer2 = this.add.text(960, 620, '', { color: 'white', fontSize: '30px'}).setOrigin(0.5, 0.5);
        var resultLabel = this.add.text(960, 1000, '', { fontSize: '40px'});
        this.input.keyboard.on('keydown-ONE', () => {
            resultLabel.setText('');
            question.setText('112: ¿Qué es lo que ocurre?');
            trueAnswer.setText(this.message);
            falseAnswer1.setText('');
            falseAnswer2.setText('');
            var continueButton = this.add.image(960, 750, 'continue').setOrigin(0.5, 0.5).setScale(0.5).setInteractive({ useHandCursor: true });
            continueButton.on('pointerdown', function () {
                resultLabel.setText('');
                question.setText('112: Muchas gracias, mandamos\na los recursos necesarios,\nahora debería hacer…');
                trueAnswer.setText('');
                //continueButton.destroy();
                continueButton.on('pointerdown', function () {
                    this.scene.stop();
                    this.supuestoScene.scene.setVisible(true);
                }, this);
            }, this);        
        })       

        this.input.keyboard.on('keydown-TWO', () => {
            resultLabel.setText("La respuesta NO es correcta.").setOrigin(0.5, 0.5);
            setTimeout(() => {
                resultLabel.setText('');
            }, 3000);
        })

        this.input.keyboard.on('keydown-THREE', () => {
            resultLabel.setText("La respuesta NO es correcta.").setOrigin(0.5, 0.5);
            setTimeout(() => {
                resultLabel.setText('');
            }, 3000);
        })
    
        button.addListener('click');
    }
}