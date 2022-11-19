<template>
  <section id="header">
    <section id="language">
    <img src="../assets/France.png" alt="the french flag" class="languageFlag" @click="this.$data.language = 'fr'" v-bind:class="{ selected: (language === 'fr') }" /> 
    <span></span>
    <img src="../assets/UK.png" alt="the flag of the UK" class="languageFlag" @click="this.$data.language = 'en'" v-bind:class="{ selected: (language === 'en') }"  />
    </section>
     <h1 class="yellow">Pokedex</h1>
  </section>
    <!-- If the user wants to see the detail of a pokemon, then the component pokemon_detail is shown, else pokemon_list 
        the id of the pokemon that the user wants to see is then passed onto our detail page via the getPokemonId method 
        the switching between the two pages is done by verifying if the variable detail is true (showing detail page) or false (showing list)-->
    <pokemon_list v-if="this.$data.detail === false"  @getPokemonInfo="getPokemonInfo" :language="language"  :pokemonNames="pokemonNames" />
    <pokemon_detail v-else  @finishedDetail="finishedDetail" :language="language" :pokemonInfo="pokemonInfo"  :pokemonNames="pokemonNames" />
</template>

<script>
//import the two components
import pokemon_list from  './PokemonList.vue';
import pokemon_detail from './PokemonDetail.vue';
//import csv to json
import csvToJson from 'csvtojson';
//import the pokeapiwrapper
const Pokedex = require("pokeapi-js-wrapper")
const P = new Pokedex.Pokedex();

//export our app 
export default {
  name: "pokemon_general",
  data() {
    return {
      detail : false,
      language : 'en',
      pokemonInfo : '',
      //the names of the pokemon in french and english
      pokemonNames : [['no pokemon with 0 exists', 'pas de pokemon avec id 0 existe']],
    }
  },
  components: {
    pokemon_list,
    pokemon_detail
  },
  methods: {
    /**
    * @description a function setting the information of the pokemon
    * @param {pokemon} pokemon : the pokemon the user wants to view
    */
    getPokemonInfo(pokemon) {
      this.$data.pokemonInfo = pokemon;
      this.$data.detail = true;
    },

    /**
    * @description setting detail = true to show the detail page
    */
    getDetails() {
      this.$data.detail = true;
    },

    /**
    * @description setting detail = false to show the list page
    */
    finishedDetail() {
      this.$data.detail = false;
    },

    /**
    * @description get the csv with the translation of all pokemons
    */
    async getNamesFrench() {
            let names = await fetch("https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_species_names.csv").catch((err) => console.log(err))
            let res = await names.text()
            const json = await csvToJson({
                delimiter: ','
            }).fromString(res);
            let name = {}
            for (let counter = 0; counter < json.length; counter++) {
                //get the lines we need
                //language id 5 = french
                if (json[counter].local_language_id === '5') {
                    name = {'id': json[counter].pokemon_species_id, 'frenchName': json[counter].name.toLowerCase(), 'espece': json[counter].genus };
                }
                //language id 9 = english
                else if (json[counter].local_language_id === '9') {
                    name.englishName = json[counter].name.toLowerCase() ;
                    name.species = json[counter].genus;
                    this.$data.pokemonNames.push(name);
                    name = {}
                }
            }
        },

    /**
    * @description change the language
    */
    changeLanguage() {
      if (this.$data.language === 'en') {
        this.$data.language = 'fr';
      }
      else {
        this.$data.language = 'en';
      }
    }
  },

  async mounted() {
    //for the best user experience we need to be able to switch to french at any time and therefore need the translation for the pokemon names to be loaded.
    await this.getNamesFrench()
  }

}

</script>