async function searchPokemons() {
    const search = document.getElementById("searchField").value.toLowerCase();
    const content = document.getElementById("content");

    if (search.length >= 3) {
        loadMoreButton.style.display = "none";
    } else {
        loadMoreButton.style.display = "block";
    }

    if (search.length < 3) {
        resetContent();
        return;
    }

    const filteredPokemons = await getFilteredPokemons(search);
    const detailedPokemons = await getDetailedPokemons(filteredPokemons);

    content.innerHTML = detailedPokemons.map(getPokemonCard).join('');
}

async function getFilteredPokemons(search) {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
    const data = await response.json();
    return data.results.filter(pokemon => pokemon.name.includes(search)).slice(0, 10);
}

async function getDetailedPokemons(filteredPokemons) {
    return Promise.all(filteredPokemons.map(async (pokemon) => {
        if (!searchPokemonData[pokemon.name]) {
            searchPokemonData[pokemon.name] = await fetchPokemonData(pokemon.url);
        }
        return searchPokemonData[pokemon.name];
    }));
}

async function fetchPokemonData(url) {
    const response = await fetch(url);
    return await response.json();
}

function resetContent() {
    const content = document.getElementById("content");
    content.innerHTML = Object.values(allPokemonData)
        .filter(pokemon => pokemon && pokemon.loadedNormally)
        .map(getPokemonCard)
        .join('');
}

async function generatePokemonCards(filteredPokemons) {
    return Promise.all(
        filteredPokemons.map(async pokemon => {
            const pokemonData = await fetch(pokemon.url).then(res => res.json());
            return getPokemonCard(pokemonData);
        })
    );
}

async function getPokemonHTML(pokemon) {
    const pokemonData = await fetch(pokemon.url);
    const pokemonJson = await pokemonData.json();

    return getPokemonCard(pokemonJson);
}