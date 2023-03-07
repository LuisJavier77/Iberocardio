
import { TitleScreen } from '../consts/SceneKeys'

export default class Config extends Phaser.Scene
{
    //saveButton;
    numCardsSelected;
    protocolSelected;
    saveButton;

    init(){
        if(localStorage.getItem('numCardsOp') == null || localStorage.getItem('numCardsOp') == 'undefined'){
            localStorage.setItem('numCardsOp', 1);
        }
        if(localStorage.getItem('protocolOp') == null || localStorage.getItem('protocolOp') == 'undefined'){
            localStorage.setItem('protocolOp', 'ERC')
        }

        this.numCardsSelected = localStorage.numCardsOp;
        this.protocolSelected = localStorage.protocolOp;
    }

    preload(){
        this.load.image('optionButton', 'src/assets/images/orangeButton.png');
    }

    create(){
        this.add.text(960, 100, 'CONFIGURACIÓN', { color: 'white', fontSize: '100px' }).setOrigin(0.5);
        this.add.text(300, 300, 'CARTAS EN LA MANO:', { color: 'white', fontSize: '45px' });
        var cards3 = this.add.rectangle(900, 320, 120, 50, 0xf5a30a).setInteractive({ useHandCursor: true });
        var cards5 = this.add.rectangle(1100, 320, 120, 50, 0xf5a30a).setInteractive({ useHandCursor: true });
        var cardsAll = this.add.rectangle(1300, 320, 120, 50, 0xf5a30a).setInteractive({ useHandCursor: true });
        this.add.text(890, 306, '3', { color: 'white', fontSize: '35px'});
        this.add.text(1090, 306, '5', { color: 'white', fontSize: '35px'});
        this.add.text(1245, 306, 'todas', { color: 'white', fontSize: '35px'});
        this.add.text(300, 400, 'PROTOCOLO ATRAGANTAMIENTO:', { color: 'white', fontSize: '45px'});
        var europe = this.add.rectangle(1110, 420, 120, 50, 0xf5a30a).setInteractive({ useHandCursor: true });
        var america = this.add.rectangle(1300, 420, 120, 50, 0xf5a30a).setInteractive({ useHandCursor: true });
        this.add.text(1075, 405, 'ERC', { color: 'white', fontSize: '35px'});
        this.add.text(1270, 405, 'AHA', { color: 'white', fontSize: '35px'});
        var exitButton = this.add.rectangle(700, 700, 250, 90, 0xf5a30a).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.add.text(640, 685, 'SALIR', { color: 'white', fontSize: '40px'});
        this.saveButton = this.add.rectangle(1100, 700, 400, 90, 0xbdbbb9).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.add.text(920, 685, 'GUARDAR CAMBIOS', { color: 'white', fontSize: '40px'});
        switch(localStorage.numCardsOp){
            case '1':
                cards3.setFillStyle(0xf5770a);
                break;
            
            case '2':
                cards5.setFillStyle(0xf5770a);
                break;
            
            case '3':
                cardsAll.setFillStyle(0xf5770a);
                break;
        }

        switch(localStorage.protocolOp){
            case "ERC":
                europe.setFillStyle(0xf5770a);
                break;
            
            case "AHA":
                america.setFillStyle(0xf5770a);
                break;
        }

        cards3.on('pointerdown', function () {
            cards3.setFillStyle(0xf5770a);
            cards5.setFillStyle(0xf5a30a);
            cardsAll.setFillStyle(0xf5a30a);
            this.numCardsSelected = 1;
        }, this);

        cards5.on('pointerdown', function () {
            cards5.setFillStyle(0xf5770a);
            cards3.setFillStyle(0xf5a30a);
            cardsAll.setFillStyle(0xf5a30a);
            this.numCardsSelected = 2;
        }, this);

        cardsAll.on('pointerdown', function () {
            cardsAll.setFillStyle(0xf5770a);
            cards3.setFillStyle(0xf5a30a);
            cards5.setFillStyle(0xf5a30a);
            this.numCardsSelected = 3;
        }, this);

        europe.on('pointerdown', function () {
            europe.setFillStyle(0xf5770a);
            america.setFillStyle(0xf5a30a);
            this.protocolSelected = "ERC";
        }, this);

        america.on('pointerdown', function () {
            america.setFillStyle(0xf5770a);
            europe.setFillStyle(0xf5a30a);
            this.protocolSelected = "AHA";
        }, this);

        exitButton.on('pointerdown', function () {
            exitButton.setFillStyle(0xf5770a);
            setTimeout(() => {
                exitButton.setFillStyle(0xf5a30a);           
            }, 150);

            this.scene.start(TitleScreen);
        }, this);

        this.saveButton.on('pointerdown', () => {
            if(localStorage.numCardsOp != this.numCardsSelected || localStorage.protocolOp != this.protocolSelected){
                this.saveButton.setFillStyle(0xf5770a);
                setTimeout(() => {
                    this.saveButton.setFillStyle(0xf5a30a);        
                }, 150);

                if(localStorage.numCardsOp != this.numCardsSelected && this.numCardsSelected != 'undefined'){
                    localStorage.setItem('numCardsOp', this.numCardsSelected);
                }
                if(localStorage.protocolOp != this.protocolSelected && this.protocolSelected != 'undefined'){
                    localStorage.setItem('protocolOp', this.protocolSelected);
                }
            }         
        });
    }

    update(){
        if(localStorage.numCardsOp != this.numCardsSelected || localStorage.protocolOp != this.protocolSelected){
            this.saveButton.setFillStyle(0xf5a30a);
        } else {
            this.saveButton.setFillStyle(0xbdbbb9);
        }
    }
}