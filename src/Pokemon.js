export default class Pokemon {
    constructor(id, name, types, url) {
        this.name = name;
        this.id = id;
        this.types = types;
        this.url = url;
        this.color = this.getBackgroundColor();
    }

    getPokemon(poke) {
        this.name = poke.name;
        return this;
    }

    getBackgroundColor() {
        console.log(this.types);
        if (this.types[0].type.name === 'grass')
            return 'rgb(153, 233, 142)'
        if (this.types[0].type.name === 'normal')
            return 'rgb(202, 202, 202)'
        if (this.types[0].type.name === 'poison')
            return 'rgb(234, 176, 255)'
        if (this.types[0].type.name === 'fire')
            return 'rgb(255, 191, 150)'   
        if (this.types[0].type.name === 'water')
            return 'rgb(150, 213, 255)' 
        if (this.types[0].type.name === 'bug')
            return 'rgb(100, 172, 98)' 
        if (this.types[0].type.name === 'flying')
            return 'rgb(146, 230, 235)' 
        if (this.types[0].type.name === 'electric')
            return 'rgb(235, 235, 146)' 
        if (this.types[0].type.name === 'ground')
            return 'rgb(236, 211, 141)' 
        if (this.types[0].type.name === 'fairy')
            return 'rgb(248, 185, 255)' 
        if (this.types[0].type.name === 'fighting')
            return 'rgb(194, 166, 123)' 
        if (this.types[0].type.name === 'psychic')
            return 'rgb(200, 149, 203)' 
        if (this.types[0].type.name === 'rock')
            return 'rgb(152, 131, 104)' 
        if (this.types[0].type.name === 'ghost')
            return 'rgb(169, 114, 182)' 
        if (this.types[0].type.name === 'ice')
            return 'rgb(138, 191, 226)' 
        if (this.types[0].type.name === 'dragon')
            return 'rgb(209, 76, 76)' 
        if (this.types[0].type.name === 'dark')
            return 'rgb(67, 65, 65)' 
        if (this.types[0].type.name === 'steel')
            return 'rgb(118, 118, 118)' 
        return 'black'
    }

    showPokemon() {
        let htmlText = "<div class='container' id='" + this.name + "'> <img src= '" + this.url + "' alt='photo of the pokemon " + this.name + "'/> <p class='textId'>id : " 
        + this.id + "</p> <h1> " + this.name + " </h1> </div> <style> #" + this.name + "{ background-color: " + this.getBackgroundColor() + ";} </style>";
        return htmlText;
    }

}
