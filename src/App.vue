<template>
  <pokemon_general />
</template>

<script>
import pokemon_general from './components/PokemonGeneral.vue'

export default {
  name: 'App',
  components: {
    pokemon_general
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
