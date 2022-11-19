<template>
    <!-- Inserting our search bar component -->
    <search_bar :language="language" @searchPokemon="searchPokemon" :inSpecific="inSpecific" @finishedSearch="finishedSearch" />
    <!-- pokemon list -->
    <section class="pokemons content">
            <ul id="pokemonList">
                <!-- show every pokemon (image, id, name) thanks to v-for -->
                <article
                v-for="pokemon in this.pokemonList"
                :key="pokemon.id"
                @click="setPokemonId(pokemon)">
                    <li>
                        <section class="container" 
                        v-bind:id=pokemon.name 
                        v-bind:class=pokemon.types[0].type.name>
                            <img :src="pokemon.url" :alt="'image of ' + pokemon.name" />
                            <p class='textId'>id : {{ pokemon.id }}</p>
                            <h1 v-if="this.$props.language === 'en'" >{{ pokemon.name }}</h1>
                            <h1 v-else >{{ pokemon.frenchName }}</h1>
                        </section> 
                    </li>
                </article>
            </ul>
    </section>
    <!-- button to add 20 pokemons at the end of our list -->
    <div v-if="this.$data.inSpecific === false && this.$data.loading === false">
        <button class='addPokemonButton' id='addPokemon' @click=this.get20Pokemons() v-if="this.$props.language === 'en'" >Click to add more pokemon's !</button>
        <button class='addPokemonButton' id='addPokemon' @click=this.get20Pokemons() v-else >Ajouter des pokemons !</button>
    </div>
    <a id="goUp" href="#header">
        <img src="../assets/up_arrow.png" alt="arrow up" />
    </a>
</template>

<script>
//import the pokedex from the wrapper
const Pokedex = require("pokeapi-js-wrapper")
const P = new Pokedex.Pokedex();
//import our pokemon class
import Pokemon from '../Pokemon.js'

//import the search bar component
import search_bar from './Searchbar.vue'


//export our app
export default {
    name:"pokemon_list",
    emits: ['getPokemonId', 'getPokemonName', 'getPokemonInfo'],
    props : {
        language : {
            required: true
        },
        pokemonNames : {}
    },
    components: {
        search_bar
    },
    data() {
        return {
            //contains all our pokemons
            pokemonList: [],
            //keeps track of what pokemon we need to search for next, or what the offset will be when we ask the api
            offset: 0,
            //the id of the pokemon if the user searches for it or clicks on it
            id: 0,
            //the content of the search bar
            search: '',
            //to know if we have searched a specific pokemon or are in the overall list
            inSpecific : false,
            //to stop users from spamming the button
            loading : false
        }
    },
    methods: {
        /**
         * @description adds 20 to the offset
         */
        updateOffset() {
            this.$data.offset += 20;
        },
        /**
         * @description gets the next 20 pokemon from the api
         */
        async get20Pokemons() {
            //hiding our add more pokemon button
            this.$data.loading = true;
            //if the user has searched for a pokemon, we need to clear the list before adding the first 20 or it will appear twice
            if (this.$data.pokemonList.length < 20) {
                this.$data.pokemonList = [];
            }
            //defining our interval and making sure we don't search any more pokemon than there are
            let interval = { offset: this.$data.offset, limit: 20 }
            if (this.$data.offset === 905) {
                return 0;
            }
            if (this.$data.offset > 885) {
                interval.limit = 905 - this.$data.offset;
            }
            //getting the next 20 pokemon
            let response = await P.getPokemonsList(interval).catch( (err) => {
                console.log(err);
                })
            //for each pokemon we need to get its name, id and image
            for (let counter = 0; counter < response.results.length; counter++) {
                let fetchResult = await fetch(response.results[counter].url).catch((err) => console.log(err));
                let data = await fetchResult.json();
                this.getPokemon(data);
            }
            //updtating our offset for the next api call
            this.updateOffset();
            //showing our add more pokemon button
            this.$data.loading = false;
        },
        
        /**
         * @description creating one pokemon from the information of the api
         */
        getPokemon(response) {
            let p = new Pokemon(response.id, response.name, response.types, response.sprites.other["official-artwork"].front_default);
            if (this.$props.pokemonNames.length > p.id) {
                p.frenchName = this.$props.pokemonNames[p.id].frenchName
            }
            this.$data.pokemonList.push(p);
        },

        /**
         * @description tell our parent component the pokemon on which the user has clicked
         */
        setPokemonId(pokemon) {
            pokemon.espece = this.$props.pokemonNames[pokemon.id].espece;
            pokemon.species = this.$props.pokemonNames[pokemon.id].species;
            this.$emit('getPokemonInfo', pokemon)
        },

        /**
         * @description searching for a pokemon
         */
        async searchPokemon(name) {
            //if search bar is empty, return 0
            if (name === '') {
                return 0
            }
            let x = parseInt(name)
            if (this.$props.language === 'fr') {
                if (x.toString() === 'NaN') {
                    var result = this.$props.pokemonNames.find(n => {
                        return n.frenchName === name;
                    })
                    if (result === undefined) {
                        return 0;
                    }
                    name = result.englishName;
                }
            }
            let pokemon = await P.getPokemonByName(name).catch((err) => console.log(err));
            let p = new Pokemon(pokemon.id, pokemon.name, pokemon.types, pokemon.sprites.other["official-artwork"].front_default);
            p.frenchName = this.$props.pokemonNames[p.id].frenchName
            this.$data.pokemonList = [p];
            //resetting the offset so that when the user returns on the list page, he will find all pokemon from the start
            this.$data.offset = 0;
            //telling our programm that we are now in the specific vue with only one pokemon
            this.$data.inSpecific = true
        },

        /**
         * @description telling our program that we aren't in a specific vue anymore and loading the fist 20 pokemon
         */
        finishedSearch() {
            this.$data.inSpecific = false
            this.get20Pokemons()
        }



    },

    async mounted() {
        this.get20Pokemons()
    },

}







</script>