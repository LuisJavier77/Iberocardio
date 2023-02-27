import LocalInfo from "../helpers/localInfo";
import Supuesto from "../helpers/supuestos";
import Basics from "../helpers/basics";

import { CallGame, EndGame, Scenes, LateralPosition, DEA } from '../consts/SceneKeys'
import eventsCenter from "../helpers/eventEmitter";

export default class cardGame extends Phaser.Scene {
    constructor() {
        super("cardGame");
    }
    //supuesto;
    score = 0;
    scoreText;
    callMessage;

    init(data)
    {
        this.parentScene = data.scene;
    }

    preload() {
        // Cargar imágenes de cartas

        // Cargar supuesto
        this.currentScene = this;
        this.basics = new Basics();
        this.supuesto = new Supuesto(this.basics);
        this.local = new LocalInfo();
        this.load.image("card", "src/assets/images/card.png");
    }
    counterProtect = 0;
    counterDanger = 0;
    response1Flag = false;
    response2Flag = false;
    frenteMentonFlag = false;
    breath1Flag = false;
    breath2Flag = false;
    observarFlag = false;
    noHelpFlag = false;

    sceneDanger;
    compresionesFlag = false;

    checkOrder(card){
        // console.log(card.name);

        switch (this.basics.getState()) {
            // Subdividir según las prioridades que quieran dar
            case "protect":
                if((this.basics.getProtect()).includes(card.name))
                {
                    this.counterProtect += 1;
                    if(this.counterProtect == 3){
                        this.basics.setState("danger");                    
                    }
                    
                    return true;
                }
                console.log("Recuerda la autoprotección");
                return false;

            case "danger":
                if((this.basics.getInDanger()).includes(card.name)){
                    if(card.name == "Neutralizar peligros" && this.counterDanger == 0){
                        this.counterDanger += 1;
                        if(this.supuesto.danger === "No hay peligro en la zona"){
                            console.log("Bien, pero no era necesario. Ya no hay ningún peligro");
                        }
                        if(this.supuesto.danger === "Neutralizable"){
                            this.supuesto.setDanger("No hay peligro en la zona");
                            this.sceneDanger.text = "PELIGRO: " + this.supuesto.danger;
                            this.sceneDanger.setFill('green');
                        }
                        if(this.supuesto.danger == 'No neutralizable'){
                            this.sceneDanger.text = "PELIGRO: El peligro es extremo";
                        }                       
                        return true;
                    }else if((this.basics.getInDanger()).includes(card.name) && this.counterDanger == 1){
                        // Si mueves a la víctima cuando no hay que moverla o si no la mueves cuando tienes que moverla
                        if(this.supuesto.danger != "No neutralizable" && card.name == "Mover"){
                            if(this.supuesto.danger != "No neutralizable"){
                                console.log("Mover puede agrabar las lesiones y es una zona segura");
                            }else{
                                console.log("No moverlo puede hacer que la víctima o los reanimadores sufrais lesiones o incluso la muerte");
                            }
                            return false;
                        }else{
                            this.supuesto.setDanger("No hay peligro en la zona");
                            this.sceneDanger.text = "PELIGRO: " + this.supuesto.danger;
                            this.sceneDanger.setFill('green');
                            this.basics.setState("check");
                            return true;
                        }
                    }else{
                        console.log("¿La zona es segura?");
                    }
                }
                
            case "check":
                if((this.basics.getCheck()).includes(card.name)){
                    switch (card.name){
                        case "Observar":
                            console.log("Descripción de la situación de la víctima a primera vista.")
                            this.observarFlag = true;
                            return true;

                        case "Responde 1":
                            //console.log("**********",this.basics.getReply());
                            if(this.observarFlag)
                            {
                                if(this.basics.getReply()){
                                    console.log("La persona responde a estímulos: se mueve, habla y parpadea.");
                                    this.callMessage = "Tenemos a una persona que responde y respira, parece que le duele el pecho.";
                                    //this.basics.setState("call");
                                    this.response2Flag = true;
                                }else{
                                    console.log("La persona no responde");
                                }
                                this.response1Flag = true;
                                return true;
                            }
                            else{
                                console.log("¿No será mejor observar primero?");
                            }
                            return false;

                        case "Responde 2":
                            // Establecemos un 20% de que responda
                            if(this.response1Flag){
                                if(!this.basics.getReply()){
                                    if(this.basics.getChance()>80){
                                        this.basics.setReply(true);
                                        console.log("La víctima responde cuando le golpeamos los hombros");
                                    }
                                    else{
                                        console.log("La víctima sigue sin responder");
                                    }
                                    this.response2Flag = true;
                                    return true;
                                }
                                else{
                                    console.log("No es necesario, la víctima ya responde");
                                    return true;
                                }
                                
                            }else{
                                console.log("Primero hay que comprobar si responde hablándole");
                            }
                            break;

                        case "Maniobra frente menton":
                            if(this.response2Flag){
                                this.frenteMentonFlag = true;
                                return true;
                            }
                            return false;

                        case "Respira 1":
                            if(this.frenteMentonFlag){
                                this.breath1Flag = true;

                                if(this.breath2Flag && this.basics.getBreathe()){
                                    console.log("Es innecesario. Ya has comprobado que respira");
                                }
                                if(this.basics.getBreathe())
                                {
                                    this.basics.setState("call");
                                    console.log("Si Respira");
                                }else{
                                    if(this.breath2Flag){
                                        this.basics.setState("call");
                                    }
                                    console.log("No respira");
                                }
                                
                                return true;
                            }else{
                                console.log("Primero realizar la maniobra frente mentón")
                            }
                            return false;

                            case "Respira 2":
                                if(this.frenteMentonFlag){
                                    this.breath2Flag = true;

                                    if(this.breath1Flag && this.basics.breathe()){
                                        console.log("Es innecesario. Ya has comprobado que respira");
                                    }                                  
                                    if(this.basics.getBreathe())
                                    {
                                        this.basics.setState("call");
                                        console.log("Si Respira");
                                    }else{
                                        if(this.breath1Flag){
                                            this.basics.setState("call");
                                        }
                                        console.log("No respira");
                                    }
                                    //this.basics.setState("call");
                                    return true;
                                }
                                return false;
                    }
                }else{
                    console.log("¿No será mejor mirar y preguntar?");
                    return false;
                }

            case "Fin":
                console.log (" Pantalla de fin con puntuación");
                this.scene.start(EndGame);
                this.scene.remove();
                break;

            case "call":
                if("Llamar 112" == card.name) {
                    console.log (" Pantalla llamada al 112");
                    // Ocultar la escena de los supuestos y la escena de las cartas y lanzar la escena del minijuego de la llamada
                    this.scene.setVisible(false); // Escena de Supuesto
                    this.parentScene.scene.setVisible(false) // Escena de Cartas
                    this.scene.launch(CallGame, {msg: this.callMessage, breathe: this.basics.breathe, reply: this.basics.reply, parentScene: this.parentScene, cardScene: this});
                    this.basics.setState('minigames');
                }else{
                    console.log("Es buen momento para llamar a emergencias");
                }
                return false;

            case "help":
                if(card.name === "Pedir ayuda") {
                    //console.log(this.basics.getHelp ? "Si" : "No"  + " hay ayuda");
                    if(this.basics.getHelp()){
                        console.log("Hay ayuda");
                        this.basics.setState("call");
                    }else{
                        console.log("NO hay ayuda");
                        this.noHelpFlag = true;
                        this.basics.setState("check");
                    }

                    return true;
                }
                return false;

            case "minigames":
                if((this.basics.getReply() && this.basics.getBreathe()) || (!this.basics.getReply() && this.basics.getBreathe())){
                    if(card.name === "Vigilar estado"){
                        this.scene.setVisible(false);
                        this.scene.sleep();
                        this.parentScene.scene.setVisible(false);
                        this.scene.start(EndGame);
                        return true;
                    }
                }
                if(!this.basics.getReply() && this.basics.getBreathe()){
                    if(card.name === "Posición lateral de seguridad"){
                        this.scene.setVisible(false);
                        this.scene.sleep();
                        this.parentScene.scene.setVisible(false);
                        this.scene.launch(LateralPosition, {parentScene: this.parentScene, cardScene: this});
                        return true;
                    }
                }
                if(!this.basics.getReply() && !this.basics.getBreathe()){
                    if(card.name === "Compresiones"){
                        this.compresionesFlag = true;
                        return true;
                    }
                }
                if(card.name === "Ventilaciones" && this.compresionesFlag){
                    return true;
                }
                if(card.name === "Pedir desfibrilador"){
                    if(this.compresionesFlag){
                        this.scene.setVisible(false);
                        this.scene.sleep();
                        this.scene.launch(DEA, {parentScene: this.parentScene, cardScene: this});
                        this.parentScene.scene.stop();
                        this.scene.stop()
                    }
                }
                return false;
        }
    }

    changeScore(ptos){
        this.score += ptos;
        this.scoreText.setText( "Puntuación: " + this.score);
    }

    create() {
        //console.log(this.basics.getHelp());
        // console.log("AAAAAAAAAAAAA")
        // console.log(Array.isArray(["a","b"]))
        // console.log(Array.isArray({"a":["a","b"]}))

        // Generar supuesto
        this.supuesto.setSupuesto();
        eventsCenter.emit("supuesto", this.supuesto);

        this.counterProtect = 0;
        this.counterDanger = 0;
        this.responseFlag = false;
        this.breathFlag = false;
        this.observarFlag = false;
        this.noHelpFlag = false;
        this.sceneDanger;
        this.compresionesFlag = false;

        //console.log(this.supuesto.getSupuesto());
        this.scoreText = this.add.text(0,0 , "Puntuación: " + this.score);
        this.sceneDanger = this.add.text(960, 770, "PELIGRO: " + this.supuesto.danger, {fontSize: 30});
        switch(this.supuesto.danger){
            case 'No hay peligro en la zona':
                this.sceneDanger.setFill('green');
                break;
            case 'Neutralizable':
                this.sceneDanger.setFill('yellow');
                break;
            case 'No neutralizable':
                this.sceneDanger.setFill('red');
                break;
        }
        this.sceneDanger.setOrigin(0.5, 0.5);

        // Crear un grupo de cartas vacío
        let cardGroup = this.add.group();

        // Crear un array con las imágenes de las cartas
        let cardImages = [
            '/card.png'
        ];

        // Crear un array con los nombres de las cartas
        let cardNames = [
            'Entorno',
            'Calma',
            'EPI',
            'Neutralizar peligros',
            'Mover',
            'Observar',
            'Responde 1',
            'Responde 2',
            'Maniobra frente menton',
            'Respira 1',
            'Respira 2',
            'Pedir ayuda',
            'Llamar 112',
            'Vigilar estado',
            'Posición lateral de seguridad',
            'Compresiones',
            'Ventilaciones',
            'Pedir desfibrilador'
        ];

        // Crear un bucle para crear y mostrar las cartas
        let x = 510;
        let y = this.game.config.height * 6/7;
        let text;
        var numCards = cardNames.length;

        for (let i = 0; i < numCards; i++) {
            // Crear una nueva carta
            // Contenedor
            let card = this.add.image(x, y, "card");
            let position = ~~(Math.random()*cardNames.length);
            card.name = cardNames[position];
            cardNames.splice(position,1);
            card.selected = false;
            card.setScale(0.5);
            x += 60;
            // Añadir la carta al grupo de cartas
            cardGroup.add(card);
            // Hacer que la carta sea interactiva
            card.setInteractive();

            // Añadir un evento de clic para mostrar la carta entera
            card.on('pointerover', function () {
                if(!this.selected){
                    this.setScale(0.9);
                    console.log("CARTA: " + card.name);
                }
            });

            // Obtener nombre de la carta al pulsarla
            card.on('pointerdown', function () {
                let correct = this.scene.checkOrder(card);
                //console.log(this);
                if(!this.selected)
                {
                    if(correct){
                        this.scene.changeScore(5);
                        //console.log(this.scene);
                        this.x = this.scene.game.config.width / 1.44;
                        this.y = this.scene.game.config.height / 2;
                        this.selected = true;
                        //this.remove(false);
                        cardGroup.children.iterate(function (child) {
                            //console.log(this);
                            if (child.y == (this.scene.game.config.height / 2) && this != child){
                                child.x -= this.displayOriginX;
                            }
                        }, this);
                    }else{
                        this.scene.changeScore(-5);
                        this.scene.cameras.main.shake(300);
                    }
                }
            });
            // Añadir un evento de soltado para ocultar la carta entera
            card.on('pointerout', function () {
                this.setScale(0.5);
            });
        }
    }

    stop() {
        //this.supuesto.deleteSupuesto();
    }
}