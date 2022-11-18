<template>
        <!-- search -->
        <section class="search" v-if="this.$props.language === 'en'">
        <!-- return button -->
        <button v-if="this.$props.inSpecific === true" @click="finishedSearch" class="return">Return</button>
        <!-- search bar -->
        <input id='searchbar' type="text" placeholder="Pikachu" v-model="search">
        <!-- search button => enter information from the search bar -->
        <button id="searchButton" @click=this.searchPokemon()>Search</button>
    </section>
    <section class="search" v-else>
        <!-- return button -->
        <button @click="finishedSearch" v-if="this.$props.inSpecific === true" class="return">Retour</button>
        <!-- search bar -->
        <input id='searchbar' type="text" placeholder="Artikodin" v-model="search">
        <!-- search button => enter information from the search bar -->
        <button id="searchButton" @click=this.searchPokemon()>Chercher</button>
    </section>
</template>

<script>
//import the pokedex from the wrapper
const Pokedex = require("pokeapi-js-wrapper")
const P = new Pokedex.Pokedex();


export default {
    name: "pokemon_general",
    emits: ['finishedSearch', 'searchPokemon'],
    data() {
    },
    props: {
        language: {
            required: true
        },
        inSpecific: {
            required: true
        }
    },
    methods: {
        searchPokemon() {
            this.$emit('searchPokemon', this.search.toLowerCase());
        },
        finishedSearch() {
            this.$emit('finishedSearch')
        }
    }
}

</script>

<style scoop>
#searchbar {
    background-color: transparent;
    border-color: #3D7DCA;
}


/* search button */


#searchButton {
    position: relative;
    color: #3D7DCA;
    text-decoration: none;
    font-size: medium;
    font-weight: bold;
    border: 0;
    margin-left: 0.4%;
  }
  
  #searchButton:hover {
    text-shadow: #003A70;
    transform: scale(1.1);
    transition: 0.7s;
  }
  
  #searchButton::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #003A70;
    transform: scaleX(0);
    transition: transform 0.5s ease;
  }
  
  #searchButton:hover::before {
    transform: scaleX(0.9);
  }
</style>