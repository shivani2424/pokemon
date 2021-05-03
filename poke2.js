

const pokedex = document.getElementById('pokedex');
const searchBar = document.getElementById('searchBar');
const searchedData = document.getElementById('searchedData');

// Height Weight based
const filterHeightStart = document.getElementById('startHeight');
const filterHeightEnd = document.getElementById('endHeight');
const filterWeightStart = document.getElementById('startWeight');
const filterWeightEnd = document.getElementById('endWeight');

//Adding Event Listeners
searchBar.addEventListener('input',()=>search(searchBar.value));

filterHeightStart.addEventListener('input',()=>search(searchBar.value));
filterWeightStart.addEventListener('input',()=>search(searchBar.value));
filterHeightEnd.addEventListener('input',()=>search(searchBar.value));
filterWeightEnd.addEventListener('input',()=>search(searchBar.value));



var allPokemonObjects = [];
var allPokemonList = null;
var allPokemonPrePromiseObjects = null;

// Initial fetch function which loads all the data of pokemons from pokeapi
const fetchPokemon = () => {
    const promises = [];
    for (let i = 1; i <= 30; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then((res) => res.json()));
    }
    allPokemonPrePromiseObjects = promises;
    Promise.all(promises).then((results) => {
        const pokemon = results.map((result) => ({
            // Storing required data in json objects from obtained objects from fetch()
            name: result.name,
            image: result.sprites['front_default'],
            type: result.types.map((type) => type.type.name).join(', '),
            id: result.id,
            abilities: result.abilities.map((ability) => ability.ability.name).join(', '),
            base_experience: result.base_experience,
            forms: result.forms.map((form)=> form.name ).join(", "),
            height: result.height,
            weight: result.weight,
            items: result.held_items.map((xitem)=> xitem.item.name).join(", "),
            moves: result.moves.map((xmove)=> xmove.move.name).join(", "),
            order: result.order,
            species: result.species.name,
            images: [result.sprites['front_default'],result.sprites['back_default'],result.sprites['front_shiny']],
            
            
            //All other things needed to the JSON object for next improvement step

        }));
        displayPokemon(pokemon);
        
    });
};

// display all the Pokemon objects on home page initially
const displayPokemon = (pokemon) => {
    allPokemonObjects = pokemon;
    const pokemonHTMLString = pokemon
        .map(
            (pokeman) => `
        <li class="card" onClick="displayPokemonOnPage(${pokeman.id})">
            <img class="card-image" src="${pokeman.image}"/>
            <h2 class="card-title">${pokeman.id}. ${pokeman.name}</h2>
            <p class="card-subtitle">Type: ${pokeman.type}</p>
        </li>
    `).join('');
    pokedex.innerHTML = pokemonHTMLString;
    // The pokemonHtmlString is stored for further traceback uses
    allPokemonList = pokemonHTMLString;
};

// Displaying all data back on to the Home Page -> To set back to initial stage
const displayAllOnPage = () => {
    pokedex.innerHTML = allPokemonList;
    searchedData.innerHTML = ``;
    searchBar.value="";
}


const generateHtmlList = (st) => {
    const HtmlList= st.split(",").map((val) => `<li>${val}</li>`).join('');
    return HtmlList;
}

//display pokemon object selected. 

const displayPokemonOnPage=(id) => {
    pokeman = allPokemonObjects[id-1];
    onPage(pokeman);
}

//Displaying one Pokemon Data on Main Page
const onPage = (pk)=>{
    st = `
    <div class="card" >
        <img class="card-image" src="${pk.image}"/>
        <h1 class="card-title"> ${pk.name}</h1>
        <h2>Type</h2>
        <p > ${generateHtmlList(pk.type)}</p>
        <br>
        <p >Species: ${pk.species}</p>
        <p >Base Experience: ${pk.base_experience}</p>
        <h3>Images</h3>
        <div class="container"> 
        <img class="card-image" src="${pk.images[0]}"/>
        <img class="card-image" src="${pk.images[1]}"/>
        <img class="card-image" src="${pk.images[2]}"/>
        </div>
        <h2>Moves </h2>
        <p> ${generateHtmlList(pk.moves)}</p>
        <h2>Abilities</h2>
        <p> ${ generateHtmlList(pk.abilities) }</p>
        <h2>Forms</h2>
        <p>${pk.forms}</p>
        <p><h2>Height  </h2>${pk.height}</p>
        <p><h2>Weight </h2> ${pk.weight}</p>
        <p><h2>Order  </h2>${pk.order}</p>
    </div>`;
    pokedex.innerHTML = st;
    searchedData.innerHTML=``;
}

// called from eventListener in searchBar
const  search = (text)=>{
    if( text.replaceAll(' ','').length ==0  &&
        filterHeightEnd.value.replaceAll(' ','').length ==0 &&
        filterHeightStart.value.replaceAll(' ','').length ==0 &&
        filterWeightEnd.value.replaceAll(' ','').length ==0 &&
        filterWeightStart.value.replaceAll(' ','').length ==0 ){
            generateSearches([]);
            return;
    }
    //height and weight bounds
    var heightSt = 0;
    var heightEn = Number.MAX_VALUE;
    var weightSt = 0;
    var weightEn = Number.MAX_VALUE;
    
    if(filterHeightEnd.value !='')
        heightEn = parseInt(filterHeightEnd.value);
    if(filterWeightEnd.value !='')
        weightEn = parseInt(filterWeightEnd.value);
    if(filterHeightStart.value !='')
        heightSt = parseInt(filterHeightStart.value);
    if(filterWeightStart.value !='')
        weightSt = parseInt(filterWeightStart.value);    
    
    
    let matchedWords = allPokemonObjects.filter(
        obj => {
            const regex = new RegExp(`^${text}`,'gi'); // regex for matching input data
            return obj.name.match(regex) && 
                (obj.height >= heightSt) && 
                (obj.weight >= weightSt) && 
                (obj.height <= heightEn) && 
                (obj.weight<=weightEn);
        });
    

   
    generateSearches(matchedWords);
};

//To add the search retrieved objects on to html page at searchedData
function generateSearches(objs){
    if(objs.length > 0){
        const htmlString = objs.map(obj=>`
            <div class = "card" onClick="displayPokemonOnPage(${obj.id})">
                <img class="card-image" src="${obj.image}"/>
                <div >
                <h3>${obj.name}</h3>
                <h4>Height : ${obj.height}</h4>
                <h4>Weight : ${obj.weight} </h4>
                </div>
            </div>`).join('');
        searchedData.innerHTML=htmlString;
    }
    else{
        searchedData.innerHTML=`<h1 style="text-align:center;color:black;font-size: 20px;border: black; padding: 2px;border-style: solid;">No Results</h1>`;
    }
}

//Sort Data function to sort according to sorting type needed by the user.
function sortData(searches){
    var sorters = document.getElementsByName("sorter");
    var sorted = 0;
    for(var x=0; x<4;x++){
        if(sorters[x].checked){
            sorted=x; break;
        }
    }
    /*
    sorted : 
    0 -> id
    1 -> Name
    2 -> Height
    3 -> Weight
    */
    searches.sort(function (a,b){
        switch(sorted){
            case 0:
            return a.id - b.id;

            case 1:
            return a.name.localeCompare(b.name);
            
            case 2:
            return a.height-b.height;

            case 3:
            return a.weight - b.weight;
        }
    });
    return searches;
}

// Calling the fetchPokemon function to initiate the page.
fetchPokemon();