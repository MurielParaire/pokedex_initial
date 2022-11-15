//class Pokemon to keep track of all the important information
export default class Pokemon {
    constructor(id, name, types, url) {
        //name of the pokemon
        this.name = name;
        //id of the pokemon
        this.id = id;
        //types (fire, water, flying, ..)
        this.types = types;
        //image url
        this.url = url;
    }
}
