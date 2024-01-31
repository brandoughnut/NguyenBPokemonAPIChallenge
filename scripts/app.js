let pokemonImg = document.getElementById("pokemonImg");
let pokemonName = document.getElementById("pokemonName");
let pokemonType = document.getElementById("pokemonType");
let pokemonLocation = document.getElementById("pokemonLocation");
let pokemonAbilities = document.getElementById("pokemonAbilities");
let pokemonMoves = document.getElementById("pokemonMoves");
let pokemonInput = document.getElementById("pokemonInput");
let pokemonSearchBtn = document.getElementById("pokemonSearchBtn");
let pokemonBG = document.getElementById("pokemonBG");
let pokemonRandom1 = document.getElementById("pokemonRandom1");
let pokemonRandom2 = document.getElementById("pokemonRandom2");
let addFavoriteBtn = document.getElementById("addFavoriteBtn");
let getFavoritesBtn1 = document.getElementById("getFavoritesBtn1");
let getFavoritesDiv = document.getElementById("getFavoritesDiv");
let getFavoritesBtn2 = document.getElementById("getFavoritesBtn2");

let pokemonData = "";

const APISearch = async (pokemon) => {
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    const data = await promise.json();
    pokemonData = data;
    DisplayPokemonData(pokemonData);
    let capitalizeName = pokemonData.forms[0].name;
    if(getLocalStorage().includes(capitalizeName[0].toUpperCase() + capitalizeName.substring(1))){
        addFavoriteBtn.src = "/assets/pokemonfavoritefill.png";
    }else{
        addFavoriteBtn.src = "/assets/pokemonfavorite.png";
    }
}

const LocationAPISearch = async (pokemon) => {
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/encounters`);
    const data = await promise.json();
    if(data.length == 0){
        pokemonLocation.textContent = 'Location Found: N/A'
    }else{
       pokemonLocation.textContent = `Location Found: ${data[0].location_area.name}`; 
    }
    
}

// on load
APISearch('1');
LocationAPISearch('1');

const DisplayPokemonData = () => {
    // pokemon image
    pokemonImg.src = pokemonData.sprites.other["official-artwork"].front_default;

    // pokemon name
    let capitalizeName = pokemonData.forms[0].name;
    pokemonName.textContent = `Name: ${capitalizeName[0].toUpperCase() + capitalizeName.substring(1)} #${pokemonData.id}`;

    // pokemon types
    let pokemonTypeArray = [];
    for(let i = 0; i<pokemonData.types.length; i++){
        let capitalizeName = pokemonData.types[i].type.name;
        pokemonTypeArray.push(capitalizeName[0].toUpperCase() + capitalizeName.substring(1));
    }
    pokemonType.textContent = `Type: ${pokemonTypeArray.join(", ")}`;
    
    // background based on pokemon's first type
    TypeBG(pokemonTypeArray[0]);

    // pokemon abilities
    let pokemonAbilitiesArray = [];
    for(let i = 0; i<pokemonData.abilities.length; i++){
        pokemonAbilitiesArray.push(pokemonData.abilities[i].ability.name);
    }
    pokemonAbilities.textContent = pokemonAbilitiesArray.join(", ");

    // pokemon moves
    let pokemonMovesArray = [];
    for(let i = 0; i<pokemonData.moves.length; i++){
        pokemonMovesArray.push(pokemonData.moves[i].move.name);
    }
    pokemonMoves.textContent = pokemonMovesArray.join(", ");
}

pokemonSearchBtn.addEventListener('click', async () => {
    APISearch(pokemonInput.value);
    LocationAPISearch(pokemonInput.value);
    pokemonInput.value = "";
});

pokemonRandom1.addEventListener('click', async () => {
    let random = Math.floor(Math.random() * 1025) + 1;
    APISearch(random);
    LocationAPISearch(random);
});

pokemonRandom2.addEventListener('click', async () => {
    let random = Math.floor(Math.random() * 1025) + 1;
    APISearch(random);
    LocationAPISearch(random);
});

pokemonImg.addEventListener('click', async () => {
    if(pokemonImg.src == pokemonData.sprites.other["official-artwork"].front_default){
        pokemonImg.src = pokemonData.sprites.other["official-artwork"].front_shiny;
    }else{
        pokemonImg.src = pokemonData.sprites.other["official-artwork"].front_default;
    }
});



const TypeBG = (pokemonType) => {
    switch(pokemonType){
        case "Bug":
            pokemonBG.className = "bug min-h-screen bg-cover pt-[73px]";
            break;
        case "Dark":
            pokemonBG.className = "dark min-h-screen bg-cover pt-[73px]";
            break;
        case "Dragon":
            pokemonBG.className = "dragon min-h-screen bg-cover pt-[73px]";
            break;
        case "Electric":
            pokemonBG.className = "electric min-h-screen bg-cover pt-[73px]";
            break;
        case "Fighting":
            pokemonBG.className = "fighting min-h-screen bg-cover pt-[73px]";
            break;
        case "Fire":
            pokemonBG.className = "fire min-h-screen bg-cover pt-[73px]";
            break;
        case "Flying":
            pokemonBG.className = "flying min-h-screen bg-cover pt-[73px]";
            break;
        case "Ghost":
            pokemonBG.className = "ghost min-h-screen bg-cover pt-[73px]";
            break;
        case "Grass":
            pokemonBG.className = "grass min-h-screen bg-cover pt-[73px]";
            break;
        case "Ground":
            pokemonBG.className = "ground min-h-screen bg-cover pt-[73px]";
            break;
        case "Ice":
            pokemonBG.className = "ice min-h-screen bg-cover pt-[73px]";
            break;
        case "Normal":
            pokemonBG.className = "normal min-h-screen bg-cover pt-[73px]";
            break;
        case "Poison":
            pokemonBG.className = "poison min-h-screen bg-cover pt-[73px]";
            break;
        case "Psychic":
            pokemonBG.className = "psychic min-h-screen bg-cover pt-[73px]";
            break;
        case "Rock":
            pokemonBG.className = "rock min-h-screen bg-cover pt-[73px]";
            break;
        case "Steel":
            pokemonBG.className = "steel min-h-screen bg-cover pt-[73px]";
            break;
        case "Water":
            pokemonBG.className = "water min-h-screen bg-cover pt-[73px]";
            break;
        default:
            pokemonBG.className = "flying min-h-screen bg-cover pt-[73px]";
    }
}

const saveToLocalStorage = (pokemon) => {
    let favorites = getLocalStorage();

    if(!favorites.includes(pokemon)){
        favorites.push(pokemon);
    }

    localStorage.setItem("Favorite Pokemon", JSON.stringify(favorites));
}

const getLocalStorage = () => {
    let localStorageData = localStorage.getItem("Favorite Pokemon");

    if(localStorageData == null){
        return [];
    }

    return JSON.parse(localStorageData);

}

const removeFromLocalStorage = (pokemon) => {
    let favorites = getLocalStorage();

    let namedIndex = favorites.indexOf(pokemon);

    favorites.splice(namedIndex, 1);

    localStorage.setItem("Favorite Pokemon", JSON.stringify(favorites));

}

addFavoriteBtn.addEventListener('click', () => {
    let capitalizeName = pokemonData.forms[0].name;
    if(!getLocalStorage().includes(capitalizeName[0].toUpperCase() + capitalizeName.substring(1))){
        saveToLocalStorage(capitalizeName[0].toUpperCase() + capitalizeName.substring(1));
        addFavoriteBtn.src = "/assets/pokemonfavoritefill.png";
    }else{
        removeFromLocalStorage(capitalizeName[0].toUpperCase() + capitalizeName.substring(1));
        addFavoriteBtn.src = "/assets/pokemonfavorite.png";
    }
    
    

});

getFavoritesBtn1.addEventListener('click', () => {
    let capitalizeName = pokemonData.forms[0].name;
    let favorites = getLocalStorage();

    getFavoritesDiv.textContent = "";

    favorites.map((pokemonName) => {
        let div = document.createElement("div");

        div.textContent = pokemonName;

        div.className = "bg-[#F08030] h-[58px] rounded-2xl flex items-center justify-between px-3 text-[20px] mb-5";
        div.style.fontFamily = "Jura-Bold";

        let removeBtn = document.createElement("img");
        removeBtn.src = "/assets/pokemonremove.png";

        removeBtn.addEventListener('click', () => {
            removeFromLocalStorage(pokemonName);
            div.remove();
            if(getLocalStorage().includes(capitalizeName[0].toUpperCase() + capitalizeName.substring(1))){
                addFavoriteBtn.src = "/assets/pokemonfavoritefill.png";
            }else{
                addFavoriteBtn.src = "/assets/pokemonfavorite.png";
            }
        });

        div.append(removeBtn);

        getFavoritesDiv.appendChild(div);
    });

});

getFavoritesBtn2.addEventListener('click', () => {
    let capitalizeName = pokemonData.forms[0].name;
    let favorites = getLocalStorage();

    getFavoritesDiv.textContent = "";

    favorites.map((pokemonName) => {
        let div = document.createElement("div");

        div.textContent = pokemonName;

        div.className = "bg-[#F08030] h-[58px] rounded-2xl flex items-center justify-between px-3 text-[20px] mb-5";
        div.style.fontFamily = "Jura-Bold";

        let removeBtn = document.createElement("img");
        removeBtn.src = "/assets/pokemonremove.png";

        removeBtn.addEventListener('click', () => {
            removeFromLocalStorage(pokemonName);
            div.remove();
            if(getLocalStorage().includes(capitalizeName[0].toUpperCase() + capitalizeName.substring(1))){
                addFavoriteBtn.src = "/assets/pokemonfavoritefill.png";
            }else{
                addFavoriteBtn.src = "/assets/pokemonfavorite.png";
            }
        });

        div.append(removeBtn);

        getFavoritesDiv.appendChild(div);
    });
});

