const { default: axios } = require("axios");

console.log(window.innerWidth);

const Search = document.getElementById("search");
const nomeCittà = document.getElementById("città");
const input = document.querySelector(".form-control");
const errorDiv = document.querySelector("#errorDiv");
const imgCity = document.querySelector("#imgCity");
const description = document.querySelector("#description");
const totalScore = document.querySelector("#totalScore");
const scoreDiv = document.querySelector("#scoreDiv");

const cardBody = document.querySelector("#card-body");

const ricerca2 = function () {
  const cityName = nomeCittà.value;
  const slug = cityName.toLowerCase().replace(/\s+/g, "-");
  const apiUrl = `https://api.teleport.org/api/urban_areas/slug:${slug}/scores/`;

  axios
    .get(apiUrl)
    .then((response) => {
      console.log(response);
      cardBody.style.display = "flex";
      errorDiv.style.display = "none";
      input.classList.remove("border-danger");
      nameCity.innerHTML = " City: " + cityName;
      scoreDiv.innerHTML =
        ""; /* azzero il valore dei parametri nel caso di una seconda ricerca */
      const categories = response.data.categories;

      /* CREAZIONE CARD PARAMETRI */
      categories.forEach((element) => {
        const card = document.createElement("div");
        card.classList.add("col-6", "col-lg-2", "my-1");

        /* Nome parametro */
        const nameCard = document.createElement("h5");

        nameCard.innerHTML = element.name;

        /* PUNTEGGIO COMPLESSIVO */
        const score = document.createElement("h6");
        score.innerHTML = element.score_out_of_10.toFixed(1) + "/10";

        /* SCORE SINGOLO PARAMETRO */
        const color = element.color;
        const progressBarDiv = document.createElement("div");
        progressBarDiv.classList.add("progress");
        const progressbar = document.createElement("div");
        progressbar.classList.add("progress-bar");
        progressbar.style.backgroundColor = color;

        /* Prendo il punteggio complessivo e lo arrotondo a 2 punti percentuali
        poi questo valore lo imposto come larghezza della 'progressbar' per dare la forma alla barra */
        var number = element.score_out_of_10;
        var percentage = Math.round(number * 10);
        number = percentage + "%";
        console.log(number);

        progressbar.style.width = number;

        card.appendChild(nameCard);
        card.appendChild(score);
        progressBarDiv.appendChild(progressbar);
        card.appendChild(progressBarDiv);
        scoreDiv.appendChild(card);
      });

      description.innerHTML = "Description: " + response.data.summary;

      totalScore.innerHTML =
        "Total score: " + response.data.teleport_city_score.toFixed(2);
    })
    .catch((error) => {
      cardBody.style.display = "none";
      errorDiv.style.display = "flex";
      input.classList.add("border-danger");
      if ((error.name = "AxiosError")) {
        /*   errorDiv.textContent = " scrivi un'altra città"; */

        nomeCittà.value = "";
      }
    });
};

Search.addEventListener("click", ricerca2);
input.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    ricerca2();
  }
});

const ricerca3 = function () {
  const cityName = nomeCittà.value;
  const slug = cityName.toLowerCase().replace(/\s+/g, "-");

  const apiUrl = `https://api.teleport.org/api/urban_areas/slug:${slug}/images/`;

  const windowWidth = window.innerWidth;
  axios
    .get(apiUrl)
    .then((response) => {
      cardBody.style.display = "flex";
      errorDiv.style.display = "none";
      input.classList.remove("border-danger");
      const response2 = response.data.photos[0].image;
      /*     if (windowWidth >= 768) {
        imgCity.src = response2.web;
      } else { */
      imgCity.src = response2.mobile;

      console.log(response2.mobile);
      console.log(response2.web);
    })
    .catch((error) => {});
};

Search.addEventListener("click", ricerca3);
input.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    ricerca3();
  }
});

const mqLarge = window.matchMedia("(min-width: 800px)");
setInterval(console.log(mqLarge.matches), 1000);
