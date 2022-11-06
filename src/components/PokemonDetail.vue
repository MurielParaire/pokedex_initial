<template>
     <section class="contentDetails">
        <button @click="finishedDetail" class="returnButton">Retour</button>
        <h1 @click="getPId()" id="titre"> {{ this.$data.pokemon.name }} </h1>
        <p class="detailId">Id : {{ this.$data.pokemon.id }}</p>
        <div class="aroundContent">
            <div id="generalInformation">
                <div id="general">
                    <p>species : {{pokemon.species}}</p>
                    <p>weight : {{pokemon.weight}}</p>
                    <p>base experience : {{pokemon.base_experience}}</p>
                    <p>height : {{pokemon.height}}</p>
                </div>
                <div id="specific">
                    <p>abilities : {{pokemon.abilities}}</p>
                    <p>forms : {{pokemon.forms}}</p>
                </div>
                <div id="stats">{{pokemon.stats}}</div>
            </div>



            <img :src="this.$data.pokemon.url" alt="An image of {{this.$data.pokemon.name}}" id="detailImage" />
        </div> 
   </section>
</template>

  
<script>
const Pokedex = require("pokeapi-js-wrapper")
const P = new Pokedex.Pokedex();
import Pokemon from '../Pokemon.js'

export default {
    name: "pokemon_detail",
    emits: ['finishedDetail'],
    data() {
        return {
            pokemon: {}
        }
    },
    methods: {
        getPId() {
            console.log('A')
            console.log(this.id)
        },
        finishedDetail() {
            this.$emit('finishedDetail');
        },

        async getPokemon() {
            let pokemon = await P.getPokemonByName(this.id);
            let p = new Pokemon(pokemon.id, pokemon.name, pokemon.types, pokemon.sprites.other["official-artwork"].front_default);
            p.weight = pokemon.weight;
            p.abilities = [];
            p.forms = [];
            pokemon.abilities.forEach(ability => {
                p.abilities.push(ability.ability.name)
            });
            pokemon.forms.forEach(form => {
                p.forms.push(form.name);
            });
            p.species = pokemon.species.name;
            p.base_experience = pokemon.base_experience;
            p.height = pokemon.height;
            p.stats = [];
            pokemon.stats.forEach(stat => {
                p.stats.push(stat.base_stat);
            });
            this.$data.pokemon = p;
            console.log(p);
        },



    },
    props: {
        id: {
            required: true
        }
    },
    mounted() {
        this.getPokemon()
    }
}
</script>