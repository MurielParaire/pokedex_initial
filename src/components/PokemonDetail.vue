<template>

    <section class="contentDetails">
        <div v-if="this.$props.language === 'en'" class="transparent">
            <button @click="finishedDetail" class="returnButton return">Return</button>
            <h1 id="titre"> {{ this.$data.pokemon.name }} </h1>
        </div>
        <div v-else class="transparent">
            <button @click="finishedDetail" class="returnButton return">Retour</button>
            <h1 id="titre"> {{ this.$props.frenchName }} </h1>
        </div>
        <p class="detailId">Id : {{ this.$data.pokemon.id }}</p>
        <div class="aroundContent">
            <div id="generalInformation">
                <div id="general">
                    <p class="species"><span class='attributes'> {{this.$data.current[0]}} : </span>{{ pokemon.species }}</p>
                    <p class='weight'><span class='attributes'>{{this.$data.current[1]}} : </span> {{ pokemon.weight }} kg</p>
                    <p class='experience'><span class='attributes'>{{this.$data.current[2]}} : </span> {{ pokemon.base_experience
                    }}
                    </p>
                    <p class='height'><span class='attributes'>{{this.$data.current[3]}} : </span> {{ pokemon.height }} m</p>
                </div>
                <br>
                <div id="stats">
                    <div v-for="(stat, index) in this.$data.pokemon.stats" :key="stat[0]" :id="stat[0]">
                        <p ><span class='attributes'>{{ this.$data.current[4 + index] }} : </span> {{ stat[1] }}</p>
                    </div>
                </div>
                <br>
                <div id="specific">
                    <p><span class='attributes specificattr'> {{this.$data.current[this.$data.current.length - 1]}} : </span>
                    <ul v-for="ability in this.$data.pokemon.abilities" :key="ability" class="ability">
                        <li class="abilities">{{ ability }}</li>
                    </ul>
                    </p>
                </div>

                <!--
                <div id="evolutions" v-for="id in this.$data.evolutionsIds" :key="id">{{ id }}</div>-->
            </div>


            <img :src="this.$data.pokemon.url" alt="An image of {{this.$data.pokemon.name}}" id="detailImage" />
            <div id="types">
                <div v-for="type in this.$data.pokemon.types" :key="type">
                    <span class="type" v-bind:class=type.type.name>{{ type.type.name }}</span>
                </div>
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
            pokemon: {},
            evolutionsNames: [],
            evolutionsIds: [],
            evolutionsSprites: [],
            En: ['species', 'weight', 'base experience', 'height', 'Hit Points', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed', 'Abilities'],
            Fr: ['espèce', 'poids', 'expérience de base', 'hauteur', 'Points de Vie', 'Attaque', 'Défense', 'Attaque spéciale', 'Défense spéciale', 'Vitesse', 'Abilités'],
            current: 'nothing'
        }
    },
    methods: {
        finishedDetail() {
            this.$emit('finishedDetail');
        },

        async getPokemon() {
            let pokemon = await P.getPokemonByName(this.id).catch(console.log('hi'));
            let p = new Pokemon(pokemon.id, pokemon.name, pokemon.types, pokemon.sprites.other["official-artwork"].front_default);
            p.weight = pokemon.weight;
            p.abilities = [];
            pokemon.abilities.forEach(ability => {
                p.abilities.push(ability.ability.name)
            });
            p.species = pokemon.species.name;
            p.base_experience = pokemon.base_experience;
            p.height = pokemon.height;
            p.stats = [];
            pokemon.stats.forEach(stat => {
                p.stats.push([stat.stat.name, stat.base_stat]);
            });
            this.$data.pokemon = p;
            this.getEvolutions(pokemon.id)

        },

        async getEvolutions(id) {
            let evolutions = await P.getEvolutionChainById(id)
            this.$data.evolutionsIds = []
            this.$data.evolutionsNames = []
            this.$data.evolutionsSprites = []
            let evolutionNames = [];
            if ('evolves_to' in evolutions.chain && evolutions.chain.evolves_to.length > 0) {
                if ('evolves_to' in evolutions.chain.evolves_to[0] && evolutions.chain.evolves_to[0].evolves_to.length > 0) {
                    evolutionNames.push(evolutions.chain.evolves_to[0].evolves_to[0].species.name)
                }
                evolutionNames.push(evolutions.chain.evolves_to[0].species.name)
            }
            for (let counter = 0; counter < evolutionNames.length; counter++) {
                let pokemon = await P.getPokemonByName(evolutionNames[counter]);
                let poke = JSON.parse(JSON.stringify(pokemon))
                let evolution = { 'name': evolutionNames[counter], 'id': poke.id, 'url': poke.sprites.other["official-artwork"].front_default }
                this.$data.evolutionsIds.push(evolution.id)
                this.$data.evolutionsNames.push(evolution.name)
                this.$data.evolutionsSprites.push(evolution.url)
            }
        }

    },
    props: {
        id: {
            required: true
        },
        language: {
            required: true
        },
        frenchName: {
            required: true
        }
    },
    watch: {
        language: function(lan) {
            if (lan === 'en') {
                this.$data.current = this.$data.En;
            }
            else {
                this.$data.current = this.$data.Fr;
            }
        }
    },
    mounted() {
        if (this.$props.language === 'en') {
                this.$data.current = this.$data.En;
            }
            else {
                this.$data.current = this.$data.Fr;
            }
        this.getPokemon()
    }
}
</script>