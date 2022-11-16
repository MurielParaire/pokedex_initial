<template>
  <section id="header">
    <button class="language" @click="changeLanguage">Language</button>
    <h1 class="yellow">Pokedex</h1>
  </section>
    <!-- If the user wants to see the detail of a pokemon, then the component pokemon_detail is shown, else pokemon_list 
        the id of the pokemon that the user wants to see is then passed onto our detail page via the getPokemonId method 
        the switching between the two pages is done by verifying if the variable detail is true (showing detail page) or false (showing list)-->
    <pokemon_list v-if="this.$data.detail === false" @getPokemonId="getPokemonId" @getPokemonName="getPokemonName" v-bind:language="language" />
    <pokemon_detail v-else :id="id" @finishedDetail="finishedDetail" :language="language" :frenchName="frenchName"/>
</template>

<script>
//import the two components
import pokemon_list from  './PokemonList.vue';
import pokemon_detail from './PokemonDetail.vue';

//export our app 
export default {
  name: "pokemon_general",
  data() {
    return {
      detail : false,
      id : 0,
      language : 'en',
      frenchName : ''
    }
  },
  components: {
    pokemon_list,
    pokemon_detail
  },
  methods: {
    getPokemonId(id) {
      this.$data.id = id;
      this.getDetails();
    },
    getPokemonName(name) {
      this.$data.frenchName = name;
    },
    //setting detail = true to show the detail page
    getDetails() {
      this.$data.detail = true;
    },
    //setting detail = false to show the list page
    finishedDetail() {
      this.$data.detail = false;
    },

    changeLanguage() {
      if (this.$data.language === 'en') {
        this.$data.language = 'fr';
      }
      else {
        this.$data.language = 'en';
      }
    }
  }

}

</script>