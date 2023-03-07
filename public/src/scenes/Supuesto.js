import Phaser from 'phaser'
import LocalInfo from "../helpers/localInfo";
import Supuesto from "../helpers/supuestos";
import Basics from "../helpers/basics";

import { CallGame, Choking, DEA, EndGame, LateralPosition } from '../consts/SceneKeys'



export default class EscenaSupuesto extends Phaser.Scene
{
    cards = [
        'Entorno',
        'Calma',
        'EPI',
        'Neutralizar el peligro',
        'Huir a zona segura',
        'Observar',
        'Responde 1',
        'Responde 2',
        'Maniobra frente menton',
        'Respira 1',
        'Respira 2',
        'Llamar al 112',
        'Posición lateral de seguridad',
        'RCP',
        'Observar paciente',
        'Dar palmadas en la espalda',
        'Maniobra de Heimlich',
        'Animar a toser'
    ]

    currentCards = [
        'Entorno',
        'Calma',
        'EPI',
    ];

    callMessage;
    indice = 3;

    textCards = [];
    cardNamesImages = [];

    frenteMentonFlag = false;
    endCheckResponse = false;
    breatheCheckFlag = false;
    turnAmbulance = 1;
    turnChoking = 1;
    isChocking = false;
    isCall = false;

    cardImage1;
    cardImage2;
    cardImage3;

    deaModalDisplayed = false;
    chokingModalDisplayed = false;
    lateralPositionModalDisplayed =  false;
    iconResponse;
    iconBreath;
    iconDanger;

    cardEntorno;
    cardCalma;
    cardEpi;
    cardResponde1;
    cardResponde2;
    cardFrenteMenton;
    cardRespira1;
    cardRespira2;
    sosPlayed = false;


    preload()
    {
        this.load.image('escenario', 'src/assets/images/Escenario.jpeg');
        this.load.image('carta', 'src/assets/images/carta.png');
        this.load.image('end', 'src/assets/images/start.png');
        this.load.image("background", 'src/assets/images/modalBackground.png');
        this.load.image("placeInterface", 'src/assets/images/placeInterface.png');
        this.load.image("breath", 'src/assets/images/greenBreath.png');
        this.load.image("noBreath", 'src/assets/images/redBreath.png');
        this.load.image("response", 'src/assets/images/greenResponse.png');
        this.load.image("noResponse", 'src/assets/images/redResponse.png');
        this.load.image("unknown", 'src/assets/images/askIcon.png');
        this.load.image("danger", 'src/assets/images/danger.png');
        this.load.image("warning", 'src/assets/images/warning.png');
        this.load.image("safe", 'src/assets/images/safe.png');
        this.load.image("sos", 'src/assets/images/sos.png');


        // Cargar supuesto
        this.currentScene = this;
        this.basics = new Basics();
        this.supuesto = new Supuesto(this.basics);
        this.local = new LocalInfo();
    }

    create()
    {
        console.log(this.supuesto);
        // Imagen del Supuesto
        var image = this.add.image(0, 0, 'escenario').setOrigin(0);
        this.add.image(960, 131, "placeInterface").setOrigin(0.5, 0);
        this.add.text(960, 140, "LUGAR: " + this.supuesto.place, {color: 'black', fontSize: 30}).setOrigin(0.5, 0);
        this.iconDanger = this.add.image(1600, 170, "unknown").setScale(0.4);
        this.iconBreath = this.add.image(1700, 170, "unknown").setScale(0.4);
        this.iconResponse = this.add.image(1800, 170, "unknown").setScale(0.4);
        this.sosButton = this.add.image(80, 850, "sos").setScale(0.2).setInteractive({ useHandCursor: true });

        image.displayWidth = this.sys.canvas.width;
        image.displayHeight = this.sys.canvas.height;

        this.dialogText = this.add.text(100, 65, "", {color: 'black', fontSize: 39}).setOrigin(0);

        var textCard0 = this.add.text(200, 990, this.currentCards[0], {color: 'black', fontSize: 34, align: "center", wordWrap: { width: 300 }}).setOrigin(0.5);
        var textCard1 = this.add.text(960, 990, this.currentCards[1], {color: 'black', fontSize: 34, align: "center", wordWrap: { width: 300 }}).setOrigin(0.5);
        var textCard2 = this.add.text(1720, 990, this.currentCards[2], {color: 'black', fontSize: 34, align: "center", wordWrap: { width: 300 }}).setOrigin(0.5);

        
        this.textCards.push(textCard0);
        this.textCards.push(textCard1);
        this.textCards.push(textCard2);

        this.drawCards(this.textCards);

        this.sosButton.on('pointerdown', function () {
            this.sosCard();
        }, this);
    }

    checkOrder(card){
        switch (this.basics.getState()) {
            case "protect":
                if((this.basics.getProtect()).includes(card)){
                    switch(card){
                        case 'Entorno':
                            // Personalizar el mensaje según el tipo de peligro
                            if(this.supuesto.getDanger() === "No hay peligro en la zona"){
                                this.dialogText.setText("HAY UNA PERSONA TUMBADA EN EL SUELO.");
                                this.iconDanger.setTexture("safe").setScale(0.1);
                            }
                            else if(this.supuesto.getDanger() === "Neutralizable"){
                                this.dialogText.setText("HAY UNA PERSONA TUMBADA EN EL SUELO, Y ESTÁ RODEADA DE GENTE.");
                                this.iconDanger.setTexture("warning").setScale(0.1);
                            }
                            else{
                                this.dialogText.setText("HAY UNA PERSONA TUMBADA EN EL SUELO, AL LADO DE UN INCENDIO.");
                                this.iconDanger.setTexture("danger").setScale(0.1);
                            }

                            // Establecer que se ha jugado la carta Entorno y la cambiamos por otra
                            this.cardEntorno = true;
                            this.changeCard("Entorno");
                            break;
                        case 'Calma':
                            // Mostrar mensaje de que se ha jugado la carta Calma, establecer que se ha jugado la carta y cambiarla por otra
                            this.dialogText.setText("MUY BIEN. SIEMPRE HAY QUE MANTENER LA CALMA EN CUALQUIER EMERGENCIA."); 
                            this.cardCalma = true;
                            this.changeCard("Calma");
                            break;
                        case 'EPI':
                            // Mostrar mensaje de que se ha jugado la carta EPI, establecer que se ha jugado la carta y cambiarla por otra
                            this.dialogText.setText("MUY BIEN. HAY QUE PROTEGERSE A SI MISMO SIEMPRE QUE SEA POSIBLE.");
                            this.cardEpi = true;
                            this.changeCard("EPI");
                            break;
                    }                                     
                }else{
                    // Si no se juega una carta de autoprotección
                    this.dialogText.setText("RECUERDA LA AUTOPROTECCIÓN");
                    this.cameras.main.shake(300);
                }

                // Si se han jugado las 3 cartas de autoprotección se pasa a la fase Danger
                if(this.cardEntorno && this.cardCalma && this.cardEpi){
                    this.basics.setState("danger");
                    //console.log("FASE DANGER");
                }
                break;
            
            case 'danger':
                // Cuando se juega la carta 'Neutralizar el peligro' se muestra un mensaje según el peligro y se cambia la carta por otra
                if(card === "Neutralizar el peligro"){
                    if(this.supuesto.getDanger() === "No hay peligro en la zona"){
                        this.dialogText.setText("NO ERA NECESARIO. LA ZONA YA ES SEGURA.");
                    }else if(this.supuesto.danger === "Neutralizable"){
                        this.supuesto.setDanger("No hay peligro en la zona");
                        this.dialogText.setText("BIEN, EL PELIGRO HA SIDO NEUTRALIZADO.");
                        this.iconDanger.setTexture("safe").setScale(0.1);
                    }else{
                        this.dialogText.setText("NO SE PUEDE NEUTRALIZAR EL PELIGRO.");
                    }
                    this.changeCard("Neutralizar el peligro");
                }
                // Cuando se juega la carta 'Huir a zona segura' se muestra un mensaje según el peligro y se cambia la carta por otra
                if(card === "Huir a zona segura"){
                    if(this.supuesto.danger === "No neutralizable"){
                        this.supuesto.setDanger("No hay peligro en la zona");
                        this.dialogText.setText("BIEN. HAS TRASLADADO A LA VÍCTIMA A UN LUGAR SEGURO.");
                        this.iconDanger.setTexture("safe").setScale(0.1);
                    }else{
                        if(this.supuesto.danger === "No hay peligro en la zona"){
                            this.dialogText.setText("MOVER PUEDE AGRABAR LAS LESIONES Y ES UNA ZONA SEGURA.");
                            this.cameras.main.shake(300);
                        }else if(this.supuesto.danger === "Neutralizable"){
                            this.dialogText.setText("ANTES DE MOVER A LA VÍCTIMA HABRÍA QUE INTENTAR ASEGURAR LA ZONA.");
                            this.cameras.main.shake(300);
                        }
                    }
                    this.changeCard("Huir a zona segura");
                }
                // Cuando se juega la carta Observar, si no hay peligro, se pasa a la fase Check. Después se cambia la carta por otra
                if(card === "Observar"){
                    if(this.supuesto.danger === "No hay peligro en la zona"){
                        this.changeCard("Observar");
                        this.basics.setState("check");
                        if(this.basics.getReply() && this.basics.getBreathe()){
                            this.dialogText.setText("OBSERVAS QUE ESTÁ PÁLIDO Y CON LAS MANOS EN EL PECHO.");
                        }else if(!this.basics.getReply()){
                            this.dialogText.setText("OBSERVAS QUE NO SE MUEVE.");
                        }

                        if(this.basics.getReply() && !this.basics.getBreathe()){
                            this.basics.setState("choking");                    
                            this.currentCards = [
                                'Animar a toser',
                                'Dar palmadas en la espalda',
                                'Maniobra de Heimlich'
                            ];
                            this.drawCards();
                            var chance = this.basics.getChance();
                            if(chance>50){
                                this.dialogText.setText("LA VÍCTIMA NO PUEDE RESPIRAR Y SE ECHA LAS MANOS AL CUELLO.");
                                this.iconBreath.setTexture('noBreath');                               
                                this.isChocking = true;
                            }else{
                                this.dialogText.setText("LA VÍCTIMA ESTÁ TOSIENDO.");
                                this.iconBreath.setTexture('breath');
                                this.isChocking = false;
                            }
                            this.iconResponse.setTexture('response');
                        }    
                    }else{
                        this.dialogText.setText("ANTES DEBERÍAS ASEGURAR LA ZONA. HAY PELIGRO CERCA.");
                        this.cameras.main.shake(300);
                    }                               
                }
                if(card === "Responde 1"){
                    this.dialogText.setText("ANTES DEBERÍAS OBSERVAR A LA VÍCTIMA.");
                    this.cameras.main.shake(300);
                } 
                if(card === "Dar palmadas en la espalda"){
                    this.dialogText.setText("NUNCA ES RECOMENDABLE DAR PALMADAS EN LA ESPALDA.");
                    this.cameras.main.shake(300);
                }                       
                break;
            
            case 'check':
                // Si ya se ha llamado al 112 que no vuelva a aparecer la carta
                if(this.currentCards.includes("Huir a zona segura" && this.isCall)){
                    this.changeCard("Llamar al 112");
                }
                // Se cambian las cartas 'Huir a zona segura' y 'Neutralizar el peligro' por otras, ya que ya no son necesarias
                if(this.currentCards.includes("Huir a zona segura")){
                    this.changeCard("Huir a zona segura");
                }
                if(this.currentCards.includes("Neutralizar el peligro")){
                    this.changeCard("Neutralizar el peligro");
                }
                //console.log("FASE CHECK")

                // Si se juega la carta 'Responde 1' se comprueba si la víctima responde o no para mostrar el mensaje correspondiente. Se establece que se ha jugado la carta
                // y se cambia por otra
                if(card === "Responde 1"){
                    if(this.basics.getReply()){                      
                        if(this.basics.getBreathe()){
                            // Si responde y respira se adelanta en el orden de cartas para poder realizar la llamada sin comprobar si respira (Si ha hablado puede respirar)
                            this.dialogText.setText("LA VÍCTIMA DICE QUE LE DUELE EL PECHO.");
                            this.iconBreath.setTexture('breath');
                            this.iconResponse.setTexture('response');
                            this.basics.setState("call");
                            this.indice += 2;
                            this.changeCard("Responde 1");
                        }             
                        this.endCheckResponse = true;
                    }else{
                        this.dialogText.setText("LA VÍCTIMA NO RESPONDE CUANDO LE HABLAMOS.");
                        this.iconResponse.setTexture('noResponse');
                        this.changeCard("Responde 1");
                    }
                    this.cardResponde1 = true;
                }
                // Si se juega la carta 'Responde 2' se comprueba si se ha jugado la carta 'Responde 1' y si la víctima no responde hay un 10% de que responda,
                // y se cambia por otra
                if(card === "Responde 2"){
                    if(this.cardResponde1){
                        if(!this.basics.getReply()){
                            if(this.basics.getChance()>90){
                                this.basics.setReply(true);
                                if(!this.basics.getBreathe()){
                                    this.dialogText.setText("LA VÍCTIMA RESPONDE CUANDO LE GOLPEAMOS EN LOS HOMBROS, PERO NO RESPIRA BIEN.");
                                    this.iconBreath.setTexture('noBreath');
                                    this.iconResponse.setTexture('response');
                                    this.basics.setState("choking");                    
                                    this.currentCards = [
                                        'Animar a toser',
                                        'Dar palmadas en la espalda',
                                        'Maniobra de Heimlich'
                                    ];
                                    this.drawCards();
                                    var chance = this.basics.getChance();
                                    if(chance>50){
                                        this.dialogText.setText("LA VÍCTIMA NO PUEDE RESPIRAR Y SE ECHA LAS MANOS AL CUELLO");
                                        this.iconBreath.setTexture('noBreath');
                                        this.iconResponse.setTexture('response');
                                        this.isChocking = true;
                                    }else{
                                        this.dialogText.setText("LA VÍCTIMA ESTÁ TOSIENDO.");
                                        this.iconBreath.setTexture('breath');
                                        this.iconResponse.setTexture('response');
                                        this.isChocking = false;
                                    }
                                }else{
                                    this.dialogText.setText("LA VÍCTIMA RESPONDE CUANDO LE GOLPEAMOS EN LOS HOMBROS.");
                                    this.iconResponse.setTexture('response');
                                }                                  
                            }else{
                                this.dialogText.setText("LA VÍCTIMA NO RESPONDE CUANDO LE GOLPEAMOS EN LOS HOMBROS.");
                                this.iconResponse.setTexture('noResponse');
                            }
                        }else{
                            this.dialogText.setText("NO ES NECESARIO. LA VÍCTIMA YA RESPONDE.");
                            this.cameras.main.shake(300);                            
                        }
                        this.cardResponde2=true;
                        this.changeCard("Responde 2");
                    }else{
                        this.dialogText.setText("ANTES DE GOLPEAR LOS HOMBROS SERÍA INTERESANTE PREGUNTAR.");
                        this.cameras.main.shake(300);
                    }                   
                    this.endCheckResponse = true;
                }

                // Si se juega la carta 'Maniobra frente menton' se comprueba si se ha terminado de comprobar si la víctima responde. Se establece que se ha jugado la carta,
                // la cambiamos por otra y se muestra el mensaje correspondiente
                if(card === "Maniobra frente menton"){ 
                    if(this.basics.getReply() && this.basics.getBreathe() && this.currentCards.includes("Responde 2")){
                        this.dialogText.setText("NO ES NECESARIO. YA SABEMOS QUE PUEDE RESPIRAR.");
                        this.cameras.main.shake(300);
                        this.cardFrenteMenton = true;
                        this.changeCard("Maniobra frente menton");
                    }else{ 
                        if(this.endCheckResponse){                
                            this.cardFrenteMenton = true;
                            this.changeCard("Maniobra frente menton");
                            this.dialogText.setText("CORRECTO. HAY QUE ABRIR LAS VÍAS RESPIRATORIAS.");
                        }else{
                            this.dialogText.setText("PRIMERO DEBERÍAS TERMINAR DE COMPROBAR SI RESPONDE.");
                            this.cameras.main.shake(300);
                        }
                    }
                }

                // La cartas de Respira se pueden jugar en cualquier orden. La segunda carta que se juega tiene un 10% de probabilidades de que la víctima respire
                if(card === "Respira 1" || card === "Respira 2"){
                    if(this.endCheckResponse){  
                        this.changeCard("Responde 2");                     
                        if(this.cardFrenteMenton){
                            if(this.breatheCheckFlag){
                                if(!this.basics.getBreathe()){
                                    if(this.basics.getChance()>90){
                                        this.basics.setBreathe(true);
                                        this.iconBreath.setTexture('breath');                               
                                        if(card === "Respira 1"){
                                            this.dialogText.setText("NOTAS QUE LA VÍCTIMA RESPIRA.");
                                            this.cardRespira1 = true;
                                        }else{
                                            this.dialogText.setText("TOCAS EL ABDOMEN Y NOTAS QUE RESPIRA.");
                                        }
                                        this.dialogText.setText("LA VÍCTIMA RESPIRA.");
                                        this.iconBreath.setTexture('breath');                                     
                                    }else{
                                        if(card === "Respira 1"){
                                            this.dialogText.setText("PARECE SER QUE LA VÍCTIMA NO RESPIRA.");
                                            this.cardRespira1 = true;                                          
                                        }else{
                                            this.dialogText.setText("TOCAMOS EL ABDOMEN DE LA VÍCTIMA Y NO NOTAS QUE RESPIRE.");
                                        }
                                        this.iconBreath.setTexture('noBreath');
                                    }
                                    this.basics.setState("call");                         
                                }else{
                                    this.dialogText.setText("NO ES NECESARIO. YA SABEMOS QUE RESPIRA");
                                    this.cameras.main.shake(300);
                                }
                            }else{
                                if(this.basics.getBreathe()){
                                    this.iconBreath.setTexture('breath');
                                    this.dialogText.setText("LA VÍCTIMA RESPIRA.");                               
                                    // Quitamos las cartas de Respira
                                    if(this.currentCards.includes("Respira 1")){
                                        this.cardRespira1 = true;
                                        this.changeCard("Respira 1");
                                    }
                                    if(this.currentCards.includes("Respira 2")){
                                        this.changeCard("Respira 2");
                                    }
                                    this.basics.setState("call");
                                }else{
                                    this.iconBreath.setTexture('noBreath');
                                    if(card === "Respira 1"){
                                        this.cardRespira1 = true;
                                    }else{
                                        this.cardRespira2 = true;
                                    }
                                    
                                    this.dialogText.setText("LA VÍCTIMA NO RESPIRA.");
                                }
                            }
                            this.changeCard(card);
                            this.breatheCheckFlag = true;
                        }else{
                            this.dialogText.setText("ANTES DEBERÍAS ABRIR LAS VÍAS RESPIRATORIAS.");
                            this.cameras.main.shake(300);
                        }
                    }else{
                        this.dialogText.setText("PRIMERO DEBERÍAS TERMINAR DE COMPROBAR SI RESPONDE.");
                        this.cameras.main.shake(300);
                    }
                }
                if(card === "Llamar al 112"){
                    this.dialogText.setText("DEBERÍAS TERMINAR DE EXAMINAR A LA VÍCTIMA ANTES DE LLAMAR.");
                    this.cameras.main.shake(300);
                } 
                break;

            case 'call':
                console.log("FASE CALL");
                if(!this.currentCards.includes("Llamar al 112")){
                    console.log("CAMBIO CARTA Llamar 112")
                    this.currentCards[0] = "Llamar al 112";
                    this.drawCards();
                }
                if(card === "Llamar al 112"){
                    // Ocultar la escena de los supuestos y la escena de las cartas y lanzar la escena del minijuego de la llamada
                    this.scene.setVisible(false); // Escena de Supuesto
                    var message = this.getCallMessage();
                    this.scene.launch(CallGame, {msg: message, breathe: this.basics.breathe, reply: this.basics.reply, place: this.supuesto.place, escenaSupuesto: this, supuesto: this.supuesto});
                    this.isCall = true;
                    this.basics.setState('minigames');
                    if((this.basics.getReply() && this.basics.getBreathe()) || (!this.basics.getReply() && this.basics.getBreathe()) || (!this.basics.getReply() && !this.basics.getBreathe())){
                        this.currentCards = [
                            'Posicion lateral de seguridad',
                            'RCP',
                            'Observar al paciente',
                        ];
                    }else{
                        this.currentCards = [
                            'Maniobra de Heimlich',
                            'Animar a toser',
                            'Dar palmadas en la espalda'
                        ];
                    }
                    this.drawCards();
                    this.dialogText.setText("LA AMBULANCIA ESTÁ DE CAMINO. ¿QUÉ HACES MIENTRAS LLEGA?");
                }else{
                    this.dialogText.setText("IGUAL ES BUEN MOMENTO PARA LLAMAR AL 112.");
                    this.cameras.main.shake(300);
                }
                break;
            
            case 'minigames':              
                console.log("FASE MINIGAMES");
                // Elimina la carta de 'Llamar al 112'
                if(this.currentCards.includes("Llamar al 112")){
                    this.changeCard("Llamar al 112");
                }
                if(card === "Observar al paciente"){
                    if(this.basics.getReply() && this.basics.getBreathe()){
                        this.dialogText.setText("VIGILAS EL ESTADO DEL PACIENTE HASTA QUE LLEGUE LA AMBULANCIA.");
                        this.checkAmbulance();
                    }else{
                        this.dialogText.setText("EL PACIENTE NECESITA MEDIDAS MÁS URGENTES.");
                        this.cameras.main.shake(300);
                    }
                }
                if(card === "RCP"){
                    if(!this.basics.getReply() && !this.basics.getBreathe()){
                        this.scene.setVisible(false);
                        this.scene.sleep();
                        //this.scene.launch(DEA, {cardScene: this});
                        this.scene.switch(DEA, {cardScene: this});
                        this.checkAmbulance();
                    }else{
                        this.dialogText.setText("NO ES LA ACTUACIÓN CORRECTA.");
                        this.cameras.main.shake(300);
                    }
                }
                if(card === "Posicion lateral de seguridad"){
                    if(!this.basics.getReply() && this.basics.getBreathe()){
                        this.scene.setVisible(false);
                        this.scene.sleep();
                        this.scene.launch(LateralPosition, {cardScene: this});
                        this.checkAmbulance();
                    }else{
                        this.dialogText.setText("NO ES LA ACTUACIÓN CORRECTA.");
                        this.cameras.main.shake(300);
                    }
                }
                break;
            
            case 'choking':
                console.log("FASE CHOKING")
                var chance = this.basics.getChance();
                switch(this.turnChoking){
                    case 1:
                        if(card === "Animar a toser"){
                            if(this.isChocking){
                                this.dialogText.setText("LA VÍCTIMA NO PUEDE TOSER, SE ESTÁ AHOGANDO.");
                                this.cameras.main.shake(300);
                            }else{
                                if(chance<=5){
                                    this.dialogText.setText("LA VÍCTIMA HA CONSEGUIDO EXPULSAR EL OBJETO TOSIENDO. FIN DEL JUEGO.");
                                    var blockBackground = this.add.image(960, 540, 'background').setDepth(2).setInteractive();
                                    blockBackground.setOrigin(0.5, 0.5);
                                    blockBackground.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);
                                    blockBackground.setAlpha(0.6);
                                    var endButton = this.add.image(960, 660, 'end').setOrigin(0.5, 0.5).setDepth(3).setScale(0.4).setInteractive({ useHandCursor: true });
                                    endButton.on('pointerdown', function () {
                                        this.scene.start(EndGame);    
                                    }, this);
                                }else if(chance<=30){
                                    this.dialogText.setText("LA VÍCTIMA SIGUE TOSIENDO.");
                                    this.iconBreath.setTexture('breath');
                                    this.iconResponse.setTexture('response');
                                }else{
                                    this.dialogText.setText("LA VÍCTIMA HA DEJADO DE RESPIRAR Y SE ECHA LAS MANOS AL CUELLO.");
                                    this.iconBreath.setTexture('noBreath');
                                    this.iconResponse.setTexture('response');
                                    this.isChocking = true;                                
                                }
                                this.turnChoking++;
                            }
                        }
                        if(card === "Maniobra de Heimlich" && this.isChocking){
                            this.scene.setVisible(false);
                            this.scene.sleep();
                            this.scene.launch(Choking, {escenaSupuesto: this});
                            chance = this.basics.getChance();
                            if(chance<=25){
                                this.dialogText.setText("LA VÍCTIMA HA CONSEGUIDO EXPULSAR EL OBJETO TOSIENDO. FIN DEL JUEGO.");
                                this.iconBreath.setTexture('breath');
                                var blockBackground = this.add.image(960, 540, 'background').setDepth(2).setInteractive();
                                blockBackground.setOrigin(0.5, 0.5);
                                blockBackground.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);
                                blockBackground.setAlpha(0.6);
                                var endButton = this.add.image(960, 660, 'start').setOrigin(0.5, 0.5).setDepth(3).setScale(0.4).setInteractive({ useHandCursor: true });
                                endButton.on('pointerdown', function () {
                                    this.scene.start(EndGame);  
                                }, this);
                            }else{
                                this.dialogText.setText("LA VÍCTIMA CAE AL SUELO.");
                                this.iconBreath.setTexture('unknown');
                                this.iconResponse.setTexture('unknown');
                                this.basics.setReply(false);
                                this.basics.setState("danger");
                                this.indice = 8;
                                this.currentCards = [
                                    'Observar',
                                    'Responde 1',
                                    'Responde 2',
                                ];
                                this.drawCards();
                            }
                        } 
                        if(card === "Dar palmadas en la espalda"){
                            if(localStorage.getItem('protocolOp') == "ERC"){
                                this.dialogText.setText("DAS 5 GOLPES EN LA ESPALDA DE LA VÍCTIMA.");
                            }else{
                                this.dialogText.setText("NO ES RECOMENDABLE DAR PALMADAS EN LA ESPALDA.");
                                this.cameras.main.shake(300);
                            }                         
                        }                       
                        break;
                    
                    case 2:
                        if(card === "Animar a toser"){
                            if(this.isChocking){
                                this.dialogText.setText("LA VÍCTIMA NO PUEDE TOSER Y SE ESTÁ AHOGANDO.");
                                this.cameras.main.shake(300);
                            }else{
                                if(chance<=5){
                                    this.dialogText.setText("LA VÍCTIMA HA CONSEGUIDO EXPULSAR EL OBJETO TOSIENDO. FIN DEL JUEGO.");
                                    var blockBackground = this.add.image(960, 540, 'background').setDepth(2).setInteractive();
                                    blockBackground.setOrigin(0.5, 0.5);
                                    blockBackground.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);
                                    blockBackground.setAlpha(0.1);
                                    var endButton = this.add.image(960, 660, 'start').setOrigin(0.5, 0.5).setDepth(3).setScale(0.4).setInteractive({ useHandCursor: true });
                                    endButton.on('pointerdown', function () {
                                        this.scene.start(EndGame);     
                                    }, this);                    
                                }else{
                                    this.dialogText.setText("LA VÍCTIMA HA DEJADO DE RESPIRAR Y SE ECHA LAS MANOS AL CUELLO.");
                                    this.isChocking = true;
                                }
                            }
                        }
                        if(card === "Maniobra de Heimlich" && this.isChocking){
                            this.scene.setVisible(false);
                            this.scene.sleep();
                            this.scene.launch(Choking, {escenaSupuesto: this});
                            if(chance<=25){
                                this.dialogText.setText("LA VÍCTIMA HA CONSEGUIDO EXPULSAR EL OBJETO. FIN DEL JUEGO.");
                                this.iconBreath.setTexture('breath');
                                var blockBackground = this.add.image(960, 540, 'background').setDepth(2).setInteractive();
                                blockBackground.setOrigin(0.5, 0.5);
                                blockBackground.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);
                                blockBackground.setAlpha(0.1);
                                var endButton = this.add.image(960, 660, 'start').setOrigin(0.5, 0.5).setDepth(3).setScale(0.4).setInteractive({ useHandCursor: true });
                                endButton.on('pointerdown', function () {
                                    this.scene.start(EndGame);     
                                }, this);
                            }else{
                                this.dialogText.setText("NO HA EXPULSADO EL OBJETO. LA VÍCTIMA DEJA DE RESPONDER Y CAE AL SUELO.");
                                this.basics.setReply(false);
                                this.basics.setState("danger");
                                this.indice = 8;
                                this.currentCards = [
                                    'Observar',
                                    'Responde 1',
                                    'Responde 2',
                                ];
                                this.drawCards();
                            }
                        }
                        if(card === "Dar palmadas en la espalda"){
                            if(localStorage.getItem('protocolOp') == "ERC"){
                                this.dialogText.setText("DAS 5 GOLPES EN LA ESPALDA DE LA VÍCTIMA.");
                            }else{
                                this.dialogText.setText("NO ES RECOMENDABLE DAR PALMADAS EN LA ESPALDA.");
                                this.cameras.main.shake(300);
                            }
                        }
                        break;         
                }
                break;
        }
    }

    changeCard(oldCard){
        for(var i = 0; i < 3; i++){
            if(this.currentCards[i]==oldCard){
                this.currentCards[i]=this.cards[this.indice];
                this.indice++;
                this.drawCards(this.textCards);
            }
        }
    }

    drawCards(){
        this.cardImage1 = this.add.image(200, 990, 'carta').setScale(1.3, 0.7).setInteractive({ useHandCursor: true });
        this.cardImage2 = this.add.image(960, 990, 'carta').setScale(1.3, 0.7).setInteractive({ useHandCursor: true });
        this.cardImage3 = this.add.image(1720, 990, 'carta').setScale(1.3, 0.7).setInteractive({ useHandCursor: true });

        this.cardImage1.on('pointerdown', function () {            
            this.checkOrder(this.currentCards[0]);
            this.cardImage1.tint= 0xCCCCCC;
            setTimeout(() => {
                this.cardImage1.tint= 0xFFFFFF;           
            }, 150);
        }, this);
        this.cardImage2.on('pointerdown', function () {
            this.checkOrder(this.currentCards[1]);
            this.cardImage2.tint= 0xCCCCCC;
            setTimeout(() => {
                this.cardImage2.tint= 0xFFFFFF;           
            }, 150);
        }, this);
        this.cardImage3.on('pointerdown', function () {
            this.checkOrder(this.currentCards[2]);
            this.cardImage3.tint= 0xCCCCCC;
            setTimeout(() => {
                this.cardImage3.tint= 0xFFFFFF;          
            }, 150);
        }, this);

        this.textCards[0].setText(this.currentCards[0]).setDepth(1);
        this.textCards[1].setText(this.currentCards[1]).setDepth(1);
        this.textCards[2].setText(this.currentCards[2]).setDepth(1);      
    }

    getCallMessage(){
        var message;
        if(this.basics.getReply() && this.basics.getBreathe()){
            message = "Tenemos a una persona que responde y respira, parece que le duele el pecho.";
        }else if(!this.basics.getReply() && this.basics.getBreathe()){
            message = "Tenemos a una persona que no responde a estímulos.\nLe hemos gritado al oído y golpeado los hombros, pero respira normalmente.";
        }else if(!this.basics.getReply() && !this.basics.getBreathe()){
            message = "Tenemos una persona que no responde y no respira.";
        }else if(this.basics.getReply() && !this.basics.getBreathe()){
            message = "Tenemos una persona que responde pero no respira.";
        }
        return message;
    }

    checkAmbulance(){
        var chance = this.basics.getChance();
        switch(this.turnAmbulance){
            case 1:
                if(chance<=20){
                    this.dialogText.setText("YA HA LLEGADO LA AMBULANCIA. FIN DEL JUEGO.");
                    var blockBackground = this.add.image(960, 540, 'background').setDepth(2).setInteractive();
                    blockBackground.setOrigin(0.5, 0.5);
                    blockBackground.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);
                    blockBackground.setAlpha(0.1);
                    var endButton = this.add.image(960, 660, 'start').setOrigin(0.5, 0.5).setDepth(3).setScale(0.4).setInteractive({ useHandCursor: true });
                    endButton.on('pointerdown', function () {
                        this.scene.start(EndGame);     
                    }, this);
                }else if (chance<=40){
                    if(!this.basics.getReply() || !this.basics.getBreathe()){
                        this.dialogText.setText("OBSERVAMOS QUE AHORA LA VÍCTIMA RESPONDE Y RESPIRA.");
                    }else{
                        this.dialogText.setText("LA VÍCTIMA SIGUE RESPONDIENDO Y RESPIRANDO.");
                    }
                    this.basics.setReply(true);
                    this.basics.setBreathe(true);
                    this.iconBreath.setTexture('breath');
                    this.iconResponse.setTexture('response');              
                }else{
                    // Cuando deja de responder y respirar muestra un mensaje u otro si antes no respondía ni respiraba o si
                    if(!this.basics.getReply() && !this.basics.getBreathe()){                   
                        this.dialogText.setText("LA VÍCTIMA SIGUE SIN RESPONDER NI RESPIRAR.");
                    }else if(this.basics.getReply() || this.basics.getBreathe()){
                        this.dialogText.setText("¡CUIDADO! LA VÍCTIMA HA DEJADO DE RESPONDER Y RESPIRAR.");
                    }
                    this.basics.setReply(false);
                    this.basics.setBreathe(false);
                    this.iconBreath.setTexture('noBreath');
                    this.iconResponse.setTexture('noResponse');
                }
                this.turnAmbulance++;
                break;

            case 2:
                if(chance<=70){
                    this.dialogText.setText("YA HA LLEGADO LA AMBULANCIA. FIN DEL JUEGO.");
                    var blockBackground = this.add.image(960, 540, 'background').setDepth(2).setInteractive();
                    blockBackground.setOrigin(0.5, 0.5);
                    blockBackground.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);
                    blockBackground.setAlpha(0.1);
                    var endButton = this.add.image(960, 660, 'start').setOrigin(0.5, 0.5).setDepth(3).setScale(0.4).setInteractive({ useHandCursor: true });                   
                    endButton.on('pointerdown', function () {
                        this.scene.start(EndGame);     
                    }, this);
                }else if (chance>69 && chance<=80){
                    if(this.basics.getReply() && this.basics.getBreathe()){
                        this.dialogText.setText("LA VÍCTIMA SIGUE RESPONDIENDO Y RESPIRANDO.");
                    }else{
                        this.dialogText.setText("LA VÍCTIMA AHORA RESPONDE Y RESPIRA.");
                    }
                    this.basics.setReply(true);
                    this.basics.setBreathe(true);
                    this.dialogText.setText("LA VÍCTIMA AHORA RESPONDE Y RESPIRA.");
                    this.iconBreath.setTexture('breath');
                    this.iconResponse.setTexture('response');
                }else{
                    if(!this.basics.getReply() && !this.basics.getBreathe()){                  
                        this.dialogText.setText("LA VÍCTIMA SIGUE SIN RESPONDER NI RESPIRAR.");
                    }else if(this.basics.getReply() || this.basics.getBreathe()){
                        this.dialogText.setText("¡CUIDADO! LA VÍCTIMA HA DEJADO DE RESPONDER Y RESPIRAR.");
                    }
                    this.basics.setReply(false);
                    this.basics.setBreathe(false);
                    this.iconBreath.setTexture('noBreath');
                    this.iconResponse.setTexture('noResponse');                
                }
                this.turnAmbulance++;
                break;

            case 3:
                this.dialogText.setText("YA HA LLEGADO LA AMBULANCIA. FIN DEL JUEGO.");
                var blockBackground = this.add.image(960, 540, 'background').setDepth(2).setInteractive();
                blockBackground.setOrigin(0.5, 0.5);
                blockBackground.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);
                blockBackground.setAlpha(0.1);
                var endButton = this.add.image(960, 660, 'start').setOrigin(0.5, 0.5).setScale(0.4).setInteractive({ useHandCursor: true });
                endButton.setDepth(3);
                endButton.on('pointerdown', function () {
                    console.log("BOTON FINAL")
                    this.scene.start(EndGame);    
                }, this);             

                this.cardImage1.setInteractive(false);
                break;
        }
    }

    sosCard(){
        //console.log("CARTA SOS")
        // Ver en que estado estamos y que cartas se han jugado. Desabilitar botón después de jugarlo
        if(!this.sosPlayed){
            switch(this.basics.getState()){
                case "protect":
                    if(!this.cardEntorno){
                        this.dialogText.setText("JUEGA LA CARTA DE ENTORNO");
                    }else if(!this.cardCalma){
                        this.dialogText.setText("JUEGA LA CARTA DE CALMA");
                    }else{
                        this.dialogText.setText("JUEGA LA CARTA DE EPI");
                    }
                    break;
                
                case "danger":
                    if(this.supuesto.getDanger() === "No hay peligro en la zona"){
                        this.dialogText.setText("JUEGA LA CARTA OBSERVAR");
                    }else if(this.supuesto.danger === "Neutralizable"){
                        this.dialogText.setText("JUEGA LA CARTA NEUTRALIZAR PELIGRO");
                    }else{
                        this.dialogText.setText("JUEGA LA CARTA HUIR A ZONA SEGURA");
                    }
                    break;
                
                case "check":
                    if(!this.cardResponde1){
                        this.dialogText.setText("JUEGA LA CARTA RESPONDE 1");
                    }else if(!this.cardResponde2){
                        this.dialogText.setText("JUEGA LA CARTA RESPONDE 2");
                    }else if(this.endCheckResponse && !this.cardFrenteMenton){
                        this.dialogText.setText("JUEGA LA CARTA FRENTE MENTÓN");
                    }else if(this.cardFrenteMenton && !this.cardRespira1){
                        this.dialogText.setText("JUEGA LA CARTA RESPIRA 1");
                    }else if(this.cardFrenteMenton && this.cardRespira1){
                        this.dialogText.setText("JUEGA LA CARTA RESPIRA 2");
                    }
                    break;
                
                case 'call':
                    this.dialogText.setText("JUEGA LA CARTA LLAMAR AL 112");
                    break;
                
                case 'minigames':
                    if(this.basics.getReply() && this.basics.getBreathe()){
                        this.dialogText.setText("JUEGA LA CARTA OBSERVAR AL PACIENTE");
                    } else if(!this.basics.getReply() && !this.basics.getBreathe()){
                        this.dialogText.setText("JUEGA LA CARTA RCP");
                    }else if(!this.basics.getReply() && this.basics.getBreathe()){
                        this.dialogText.setText("JUEGA LA CARTA POSICIÓN LATERAL DE SEGURIDAD");
                    }
                    break;
                
                case 'choking':
                    if(!this.isChocking){
                        this.dialogText.setText("JUEGA LA CARTA ANIMAR A TOSER");
                    }else{
                        this.dialogText.setText("JUEGA LA CARTA MANIOBRA DE HEIMLICH");
                    }
                    break;
            }
        }else{
            this.dialogText.setText("SOLO PUEDES PEDIR AYUDA UNA VEZ.");
        }
        this.sosPlayed = true;
        this.sosButton.setAlpha(0.5)
    }
}