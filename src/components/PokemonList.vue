<template>
    <!-- title -->
    <h1>Pokedex</h1>
    <!-- search -->
    <section class="search" v-if="this.$props.language === 'en'">
        <!-- return button -->
        <button v-if="this.$data.inSpecific === true" @click="finishedSearch" class="return">Return</button>
        <!-- search bar -->
        <input id='searchbar' type="text" placeholder="Pikachu" v-model="search">
        <!-- search button => enter information from the search bar -->
        <button @click=this.searchPokemon()>Search</button>
    </section>
    <section class="search" v-else>
        <!-- return button -->
        <button @click="finishedSearch" v-if="this.$data.inSpecific === true" class="return">Retour</button>
        <!-- search bar -->
        <input id='searchbar' type="text" placeholder="Artikodin" v-model="search">
        <!-- search button => enter information from the search bar -->
        <button @click=this.searchPokemon()>Chercher</button>
    </section>
    
    <!-- pokemon list -->
    <section class="pokemons">
        <div class="content">
            <ul id="pokemonList">
                <!-- show every pokemon (image, id, name) thanks to v-for -->
                <div
                v-for="pokemon in this.pokemonList"
                :key="pokemon.id"
                @click="setPokemonId(pokemon.id)">
                    <li>
                        <div class="container" 
                        v-bind:id=pokemon.name 
                        v-bind:class=pokemon.types[0].type.name>
                            <img :src="pokemon.url"  />
                            <p class='textId'>id : {{ pokemon.id }}</p>
                            <h1 v-if="this.$props.language === 'en'" >{{ pokemon.name }}</h1>
                            <h1 v-else >{{ pokemon.frenchName }}</h1>
                        </div> 
                    </li>
                </div>
            </ul>
        </div>
    </section>
    <!-- button to add 20 pokemons at the end of our list -->
    <div v-if="this.$data.inSpecific === false">
        <button class='addPokemonButton' @click=this.get20Pokemons() v-if="this.$props.language === 'en'" >Click to add more pokemon's !</button>
        <button class='addPokemonButton' @click=this.get20Pokemons() v-else >Ajouter des pokemons !</button>
    </div>
</template>

<script>
//import the pokedex from the wrapper
const Pokedex = require("pokeapi-js-wrapper")
const P = new Pokedex.Pokedex();
//import our pokemon class
import Pokemon from '../Pokemon.js'
//import csv to json
import csvToJson from 'csvtojson';


//export our app
export default {
    name:"pokemon_list",
    emits: ['getPokemonId'],
    props : {
        language : {
            required: true
        }
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
            //the names of the pokemon in french and english
            pokemonNames : [['no pokemon with 0 exists', 'pas de pokemon avec id 0 existe']],
            //to know if we have searched a specific pokemon or are in the overall list
            inSpecific : false
        }
    },
    methods: {
        //adds 20 to the offset
        updateOffset() {
            this.$data.offset += 20;
        },
        //gets the next 20 pokemon from the api
        async get20Pokemons() {
            //if the user has searched for a pokemon, we need to clear the list before adding the first 20 or it will appear twice
            if (this.$data.pokemonList.length < 20) {
                this.$data.pokemonList = [];
            }
            let interval = { offset: this.$data.offset, limit: 20 }
            //getting the next 20 pokemon
            let response = await P.getPokemonsList(interval);
            //for each pokemon we need to get its name, id and image
            for (let counter = 0; counter < response.results.length; counter++) {
                let fetchResult = await fetch(response.results[counter].url);
                let data = await fetchResult.json();
                if (counter === response.results.length - 1) {
                    this.getPokemon(data);
                }
                else {
                    this.getPokemon(data);
                }
            }
            this.updateOffset()
            this.getNamesFrench()
        },
        
        getPokemon(response) {
            let resp = response
            let p = new Pokemon(resp.id, resp.name, resp.types, resp.sprites.other["official-artwork"].front_default);
            p.frenchName = this.$data.pokemonNames[resp.id].frenchName
            this.$data.pokemonList.push(p);
        },

        setPokemonId(id) {
            this.$emit('getPokemonId', id);
        },

        async searchPokemon() {
            let pokemon = await P.getPokemonByName(this.$data.search);
            let p = new Pokemon(pokemon.id, pokemon.name, pokemon.types, pokemon.sprites.other["official-artwork"].front_default);
            this.$data.pokemonList = [p];
            this.$data.offset = 0;
            this.$data.inSpecific = true
        },

        handlefetchError() {
            alert('Oh non ! Il semble que les pokemons sont parties prendre une pause et ne sont pas disponible en ce moment :c')
        },

        finishedSearch() {
            this.$data.inSpecific = false
            this.get20Pokemons()
        },

        async getNamesFrench() {
            let names = await fetch("https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_species_names.csv")
            let res = await names.text()
            const json = await csvToJson({
                delimiter: ','
            }).fromString(res);
            let name = {}
            for (let counter = 0; counter < json.length; counter++) {
                //get good lines
                
                if (json[counter].local_language_id === '5') {
                    name = {'id': json[counter].pokemon_species_id, 'frenchName': json[counter].name };
                }
                else if (json[counter].local_language_id === '9') {
                    name.englishName = json[counter].name;
                }
                else if (json[counter].local_language_id === '11') {
                    this.$data.pokemonNames.push(name);
                    name = {}
                }
            }
        }

    },

    mounted() {
        this.get20Pokemons()
        this.getNamesFrench()
    },

}







</script>