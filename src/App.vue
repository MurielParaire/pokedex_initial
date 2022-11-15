<template>
  <!-- Our pokemon general page -->
  <pokemon_general />
</template>

<script>
//importing the component
import pokemon_general from './components/PokemonGeneral.vue'

//exporting our app
export default {
  name: 'App',
  components: {
    pokemon_general
  }

}
</script>

<style>

/*defining the general style of our application */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 4%;
}
</style>
