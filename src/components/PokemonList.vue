<template>
    <h1>Pokedex</h1>
    <section class="pokemons">
        <button @click=this.get20Pokemons()>Click to add !</button>
        <div id="content">

            <div v-for="pokemon in pokemonList" :key="pokemon.id">{{ pokemon.showPokemon() }}
                <!-- contenu -->
            </div>
            <ul id="pokemonList">


            </ul>
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
        get20Pokemons() {
            console.log('a')
            let interval = { offset: this.$data.offset, interval: 20 }
            console.log('b')
            P.getPokemonsList(interval)
                .then(function (response) {
                    for (let counter = 0; counter < response.results.length; counter++) {
                        fetch(response.results[counter].url)
                            .then(function (data) {
                                this.$data.data = data.json();
                                if (counter === response.results.length - 1) {
                                    this.getPokemons(data, true);
                                }
                                else {
                                    this.getPokemons(data, false);
                                }
                            })
                    }
                });
            },
getPokemons(resp, last) {
    let p = new Pokemon(resp.id, resp.name, resp.types, resp.sprites.other["official-artwork"].front_default);
    console.log('c')
    this.$data.pokemonList.push(p);
    if (last === true) {
        console.log('here')
        console.log('d')
        console.log(this.$data.pokemonList)
        console.log('e')
        this.appendChildren();
    }
},
appendChildren() {
    console.log('HA')
    let poke = document.getElementById("pokemonList");
    this.$data.pokemonList.sort((poke, mon) => { return poke.id - mon.id });
    this.$data.pokemonList.forEach(p => {
        let li = document.createElement('li');
        li.innerHTML = p.showPokemon();
        poke.appendChild(li);
    });
}

    }
}







</script>