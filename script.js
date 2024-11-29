function init() {
    loadData();
}

let offset = 0;
let limit = 30;
let BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
let searchPokemonData = {};
let allPokemonData = [];
let currentPokemon = 0;

async function loadData() {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    const content = document.getElementById("content");
    content.innerHTML = "";

    for (const pokemon of data.results) {
        const pokemonData = await fetch(pokemon.url).then(res => res.json());
        allPokemonData[pokemonData.id] = { ...pokemonData, loadedNormally: true };
        content.innerHTML += getPokemonCard(pokemonData);
    }
}

async function loadMoreData(url) {
    showLoadingScreen();
    try {
        const data = await (await fetch(url)).json();
        for (const pokemon of data.results) {
            const pokemonData = await (await fetch(pokemon.url)).json();
            allPokemonData[pokemonData.id] = { ...pokemonData, loadedNormally: true };
            document.getElementById("content").innerHTML += getPokemonCard(pokemonData);
        }
    } catch (err) {
        console.error(err);
    } finally {
        hideLoadingScreen();
    }
}

function showLoadingScreen() {
    const loadingScreen = document.createElement("div");
    loadingScreen.id = "loading-screen";
    loadingScreen.innerHTML = `
        <div><img class="spinner" src="./img/pokeball.png"></div>
        <p>Loading...</p>
    `;
    document.body.appendChild(loadingScreen);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) loadingScreen.remove();
}

function loadMorePokemon() {
    offset += limit;
    let newUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    loadMoreData(newUrl);
}

async function toggledPokemonCard(pokemonId) {
    const pokemon = await fetchDataPokemon(pokemonId);
    if (!pokemon) return console.error("Pokemon data not found for ID:", pokemonId);

    const overlay = createOverlay(pokemon);
    document.body.appendChild(overlay);
    setupModalClose(overlay);
    currentPokemon = pokemon.id;
    renderMainInfo(pokemonId);
}

async function fetchDataPokemon(pokemonId) {
    if (!allPokemonData[pokemonId]) {
        allPokemonData[pokemonId] = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`).then(res => res.json());
    }
    return allPokemonData[pokemonId];
}

function createOverlay(pokemon) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'pokemon-modal';
    overlay.innerHTML = getToggledPokemonCard(pokemon);
    return overlay;
}

function setupModalClose(overlay) {
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) closePokemonModal();
    });
    document.getElementById('content').classList.add('blurred-background');
    document.getElementById('body').classList.add('no-scroll');
}

function closePokemonModal() {
    let overlay = document.getElementById('pokemon-modal');
    if (overlay) {
        overlay.remove();
    }

    document.getElementById('content').classList.remove('blurred-background');
    document.getElementById('body').classList.remove('no-scroll');
}

async function previousPokemon(currentId) {
    const previousId = currentId - 1;
    if (previousId > 0) {
        const pokemon = await fetchDataPokemon(previousId);
        if (pokemon) {
            updateToggledPokemonCard(pokemon, 'pokemon-modal');
        }
    }
}

async function nextPokemon(currentId) {
    const nextId = currentId + 1;
    const pokemon = await fetchDataPokemon(nextId);
    if (pokemon) {
        updateToggledPokemonCard(pokemon, 'pokemon-modal');
    }
}

function renderMainInfo(pokemonId) {
    let pokemon = allPokemonData[pokemonId];
    let main = document.getElementById('stats');

    main.innerHTML = getMainStatsTemplate(pokemon);
}

function renderStats(pokemonId) {
    let pokemon = allPokemonData[pokemonId];
    let stats = document.getElementById('stats');

    stats.innerHTML = getStatsTemplate(pokemon);
}

async function renderEvoChain(pokemonId) {
    let pokemon = allPokemonData[pokemonId];
    let evoChain = document.getElementById('stats');
    
    evoChain.innerHTML = `<p>Loading Evolution Chain...</p>`;
    const evoChainHTML = await getEvoChain(pokemon);
    evoChain.innerHTML = evoChainHTML;
}

async function getEvoChain(pokemon) {
    const speciesResponse = await fetch(pokemon.species.url);
    const speciesData = await speciesResponse.json();
    const evoChainResponse = await fetch(speciesData.evolution_chain.url);
    const evoChainData = await evoChainResponse.json();
    const chain = evoChainData.chain;

    evoChainHTML = await processChain(chain);

    return evoChainHTML;
}

async function processChain(chainLink, evoChainHTML = "") {
    const pokeName = chainLink.species.name;
    const pokeResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`);
    const pokeData = await pokeResponse.json();

    evoChainHTML += getEvoChainTemplate(pokeName, pokeData.sprites.other.home.front_default);

    if (chainLink.evolves_to.length > 0) {
        evoChainHTML += getArrowTemplate();

        for (const nextChain of chainLink.evolves_to) {
            evoChainHTML = await processChain(nextChain, evoChainHTML);
        }
    }

    return evoChainHTML;
}