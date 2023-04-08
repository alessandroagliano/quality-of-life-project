const { default: axios } = require("axios");
import {
  Search,
  nomeCittà,
  input,
  errorDiv,
  imgCity,
  description,
  totalScore,
  scoreDiv,
  cardBody,
} from "./dom-elements";

export const fetchScore = function () {
  /* prendo il valore dell'input e lo inserisco come variale nell'url del fetch */
  const cityName = nomeCittà.value;
  const slug = cityName.toLowerCase().replace(/\s+/g, "-");
  const apiUrl = `https://api.teleport.org/api/urban_areas/slug:${slug}/scores/`;

  /* chiamata fetch */
  axios
    .get(apiUrl)
    .then((response) => {
      /* Imposto le classi in caso di risposta positiva */
      cardBody.style.display = "flex";
      errorDiv.style.display = "none";
      input.classList.remove("border-danger");

      /* Div name+descrizione  */
      nameCity.innerHTML = " City: " + cityName;
      scoreDiv.innerHTML =
        ""; /* azzero il valore dei parametri nel caso di una seconda ricerca */
      description.innerHTML = "Description: " + response.data.summary;

      /* Score totale */
      totalScore.innerHTML =
        "Total score: " + response.data.teleport_city_score.toFixed(2);

      /* CREAZIONE CARD PARAMETRI */
      const categories = response.data.categories;

      categories.forEach((element) => {
        /* creo i div e inserisco le classi */
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

        progressbar.style.width = number;

        /* appendo i vari nodi */
        card.appendChild(nameCard);
        card.appendChild(score);
        progressBarDiv.appendChild(progressbar);
        card.appendChild(progressBarDiv);
        scoreDiv.appendChild(card);
      });
    })
    .catch((error) => {
      cardBody.style.display = "none";
      errorDiv.style.display = "flex";
      input.classList.add("border-danger");
      if ((error.name = "AxiosError")) {
        nomeCittà.value = "";
      }
    });
};

/* chiamata fetch per Img città */

export const fetchImg = function () {
  const cityName = nomeCittà.value;
  const slug = cityName.toLowerCase().replace(/\s+/g, "-");

  const apiUrl = `https://api.teleport.org/api/urban_areas/slug:${slug}/images/`;

  axios
    .get(apiUrl)
    .then((response) => {
      /* imposto le classi in caso di risposta negativa */
      cardBody.style.display = "flex";
      errorDiv.style.display = "none";
      input.classList.remove("border-danger");
      /* prendo l'url dell'img e lo imposto come src di imgCity */
      const response2 = response.data.photos[0].image;
      imgCity.src = response2.mobile;
    })
    .catch((error) => {});
};
