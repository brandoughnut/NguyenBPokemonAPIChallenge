let pokemonImg = document.getElementById("pokemonImg");

const APISearch = async (pokemonName) => {
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const data = await promise.json();
    console.log(data.sprites.other["official-artwork"].front_default);
    pokemonImg.src = data.sprites.other["official-artwork"].front_default;
}
APISearch('4');