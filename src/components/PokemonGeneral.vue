<template>
    <pokemon_list v-if="this.$data.detail === false" @getPokemonId="getPokemonId" />
    <pokemon_detail v-else :id="id" @finishedDetail="finishedDetail" />
</template>

<script>
import pokemon_list from  './PokemonList.vue';
import pokemon_detail from './PokemonDetail.vue';

export default {
  name: "pokemon_general",
  data() {
    return {
      detail : false,
      id: 0
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
    getDetails() {
      console.log(this.$data.id)
      this.$data.detail = true;
      this.getPId(this.$data.id);
    },
    getPId(id) {
      this.$emit('getPId', id);
    },
    finishedDetail() {
      this.$data.detail = false
    }
  }

}

</script>