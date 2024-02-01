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
let evolutionDiv = document.getElementById("evolutionDiv");

let pokemonData = "";
let evolutionData = "";
let pokemonEvolution = [];
let pokemonEvolutionName = [];

const APISearch = async (pokemon) => {
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    const data = await promise.json();
    pokemonData = data;
    DisplayPokemonData(pokemonData);
    let capitalizeName = pokemonData.forms[0].name;
    if(getLocalStorage().includes(capitalizeName[0].toUpperCase() + capitalizeName.substring(1)+" #"+pokemonData.id)){
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

const EvolutionAPI = async (pokemon) => {
    pokemonEvolution = [];
    pokemonEvolutionName = [];
    const promise = await fetch (`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);
    const data = await promise.json();

    const promise2 = await fetch(data.evolution_chain.url);
    const data2 = await promise2.json();
    let evolutionPush = data2.chain.species.url;
    let evolutionPush2 = evolutionPush.substring(42, 50)

    pokemonEvolution.push(evolutionPush2.slice(0, -1));
    pokemonEvolutionName.push(data2.chain.species.name);
    if(data2.chain.evolves_to != null){
        data2.chain.evolves_to.map((evolution) => {
            pokemonEvolution.push(evolution.species.url.substring(42, 50).slice(0, -1));
            pokemonEvolutionName.push(evolution.species.name);
        });
        if(data2.chain.evolves_to.length != 0 && data2.chain.evolves_to.length != 0){
            data2.chain.evolves_to[0].evolves_to.map((evolution) => {
                pokemonEvolution.push(evolution.species.url.substring(42, 50).slice(0, -1));
                pokemonEvolutionName.push(evolution.species.name);
            });
        }
    }
    evolutionDiv.textContent = "";
    for(let i = 0; i<pokemonEvolution.length; i++){
        const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonEvolution[i]}`);
        const data = await promise.json();
        evolutionData = data;

        let img = document.createElement('img');

        if(evolutionData.sprites.other["official-artwork"].front_default == null){
            img.src = "/assets/pokeball.png"
        }else{
            img.src = evolutionData.sprites.other["official-artwork"].front_default;
        }
        
        img.style.height = "200px";
        img.style.width = "200px";

        img.addEventListener('click', async () => {
            APISearch(pokemonEvolution[i]);
            LocationAPISearch(pokemonEvolution[i]);
        });

        let innerDiv = document.createElement('div');

        innerDiv.appendChild(img);

        innerDiv.className = "bg-white/75 rounded-[200px] px-5 py-5";

        let brotherDiv = document.createElement('div');

        let capitalizeName = pokemonEvolutionName[i];
        brotherDiv.className = "text-center text-[30px] mt-4";
        brotherDiv.style.fontFamily = "Jura-Bold";
        brotherDiv.textContent = capitalizeName[0].toUpperCase() + capitalizeName.substring(1)+" #"+evolutionData.id;

        let outerDiv = document.createElement('div');
        outerDiv.className = "grid justify-center mb-20";
        outerDiv.appendChild(innerDiv);
        outerDiv.appendChild(brotherDiv);

        evolutionDiv.appendChild(outerDiv);
        }
        
    
    
}

// on load
APISearch('1');
LocationAPISearch('1');
EvolutionAPI('1');

const DisplayPokemonData = () => {
    // pokemon image
    if(pokemonData.sprites.other["official-artwork"].front_default == null){
        pokemonImg.src = "/assets/pokeball.png"
    }else{
        pokemonImg.src = pokemonData.sprites.other["official-artwork"].front_default;
    }
    

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
    EvolutionAPI(pokemonInput.value);
    pokemonInput.value = "";
});

pokemonRandom1.addEventListener('click', async () => {
    let random = Math.floor(Math.random() * 500) + 1;
    APISearch(random);
    LocationAPISearch(random);
    EvolutionAPI(random);
});

pokemonRandom2.addEventListener('click', async () => {
    let random = Math.floor(Math.random() * 500) + 1;
    APISearch(random);
    LocationAPISearch(random);
    EvolutionAPI(random);
});

pokemonImg.addEventListener('click', async () => {
    let isTrue = true;
    if(pokemonData.sprites.other["official-artwork"].front_default == null){
        if(isTrue){
            pokemonImg.src = "/assets/pokeballmaster.png";
        }else{
            pokemonImg.src = "/assets/pokeball.png";
        }
        
    }else{
        if(pokemonImg.src == pokemonData.sprites.other["official-artwork"].front_default){
            pokemonImg.src = pokemonData.sprites.other["official-artwork"].front_shiny;
        }else{
            pokemonImg.src = pokemonData.sprites.other["official-artwork"].front_default;
        }
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
    if(!getLocalStorage().includes(capitalizeName[0].toUpperCase() + capitalizeName.substring(1)+" #"+pokemonData.id)){
        saveToLocalStorage(`${capitalizeName[0].toUpperCase() + capitalizeName.substring(1)} #${pokemonData.id}`);
        addFavoriteBtn.src = "/assets/pokemonfavoritefill.png";
    }else{
        removeFromLocalStorage(capitalizeName[0].toUpperCase() + capitalizeName.substring(1)+" #"+pokemonData.id);
        addFavoriteBtn.src = "/assets/pokemonfavorite.png";
    }
    
    

});

getFavoritesBtn1.addEventListener('click', () => {
    let capitalizeName = pokemonData.forms[0].name;
    let favorites = getLocalStorage();

    getFavoritesDiv.textContent = "";

        favorites.map((pokemonName) => {
        
        let div = document.createElement("div");

        div.textContent = `${pokemonName}`;

        div.className = "rounded-2xl flex items-center justify-between text-[20px] mb-5";
        div.style.height = "58px";
        div.style.background = "#8E8E8E";
        div.style.paddingLeft = "10px";
        div.style.paddingRight = "10px";
        div.style.fontFamily = "Jura-Bold";
        div.style.cursor = "pointer";
        let newID = pokemonName.split(" ")[1];
        div.addEventListener('click', async () => {
            await APISearch(parseInt(newID.substring(1, 10)));
            await LocationAPISearch(parseInt(newID.substring(1, 10)));
            await EvolutionAPI(parseInt(newID.substring(1, 10)));
        });

        let removeBtn = document.createElement("img");
        removeBtn.style.cursor = "pointer";
        removeBtn.src = "/assets/pokemonremove.png";
        removeBtn.addEventListener('click', () => {
            removeFromLocalStorage(pokemonName);
            div.remove();
            if(getLocalStorage().includes(capitalizeName[0].toUpperCase() + capitalizeName.substring(1)+" #"+pokemonData.id)){
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

        div.textContent = `${pokemonName}`;

        div.className = "rounded-2xl flex items-center justify-between text-[20px] mb-5";
        div.style.height = "58px";
        div.style.background = "#8E8E8E";
        div.style.paddingLeft = "10px";
        div.style.paddingRight = "10px";
        div.style.fontFamily = "Jura-Bold";
        div.style.cursor = "pointer";
        let newID = pokemonName.split(" ")[1];
        div.addEventListener('click', async () => {
            await APISearch(parseInt(newID.substring(1, 10)));
            await LocationAPISearch(parseInt(newID.substring(1, 10)));
            await EvolutionAPI(parseInt(newID.substring(1, 10)));
        });

        let removeBtn = document.createElement("img");
        removeBtn.style.cursor = "pointer";
        removeBtn.src = "/assets/pokemonremove.png";
        removeBtn.addEventListener('click', () => {
            removeFromLocalStorage(pokemonName);
            div.remove();
            if(getLocalStorage().includes(capitalizeName[0].toUpperCase() + capitalizeName.substring(1)+" #"+pokemonData.id)){
                addFavoriteBtn.src = "/assets/pokemonfavoritefill.png";
            }else{
                addFavoriteBtn.src = "/assets/pokemonfavorite.png";
            }
        });

        div.append(removeBtn);

        getFavoritesDiv.appendChild(div);
    });

});

