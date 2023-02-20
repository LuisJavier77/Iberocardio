export default class LocalInfo {
    constructor(){
    }
    
    /**
     * A partir de la llave correspondiente devuelve ya parseado el valor buscado en localStorage
     * @param  {[String]} key key we are looking for in localStorage
     * @return {[Object]} Object contained in the storage
     */
    getInfo(key){
        let gotit = localStorage.getItem(key);
        return JSON.parse(gotit);
    }

    setInfo(key,value){
            value = JSON.stringify(value);
            localStorage.setItem(key, value);
    }

    delete(key){
        localStorage.removeItem(key);
    }
}