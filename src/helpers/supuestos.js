import Place from "./place";
import Victim from "./victim";
import Danger from "./danger";
import LocalInfo from "./localInfo";

export default class Supuesto {
    constructor(basics){
        this.place = new Place().setPlace();
        this.victim = new Victim().setVictim();
        this.basics = basics;
        this.danger =  new Danger().setDanger();
        this.localInfo = new LocalInfo();
    }

    setSupuesto(){
    }

    getSupuesto(){
        // console.log(this.inDanger);
        //let peligro = this.inDanger == true ? "está" : "no está"
        this.localInfo.setInfo("supuesto",{"place" : this.place,"Danger" : this.danger,"victim" : this.victim});
        console.log(this.localInfo.getInfo("supuesto"));
        return this.place + ", el "+ this.victim +" " + peligro +" en una zona peligrosa";
    }

    getPlace(){
        return this.place;
    }

    setCardOrder(){

    }
    
    getCardOrder(){

    }

    getDanger(){
        return this.danger;
    }
    
    setDanger(danger){
        this.danger = danger;
    }

    deleteSupuesto(){
        this.local.delete("supuesto");
    }
}