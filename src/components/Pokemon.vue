
<template>
    <h1>Pokedex</h1>
</template>

<script>
import Pokemon from '../Pokemon.js'

const Pokedex = require("pokeapi-js-wrapper")
const P = new Pokedex.Pokedex();


let interval = {
    offset: 0,
    limit: 20,
}

P.getPokemonsList(interval)
    .then(function (response) {
        let pokemons = [];
        let poke = document.getElementById("pokemonList");
        console.log(response)
        for (let counter = 0; counter < response.results.length; counter++) {
            fetch(response.results[counter].url)
                .then((data) => data.json())
                .then((resp) => {
                    console.log(resp)
                    let p = new Pokemon(resp.id, resp.name, resp.types, resp.sprites.other["official-artwork"].front_default);
                    pokemons.push(p);
                    let li = document.createElement('li');
                    li.innerHTML = p.showPokemon();
                    poke.appendChild(li);
                }
            )
        }
    });

/*
    export default {
    data: () => {
      return {
        offset: 0,
      }
    },
    components: {},
    methods: {}
  }
  */

</script>