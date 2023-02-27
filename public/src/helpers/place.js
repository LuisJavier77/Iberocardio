
export default class Place {
    constructor(){
        this.place = ["Parque en una ciudad", "Bosque", "Cocina", "Baño", "Patio de colegio", "Carretera"];
    }

    setPlace() {
        return this.place[~~(Math.random()*this.place.length)];
    }
}

