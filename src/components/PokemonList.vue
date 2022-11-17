<template>
    <!-- search -->
    <section class="search" v-if="this.$props.language === 'en'">
        <!-- return button -->
        <button v-if="this.$data.inSpecific === true" @click="finishedSearch" class="return">Return</button>
        <!-- search bar -->
        <input id='searchbar' type="text" placeholder="Pikachu" v-model="search">
        <!-- search button => enter information from the search bar -->
        <button id="searchButton" @click=this.searchPokemon()>Search</button>
    </section>
    <section class="search" v-else>
        <!-- return button -->
        <button @click="finishedSearch" v-if="this.$data.inSpecific === true" class="return">Retour</button>
        <!-- search bar -->
        <input id='searchbar' type="text" placeholder="Artikodin" v-model="search">
        <!-- search button => enter information from the search bar -->
        <button id="searchButton" @click=this.searchPokemon()>Chercher</button>
    </section>
    
    <!-- pokemon list -->
    <section class="pokemons content">
            <ul id="pokemonList">
                <!-- show every pokemon (image, id, name) thanks to v-for -->
                <article
                v-for="pokemon in this.pokemonList"
                :key="pokemon.id"
                @click="setPokemonId(pokemon)">
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
                </article>
            </ul>
    </section>
    <!-- button to add 20 pokemons at the end of our list -->
    <div v-if="this.$data.inSpecific === false">
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
//import csv to json
import csvToJson from 'csvtojson';


//export our app
export default {
    name:"pokemon_list",
    emits: ['getPokemonId', 'getPokemonName', 'getPokemonInfo'],
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
            this.updateOffset()
            this.getNamesFrench()
        },
        
        getPokemon(response) {
            if (this.$data.pokemonNames.length < 2) {
                this.getNamesFrench()
            }
            console.log(response.id)
            let p = new Pokemon(response.id, response.name, response.types, response.sprites.other["official-artwork"].front_default);
            p.frenchName = this.$data.pokemonNames[response.id].frenchName
            this.$data.pokemonList.push(p);
        },

        setPokemonId(pokemon) {
            pokemon.espece = this.$data.pokemonNames[pokemon.id].espece;
            pokemon.species = this.$data.pokemonNames[pokemon.id].species;
            this.$emit('getPokemonInfo', pokemon)
        },

        async searchPokemon() {
            let name = this.$data.search.toLowerCase() ;
            if (name === '') {
                return 0
            }
            let x = parseInt(name)
            if (this.$props.language === 'fr') {
                if (x.toString() === 'NaN') {
                    var result = this.$data.pokemonNames.find(n => {
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
            p.frenchName = this.$data.pokemonNames[p.id].frenchName
            this.$data.pokemonList = [p];
            this.$data.offset = 0;
            this.$data.inSpecific = true
        },

        finishedSearch() {
            this.$data.inSpecific = false
            this.get20Pokemons()
        },

        async getNamesFrench() {
            let names = await fetch("https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_species_names.csv").catch((err) => console.log(err))
            let res = await names.text()
            const json = await csvToJson({
                delimiter: ','
            }).fromString(res);
            let name = {}
            for (let counter = 0; counter < json.length; counter++) {
                //get good lines
                
                if (json[counter].local_language_id === '5') {
                    name = {'id': json[counter].pokemon_species_id, 'frenchName': json[counter].name.toLowerCase(), 'espece': json[counter].genus };
                }
                else if (json[counter].local_language_id === '9') {
                    name.englishName = json[counter].name.toLowerCase() ;
                    name.species = json[counter].genus;
                }
                else if (json[counter].local_language_id === '11') {
                    this.$data.pokemonNames.push(name);
                    name = {}
                }
            }
        }

    },

    async mounted() {
        await this.getNamesFrench()
        this.get20Pokemons()
        
    },

}







</script>