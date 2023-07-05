const searchBtn = document.querySelector("#search-btn");
const searchInput = document.querySelector("#search-input");
const locationBtn = document.querySelector("#location-btn");
const countryFlag = document.querySelector("#country-flag");
const countryName = document.querySelector(".country-name");
const populationValue = document.querySelector("#population-value");
const languageValue = document.querySelector("#language-value");
const capitalValue = document.querySelector("#capital-value");
const currencyValue = document.querySelector("#currency-value");
const warning = document.querySelector(".warning");
const loadingIcon = document.querySelector(".loading-icon");
const resultCard = document.querySelector(".result-card");
const neighbourCard = document.querySelector(".neighbour-card");
const neighbour = document.querySelector(".neighbour");



searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let text = searchInput.value;
    loadingIcon.style.display = "inline-block";
    getCountry(text);
});

locationBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    }
    
    
});

function onError(error){
    console.log(error)
}
function onSuccess(position){
    let LAT=position.coords.latitude;
    let LNG=position.coords.longitude;
    let url=`https://api.opencagedata.com/geocode/v1/json?q=${LAT}+${LNG}&key=59cf34e50a6f43dcafbb1d5399ba4a0f`;
    fetch(url)
    .then((res)=>{
        return res.json()
    })
    .then((response)=>{
        searchInput.value=response.results[0].components.country;
        getCountry(searchInput.value)
    })
}

function getCountry(country) {
    fetch('https://restcountries.com/v3.1/name/' + country)
        .then((response) => {
            if (response.status == 404)
                throw new Error('The Country Name Is Not Valid!');
            warning.style.display = "none";
            loadingIcon.style.display = "none";
            resultCard.style.display = "block";
            neighbourCard.style.display = "block";
            return response.json()
        })
        .then((data) => {
            let resultCountry = data[0];

            countryName.querySelector("h4").textContent = resultCountry.name.common;
            countryFlag.src = `${resultCountry.flags.png}`;
            populationValue.textContent = `${(resultCountry.population / 1000000).toFixed(1)} million`;
            languageValue.textContent = Object.values(resultCountry.languages)[0];
            capitalValue.textContent = resultCountry.capital[0];
            currencyValue.textContent = `${Object.values(resultCountry.currencies)[0].name} (${Object.values(resultCountry.currencies)[0].symbol})`;

            getNeighbours(resultCountry)

        })

        .catch((err) => {
            console.log(err);
            loadingIcon.style.display = "none";
            resultCard.style.display = "none";
            neighbourCard.style.display = "none";
            warning.style.display = "block";
        })

};

function getNeighbours(country) {
    if (country.hasOwnProperty("borders")) {
        let countries = (country.borders).toString();
        console.log(countries);
        fetch(`https://restcountries.com/v3.1/alpha?codes=${countries}`)
            .then(result => {

                return result.json()
            })
            .then(res => {

                let html = "";
                for (let country of res) {
                    html += `
                 <div class="neighbour col-6 col-sm-4 col-md-3 mb-3">
                     <div class="card">
                         <img src="${country.flags.png}" class="card-img-top" alt="Neighbour Country">
                         <div class="card-footer text-center">
                             <div class="neighbour-name">${country.name.common}</div>
                         </div>
                     </div>
                 </div>
                 `;

                }
                neighbourCard.querySelector(".row").innerHTML = html;

                const neighbour = document.querySelectorAll(".neighbour");

                neighbour.forEach(element => {

                    element.addEventListener("click", (e) => {
                        searchInput.value = e.currentTarget.querySelector(".neighbour-name").textContent;

                        loadingIcon.style.display = "inline-block";
                        getCountry(searchInput.value);

                    });
                });
            });
    } else {
        console.log("Objenin 'borders' key'i bulunmuyor.");
        let empty = "";
        neighbourCard.querySelector(".row").innerHTML = empty;

    }

}
