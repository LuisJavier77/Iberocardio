export default class Basics {
    constructor(){
        this.autoProtect = ["Calma", "EPI", "Entorno"];
        this.state = "protect";
        this.protectPlace = ["Neutralizar peligros", "Mover"];
        this.ResplyVictim = ["Responde 1, Responde 2"];
        this.check = ["Observar", "Primeros auxilios", "Responde 1", "Responde 2", "Maniobra frente menton", "Respira 1", "Respira 2"];
        this.reply = this.getYesNo();
        this.breathe = this.getYesNo();
        this.help = this.getYesNo();
        //this.inDanger =this.getYesNo();
        this.sequence = {
            "autoprotect":["Autoprotección","Calma","EPI"],
            "protectPlace":["Proteger zona"],
            "protectVictim": ["Eliminar peligros"],
            "check":[{"Responde":["Pedir ayuda", "Fin"]}, {"Respira":["Llamar 112"]}],
        };
    }

    createsquence(){
        // switch(){
        //     case true:
            
        //     case false:
        // }
    }
    getState(){
        return this.state;
    }
    setState(newState){
        return this.state = newState;
    }
    getProtect(){
        return this.autoProtect;
    }

    getCheck(){
        return this.check;
    }

    getReply(){
        
        return this.reply;
    }

    setReply(reply){
        this.reply = reply;
    }
    
    getBreathe(){
        return this.breathe;
    }

    setBreathe(breathe){
        this.breathe = breathe;
    }

    getHelp(){
        return this.help;
    }

    getYesNo(){
        return [~~(Math.random()*2)] == 1 ? true : false;
    }    

    getInDanger(){
        return this.protectPlace;
    }

    getChance(){
        return ~~(Math.random()*99 + 1)
    }
}
