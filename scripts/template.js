function getPokemonCard(pokemon, responsePokeUrlJson) {
    let pokename = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    return `<div onclick="toggledPokemonCard(${responsePokeUrlJson.id})" style="background-color: ${typeColors[responsePokeUrlJson.types[0].type.name]}" class="pokemon-card">
                <div class="card-header">
                    <p>#${responsePokeUrlJson.id}</p>
                    <div>${pokename}</div>
                </div>
                <img class="pokemon-image" src="${responsePokeUrlJson.sprites.other.home.front_default}">
                <div class="pokemon-type-content">
                    <img class="pokemon-type" src="${typeIcons[responsePokeUrlJson.types[0].type.name]}">
                    ${responsePokeUrlJson.types[1] ? `<img class="pokemon-type" src="${typeIcons[responsePokeUrlJson.types[1].type.name]}">`: ""}
                </div>
            </div>
            `;
}

function getToggledPokemonCard(pokemon) {
       return  `<div class="large-pokemon-card">
                    <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                    <img src="${pokemon.sprites.other.home.front_default}" alt="${pokemon.name}">
                    <p><strong>Types:</strong> ${pokemon.types.map(type => type.type.name).join(", ")}</p>
                    <p><strong>Base Experience:</strong> ${pokemon.base_experience}</p>
                    <button onclick="closePokemonModal()">Close</button>
                </div>
                `;
}

