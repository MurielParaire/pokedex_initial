<template>
  <pokemon_vue />
</template>

<script>
import pokemon_vue from './components/Pokemon.vue'

export default {
  name: 'App',
  components: {
    pokemon_vue 
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
