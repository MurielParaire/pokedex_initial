<template>

    <section class="contentDetails">

        <div v-if="this.$props.language === 'en'" class="transparent">
            <button @click="finishedDetail" class="returnButton return">Return</button>
        </div>

        <div v-else class="transparent">
            <button @click="finishedDetail" class="returnButton return">Retour</button>
        </div>

        <h1 id="titre"> {{ this.$data.pokemon.name }} </h1>
        <p class="detailId">Id : {{ this.$data.pokemon.id }}</p>

        <section class="aroundContent">

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
                <div v-if="this.$props.language === 'en'" id="specific">
                    <p><span class='attributes specificattr'> {{this.$data.current[this.$data.current.length - 1]}} : </span>
                    <ul v-for="ability in this.$data.pokemon.abilities" :key="ability" class="ability">
                        <li class="abilities">{{ ability }}</li>
                    </ul>
                    </p>
                </div>

                <div v-if="this.$props.language === 'fr'" id="specific">
                    <p><span class='attributes specificattr'> {{this.$data.current[this.$data.current.length - 1]}} : </span>
                    <ul v-for="ability in this.$data.pokemon.frenchAbilities" :key="ability" class="ability">
                        <li class="abilities">{{ ability }}</li>
                    </ul>
                    </p>
                </div>

                <!--
                <div id="evolutions" v-for="id in this.$data.evolutionsIds" :key="id">{{ id }}</div>-->
            </div>
            <img :src="this.$data.pokemon.url" alt="An image of {{this.$data.pokemon.name}}" id="detailImage" />

            <section id="types" v-if="this.$props.language === 'en'">
                <div v-for="type in this.$data.pokemon.types" :key="type">
                    <span class="type" v-bind:class=type.type.name>{{ type.type.name }}</span>
                </div>
            </section>
            <section id="types" v-else>
                <div v-for="type in this.$data.pokemon.types" :key="type">
                    <span class="type" v-bind:class=type.type.name>{{ type.type.frenchName }}</span>
                </div>
            </section>


            <section id="evolutions">
            <article
                v-for="pokemon in this.$data.pokemon.evolution"
                :key="pokemon.id">
                    <li>
                        <div class="evolutionsContainer" 
                        v-bind:id=pokemon.name >
                            <img :src="pokemon.url"  />
                            <p class='textId'>id : {{ pokemon.id }}</p>
                            <h1 v-if="this.$props.language === 'en'" >{{ pokemon.name }}</h1>
                            <h1 v-else >{{ pokemon.frenchName }}</h1>
                        </div> 
                    </li>
                </article></section>

        </section>

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
            //the pokemon with all its information we want to show
            pokemon: {},
            //the names of the information we want to show in both languages and the current
            En: ['species', 'weight', 'base experience', 'height', 'Hit Points', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed', 'Abilities'],
            Fr: ['espèce', 'poids', 'expérience de base', 'taille', 'Points de Vie', 'Attaque', 'Défense', 'Attaque spéciale', 'Défense spéciale', 'Vitesse', 'Talents'],
            current: 'error'
        }
    },
    methods: {
        //telling the parent component (PokemonGeneral) that the user has finished looking at the detail page
        finishedDetail() {
            this.$emit('finishedDetail');
        },

        //charging our pokemon
        async getPokemon() {
            let pokemon = await P.getPokemonByName(this.$props.pokemonInfo.id).catch((err) => console.log(err));
            let p = new Pokemon(pokemon.id, pokemon.name, pokemon.types, pokemon.sprites.other["official-artwork"].front_default);
            p.weight = pokemon.weight;
            p.abilities = [];
            pokemon.abilities.forEach(ability => {
                p.abilities.push(ability.ability.name)
            });
            p.base_experience = pokemon.base_experience;
            p.height = pokemon.height;
            p.stats = [];
            pokemon.stats.forEach(stat => {
                p.stats.push([stat.stat.name, stat.base_stat]);
            });
            this.$data.pokemon = p;
            this.getEvolutionChain(pokemon.id);
        },

        async getEvolutionChain(id) {
            let evolutionChain = await P.getPokemonSpeciesByName(id).catch((err) => console.log(err));
            let evolutionUrl = evolutionChain.evolution_chain.url
            this.getEvolutions(evolutionUrl, id)
        },


        async getEvolutions(evolutionUrl, id) {
            let evolutions = await fetch(evolutionUrl).catch((err) => console.log(err));
            evolutions = await evolutions.json()
            this.$data.pokemon.evolution = []
            let evol = {'id': this.getId(evolutions.chain.species.url), 'name': evolutions.chain.species.name}
            evol.url = this.getUrl(evol.id)
            this.$data.pokemon.evolution.push(evol)        
            this.getNextEvolutionRecursive(evolutions.chain)
            console.log('hy')
            console.log(this.$data.pokemon.evolution)
        },

        getNextEvolutionRecursive(object) {
            if ('evolves_to' in object && object.evolves_to.length > 0) {
                for (let counter = 0; counter < object.evolves_to.length; counter++) {
                    let evol = {'id': this.getId(object.evolves_to[counter].species.url), 'name': object.evolves_to[counter].species.name}
                    evol.url = this.getUrl(evol.id);
                    console.log("evol")
                    console.log(evol)
                    this.$data.pokemon.evolution.push(evol) 
                    this.getNextEvolutionRecursive(object.evolves_to[counter])
                }
            }
        },

        getId(url) {
            console.log('y')
            console.log(url)
            let y = url
            url = url.replaceAll('/', '')
            url = url.replace('https:pokeapi.coapiv2pokemon-species', '')
            return url
        },

        getUrl(id) {
            return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + id + '.png'
        },

        //changing the variables to the good ones for the current language
        async changeLanguage() {
            //if the current language is english
            if (this.$props.language === 'en') {
                this.$data.current = this.$data.En;
                this.pokemon.species = this.pokemonInfo.species
                this.pokemon.name = this.pokemonInfo.name
            }
            //if the current language is french
            else {
                this.$data.current = this.$data.Fr;
                //only charge the abilities and types once at the start as to not charge them everytime 
                //(if the user changes often between the two languages without returning)
                if (!('frenchAbilities' in this.$data.pokemon)) {
                    this.$data.pokemon.frenchAbilities = []
                        for (let index = 0; index < this.$data.pokemon.abilities.length; index++) {
                            //getting the french names of the abilities
                            let frability = await P.getAbilityByName(this.$data.pokemon.abilities[index]).catch((err) => console.log(err));
                            this.$data.pokemon.frenchAbilities.push(frability.names[3].name);
                    }
                }
                if (!('frenchName' in this.$data.pokemon.types[0].type)) {
                    for (let index = 0; index < this.$data.pokemon.types.length; index++) {
                        //getting the french types of the abilities
                        let frtype = await P.getTypeByName(this.$data.pokemon.types[index].type.name).catch((err) => console.log(err));
                        this.$data.pokemon.types[index].type.frenchName = frtype.names[3].name;
                    }
                }
                this.pokemon.species = this.pokemonInfo.espece
                this.pokemon.name = this.pokemonInfo.frenchName
            }
        }

    },
    props: {
        language: {
            required: true
        },
        pokemonInfo: {
            required: true
        }
    },
    watch: {
        language: function() {
            this.changeLanguage()
        }
    },
    async mounted() {
        await this.getPokemon()
        this.changeLanguage()
    }
}
</script>