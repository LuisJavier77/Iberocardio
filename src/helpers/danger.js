export default class Danger {
    constructor(){
        this.danger = ["Neutralizable", "No neutralizable", "No hay peligro en la zona"];
    }

    setDanger() {
        return this.danger[~~(Math.random()*this.danger.length)];
    }
   
}