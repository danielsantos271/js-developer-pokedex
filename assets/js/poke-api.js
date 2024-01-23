const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon();
    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;

    pokemon.types = types;
    pokemon.type = type;

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

    return pokemon;
}

pokeApi.getPokemonDetail = async (pokemon) => {
    try {
        const response = await fetch(pokemon.url);
        const pokeDetail = await response.json();
        return convertPokeApiDetailToPokemon(pokeDetail);
    } catch (error) {
        console.error(`Error fetching details for ${pokemon.name}:`, error);
        throw error;
    }
};

pokeApi.getPokemons = async (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
            },
        });

        const jsonBody = await response.json();
        const pokemons = jsonBody.results;
        const detailRequests = pokemons.map(pokeApi.getPokemonDetail);
        const pokemonsDetails = await Promise.all(detailRequests);

        return pokemonsDetails;
    } catch (error) {
        console.error('Error fetching Pokemon list:', error);
        throw error;
    }
};

// Example of usage:
// const pokemons = await pokeApi.getPokemons();
// console.log(pokemons);
