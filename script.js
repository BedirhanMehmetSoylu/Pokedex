function init() {
    loadData();
}

let offset = 0;
let limit = 30;
let BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

let allPokemonData = [];

async function loadData() {
    let response = await fetch(BASE_URL);
    let responseToJson = await response.json();
    let contentRef = document.getElementById('content');
    contentRef.innerHTML = "";

    for (let indexPokemon = 0; indexPokemon < responseToJson.results.length; indexPokemon++) {
        let pokemon = responseToJson.results[indexPokemon];
        let pokemonUrl = pokemon.url;
        let poke_URL = await fetch(pokemonUrl);
        let responsePokeUrlJson = await poke_URL.json();
        
        allPokemonData[responsePokeUrlJson.id] = responsePokeUrlJson;
        contentRef.innerHTML += getPokemonCard(pokemon, responsePokeUrlJson);
    }
}

async function loadMoreData(url) {
    let response = await fetch(url);
    let responseToJson = await response.json();

    let contentRef = document.getElementById('content');

    for (let indexPokemon = 0; indexPokemon < responseToJson.results.length; indexPokemon++) {
        let pokemon = responseToJson.results[indexPokemon];
        let pokemonUrl = pokemon.url;
        let poke_URL = await fetch(pokemonUrl);
        let responsePokeUrlJson = await poke_URL.json();

        allPokemonData[responsePokeUrlJson.id] = responsePokeUrlJson; // Pokémon-Daten speichern
        contentRef.innerHTML += getPokemonCard(pokemon, responsePokeUrlJson);
    }
}


function loadMorePokemon() {
    offset += limit;
    let newUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    loadMoreData(newUrl);
}

function toggledPokemonCard(pokemonId) {
    let pokemon = allPokemonData[pokemonId]; // Pokémon-Daten abrufen

    if (!pokemon) {
        console.error("Pokemon data not found for ID:", pokemonId);
        return;
    }

    document.getElementById('content').classList.add('blurred-background');

    let overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'pokemon-modal';

    overlay.innerHTML = getToggledPokemonCard(pokemon);

    document.body.appendChild(overlay);
}

function closePokemonModal() {
    let overlay = document.getElementById('pokemon-modal');
    if (overlay) {
        overlay.remove();
    }

    document.getElementById('content').classList.remove('blurred-background');
}

