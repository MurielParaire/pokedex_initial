<template>
    <h1>Pokedex</h1>
    <section class="search">
        <div class="searchbar">
            <input type="text" placeholder="Artikodin">
            <span></span>
        </div>
    </section>
    <section class="pokemons">
        <div id="content">
            <ul id="pokemonList">
                <div
                v-for="pokemon in this.pokemonList"
                :key="pokemon.id"
                @click="this.tell(pokemon)">
                    <li>
                        <div class="container" v-bind:id=pokemon.name v-bind:class=pokemon.types[0].type.name>
                            <img :src="pokemon.url"  />
                            <p class='textId'>id : {{ pokemon.id }}</p>
                            <h1>{{ pokemon.name }}</h1>
                        </div> 
                    </li>
                </div>
            </ul>
        </div>
    </section>
    <button @click=this.get20Pokemons()>Click to add more pokemon !</button>
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
            data: {},
            id: 0
        }
    },
    methods: {
        tell(pokemon) {
            console.log(pokemon)
            console.log(pokemon.id)
        },
        updateOffset() {
            console.log(this.$data.offset)
            this.$data.offset += 20;
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
            this.updateOffset()
        },
        getPokemon(response, last) {
            let resp = response
            let p = new Pokemon(resp.id, resp.name, resp.types, resp.sprites.other["official-artwork"].front_default);
            this.$data.pokemonList.push(p);
            if (last === true) {
                //this.appendChildren();
            }
        },
        /*
        appendChildren() {
            let poke = document.getElementById("pokemonList");
            for (let counter = this.$data.offset; counter < this.$data.pokemonList.length; counter = counter + 1) {
                let li = document.createElement('li');
                let p = this.$data.pokemonList[counter];
                li.addEventListener('click', this.getID(p.id))
                li.innerHTML = p.showPokemon();
                poke.appendChild(li);
            }
            this.updateOffset()
        },
        */
        getID(id) {
            console.log(this.id);
            this.$data.id = id;
            console.log(this.$data.id)
        }

    },
    mounted() {
        this.get20Pokemons()
    }
}







</script>