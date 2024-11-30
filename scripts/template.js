function getPokemonCard(pokemon) {
    let pokename = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    
    return `<div onclick="toggledPokemonCard(${pokemon.id})" style="background-color: ${typeColors[pokemon.types[0].type.name]}" class="pokemon-card">
                <div class="card-header">
                    <p>#${pokemon.id}</p>
                    <div>${pokename}</div>
                </div>
                <img class="pokemon-image" src="${pokemon.sprites.other.home.front_default}">
                <div class="pokemon-type-content">
                    <img class="pokemon-type" src="${typeIcons[pokemon.types[0].type.name]}">
                    ${pokemon.types[1] ? `<img class="pokemon-type" src="${typeIcons[pokemon.types[1].type.name]}">` : ""}
                </div>
            </div>`;
}

function getToggledPokemonCard(pokemon) {
       let pokename = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
       return  `<div style="background-color: ${typeColors[pokemon.types[0].type.name]}" class="large-pokemon-card">
                    <div class="card-header-toggled">
                        <div class="pokemon-title">
                            <p class="toggled-id">#${pokemon.id}</p>
                            <h3>${pokename}</h2>
                        </div>
                        <img src="./img/closecircle.png" class="close-button" onclick="closePokemonModal()">
                    </div>
                    <div class="pokemon-face-content">
                        <img onclick="previousPokemon(${pokemon.id})" class="prev-next-button" src="./img/previous.png">
                        <img class="pokemon-toggled-image" src="${pokemon.sprites.other.home.front_default}" alt="${pokemon.name}">
                        <img onclick="nextPokemon(${pokemon.id})" class="prev-next-button" src="./img/next.png">
                    </div>
                    <div class="pokemon-type-content">
                        <img class="pokemon-type" src="${typeIcons[pokemon.types[0].type.name]}">
                        ${pokemon.types[1] ? `<img class="pokemon-type" src="${typeIcons[pokemon.types[1].type.name]}">`: ""}
                    </div>
                    <div class="navbar-info">
                        <div class="info-header" onclick="renderMainInfo(${pokemon.id})">main</div>
                        <div class="info-header" onclick="renderStats(${pokemon.id})">stats</div>
                        <div class="info-header" onclick="renderEvoChain(${pokemon.id})">evo chain</div>
                    </div>
                    <div class="evo-chain" id="stats"></div>
                </div>
                `;
}

async function updateToggledPokemonCard(pokemon, containerId = 'pokemon-modal') {
    let pokename = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const cardContent = `
        <div style="background-color: ${typeColors[pokemon.types[0].type.name]}" class="large-pokemon-card">
            <div class="card-header-toggled">
                <div class="pokemon-title">
                    <p class="toggled-id">#${pokemon.id}</p>
                    <h3>${pokename}</h3>
                </div>
                <img src="./img/closecircle.png" class="close-button" onclick="closePokemonModal()">
            </div>
            <div class="pokemon-face-content">
                <img onclick="previousPokemon(${pokemon.id})" class="prev-next-button" src="./img/previous.png">
                <img class="pokemon-toggled-image" src="${pokemon.sprites.other.home.front_default}" alt="${pokemon.name}">
                <img onclick="nextPokemon(${pokemon.id})" class="prev-next-button" src="./img/next.png">
            </div>
            <div class="pokemon-type-content">
                <img class="pokemon-type" src="${typeIcons[pokemon.types[0].type.name]}">
                ${pokemon.types[1] ? `<img class="pokemon-type" src="${typeIcons[pokemon.types[1].type.name]}">`: ""}
            </div>
            <div class="navbar-info">
                <div class="info-header" onclick="renderMainInfo(${pokemon.id})">main</div>
                <div class="info-header" onclick="renderStats(${pokemon.id})">stats</div>
                <div class="info-header" onclick="renderEvoChain(${pokemon.id})">evo chain</div>
            </div>
            <div class="evo-chain" id="stats"></div>
        </div>
    `;
    
    const container = document.getElementById(containerId);
    container.innerHTML = cardContent;
    renderMainInfo(pokemon.id);
}

function getMainStatsTemplate(pokemon) {
    let meter = pokemon.height * 0.3;
    let kilo = pokemon.weight * 0.45;

    let abilities = pokemon.abilities
    ? `<p>${pokemon.abilities.map(a => a.ability.name).join(', ')}</p>`
    : '<p>No abilities available</p>';


    return `<div class="main-stats-content">
                <div class="main-content-border">
                    <div class="main-stats">
                        <p>Height:</p>
                        <p>${meter.toFixed(2)} m</p>
                    </div>
                    <div class="main-stats">
                        <p>Weight:</p>
                        <p>${kilo.toFixed(1)} kg</p>
                    </div>
                    <div class="main-stats">
                        <p>Base Experience:</p>
                        <p>${pokemon.base_experience}</p>
                    </div>
                    <div class="main-stats">
                        <p>Abilities:</p>
                        <div class="abilities">
                            ${abilities}
                        </div>
                    </div>
                </div>
            </div>`;
}

function getEvoChainTemplate(pokemonName, spriteUrl) {
    return `<div class="evo-chain-item">
                <img src="${spriteUrl}" alt="${pokemonName}">
                <p>${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</p>
            </div>`;
}

function getArrowTemplate() {
    return `<div class="evo-arrow">
                <span>→</span>
            </div>`;
}

function getStatsTemplate(pokemon) {
    let stats = pokemon.stats;
    return `<div class="stats-content">
                <div class="stats-content-border">
                    <div class="stats-position">
                        <div>hp</div>
                        <div class="stats-beam">
                            <div style="width: ${stats[0].base_stat}%; background-color: ${typeColors[pokemon.types[0].type.name]}" class="stat">${stats[0].base_stat}</div>
                        </div>
                    </div>
                    <div class="stats-position">
                        <div>attack</div>
                        <div class="stats-beam">
                            <div style="width: ${stats[1].base_stat}%; background-color: ${typeColors[pokemon.types[0].type.name]}" class="stat">${stats[1].base_stat}</div>
                        </div>
                    </div>
                    <div class="stats-position">
                        <div>defense</div>
                        <div class="stats-beam">
                            <div style="width: ${stats[2].base_stat}%; background-color: ${typeColors[pokemon.types[0].type.name]}" class="stat">${stats[2].base_stat}</div>
                        </div>
                    </div>
                    <div class="stats-position">
                        <div>special attack</div>
                        <div class="stats-beam">
                            <div style="width: ${stats[3].base_stat}%; background-color: ${typeColors[pokemon.types[0].type.name]}" class="stat">${stats[3].base_stat}</div>
                        </div>
                    </div>
                    <div class="stats-position">
                        <div>special defense</div>
                        <div class="stats-beam">
                            <div style="width: ${stats[4].base_stat}%; background-color: ${typeColors[pokemon.types[0].type.name]}" class="stat">${stats[4].base_stat}</div>
                        </div>
                    </div>
                    <div class="stats-position">
                        <div>speed</div>
                        <div class="stats-beam">
                            <div style="width: ${stats[5].base_stat}%; background-color: ${typeColors[pokemon.types[0].type.name]}" class="stat">${stats[5].base_stat}</div>
                        </div>
                    </div>
                </div>
            </div>`;
}
