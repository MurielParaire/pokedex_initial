<script>
import Pokemon from '../Pokemon.js'

const Pokedex = require("pokeapi-js-wrapper")
const P = new Pokedex.Pokedex();


let interval = {
    offset: 0,
    limit: 20,
}

function appendChildren(pokemons) {
    let poke = document.getElementById("pokemonList");
    pokemons.sort((poke,mon) => {return poke.id - mon.id});
    pokemons.forEach(p => {
        let li = document.createElement('li');
        li.innerHTML = p.showPokemon();
        poke.appendChild(li);
    });
}

P.getPokemonsList(interval)
    .then(function (response) {
        let pokemons = [];
        for (let counter = 0; counter < response.results.length; counter++) {
            fetch(response.results[counter].url)
                .then((data) => data.json())
                .then((resp) => {
                    console.log("resp")
                    console.log(resp)
                    let p = new Pokemon(resp.id, resp.name, resp.types, resp.sprites.other["official-artwork"].front_default);
                    pokemons.push(p);
                    if (counter === response.results.length - 1) {
                        appendChildren(pokemons);
                    }
                }
            )
        }
        console.log(pokemons)
        return pokemons;

    });

</script>