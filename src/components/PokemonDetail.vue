<template>
    
     <section class="contentDetails">
        <button @click="finishedDetail" class="returnButton">Retour</button>
        <h1 @click="getPId()" id="titre"> {{ this.$data.pokemon.name }} </h1>
        <p class="detailId">Id : {{ this.$data.pokemon.id }}</p>
        <div class="aroundContent">
            <div id="generalInformation">
                <div id="general">
                    <p class="species"><span class='attributes'>species : </span>{{pokemon.species}}</p>
                    <p class='weight'><span class='attributes'>weight : </span> {{pokemon.weight}}</p>
                    <p class='experience'><span class='attributes'>base experience : </span> {{pokemon.base_experience}}</p>
                    <p class='height'><span class='attributes'>height : </span> {{pokemon.height}}</p>
                </div>
                <div id="specific">
                    <p><span class='attributes specificattr'>abilities : </span>
                        <ul v-for="ability in this.$data.pokemon.abilities" :key="ability" class="ability"><li class="abilities">{{ability}}</li></ul></p>
                    <p><span class='attributes'>forms : </span>{{pokemon.forms}}</p>
                </div>
                <div id="stats">{{pokemon.stats}}

                </div>
            </div>



            <img :src="this.$data.pokemon.url" alt="An image of {{this.$data.pokemon.name}}" id="detailImage" />
            <div id="types"
                v-for="(index, type) in this.$data.pokemon.types"
                :key="index">
                <span class="type" v-bind:class=pokemon.types[0].type.name >{{this.$data.pokemon.types[type].type.name}}</span>
            </div>
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
            console.log(Object.keys(this.$data.pokemon.types))
            console.log(this.$data.pokemon.types[0])
        }

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