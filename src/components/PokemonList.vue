<template>
    <h1>Pokedex</h1>
    <section class="pokemons">
    <button @click=this.get20Pokemons()>Click to add !</button>
    <div id="content">
        <div class="pokes" v-for="pokemon in this.$data.pokemonList" :key="pokemon.id">{{ this.appendChild(pokemon)}}</div>
        <ul id="pokemonList"></ul>
    </div>
</section>
</template>

<script>
const Pokedex = require("pokeapi-js-wrapper")
const P = new Pokedex.Pokedex();
import Pokemon from '../Pokemon.js'

export default {
    data() {
        return {
            pokemonList: [],
            offset: 0,
            data: {}
        }
    },
    methods: {
        updateOffset() {
            console.log(this.$data.offset)
            this.offset += 20;
            console.log(this.$data.offset)
        },
        async get20Pokemons() {
            let interval = { offset: this.$data.offset, limit: 20 }
            console.log(interval)
            let response = await P.getPokemonsList(interval)
            for (let counter = 0; counter < response.results.length; counter++) {
                let fetchResult = await fetch(response.results[counter].url);
                let data = await fetchResult.json();
                if (counter === response.results.length - 1) {
                    this.getPokemon(data, true);
                }
                else {
                    this.getPokemon(data, false);
                }
            }
        },
        getPokemon(response, last) {
            let resp = response
            let p = new Pokemon(resp.id, resp.name, resp.types, resp.sprites.other["official-artwork"].front_default);
            this.$data.pokemonList.push(p);
            if (last === true) {
                //this.appendChildren();
            }
        },
        appendChild(p) {
            let poke = document.getElementById("pokemonList");
            let li = document.createElement('li');
            li.innerHTML = p.showPokemon();
            poke.appendChild(li);
        }

    }, 
    mounted() {
        this.get20Pokemons()
    }
}







</script>