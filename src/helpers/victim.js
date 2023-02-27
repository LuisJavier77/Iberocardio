
export default class Victim {
    constructor(){
        this.victim = ["niño","adulto"];
    }

    setVictim() {
        return this.victim[~~(Math.random()*this.victim.length)];
    }
   
}

