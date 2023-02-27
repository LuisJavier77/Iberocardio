export default class Basics {
    constructor(){
        this.autoProtect = ["Autoprotección","Calma","EPI","Proteger zona","Eliminar peligros"];
        this.state = "protect";
        // this.protectPlace = ["Proteger zona"];
        // this.protectVictim = ["Eliminar peligos"];
        this.check = ["Observar", "Responde", "Respira"];
        this.reply = this.getYesNo();
        this.breathe = this.getYesNo();
        this.help = this.getYesNo();
        //this.inDanger =this.getYesNo();
        this.sequence = {
            "autoprotect":["Autoprotección","Calma","EPI"],
            "protectPlace":["Proteger zona"],
            "protectVictim": ["Eliminar peligos"],
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
        return "Primeros auxilios";
    }

    getReply(){
        
        return this.reply ? "Fin" : "help";
    }
    
    getBreathe(){
        return "call";
    }

    getHelp(){
        return this.help;
    }

    getYesNo(){
        return [~~(Math.random()*2)] == 1 ? true : false;
    }    

    // getInDanger(){
    //     return this.inDanger;
    // }
}
