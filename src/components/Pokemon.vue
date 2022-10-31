
<template>
    <h1>Pokedex</h1>
</template>

<script>
const Pokedex = require("pokeapi-js-wrapper")
const P = new Pokedex.Pokedex();

class Pokemon {
  constructor(id, name, types, url) {
    this.name = name;
    this.id = id;
    this.types = types;
    this.url = url;
  }

  getPokemon(poke) {
    this.name = poke.name;
    return this;
  }

  showPokemon() {
    let htmlText = "<img src= '" + this.url + "' alt='photo of the pokemon " + this.name + "'/> <p class='textId'>id : " + this.id + "</p> <h1> " + this.name + " </h1>";
    console.log(this);
    console.log(htmlText);
    return htmlText;
  }
}

let interval = {
  offset: 0,
  limit: 20,
}

P.getPokemonsList(interval)
  .then(function (response) {
    let pokemons = [];
    let poke = document.getElementById("pokemonList");
    for (let counter = 0; counter < response.results.length; counter++) {
      fetch(response.results[counter].url)
        .then((data) => data.json())
        .then((resp) => {
          console.log(resp);
          let p = new Pokemon(resp.id, resp.name, resp.types, resp.sprites.other["official-artwork"].front_default);
          pokemons.push(poke);
          let li = document.createElement('li');
          li.innerHTML = p.showPokemon();
          poke.appendChild(li);
        }
        )

    }



  });
    
</script>