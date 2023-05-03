const { default: axios } = require("axios");
import {
  nomeCittà,
  input,
  errorDiv,
  imgCity,
  description,
  totalScore,
  scoreDiv,
  cardBody,
} from "./dom-elements";
import "lodash";

const API_URL = process.env.API_URL;
const API_SCORES = process.env.API_SCORES;
const API_IMAGES = process.env.API_IMAGES;
const API_SUMMARY = process.env.API_SUMMARY;
const API_MEDIUM_SCORE = process.env.API_MEDIUM_SCORE;
const API_NAME_ITEM = process.env.API_NAME_ITEM;
const API_SCORE_ITEM = process.env.API_SCORE_ITEM;
const API_COLOR_ITEM = process.env.API_COLOR_ITEM;

//---------------------- CHIAMATA FETCH -----------------

export const fetchCity = function () {
  if (
    nomeCittà.value === null ||
    nomeCittà.value === undefined ||
    nomeCittà.value == !String
  ) {
    return;
  } else {
    /* prendo il valore dell'input e lo inserisco come variale nell'url del fetch */
    const urlScore = apiUrlScore();

    /* chiamata fetch tramite 'axios.get()' */
    axios
      .get(urlScore)
      .then((response) => {
        // Imposto le classi in caso di risposta positiva
        setCardStyleSucces(cardBody, errorDiv, input);

        // Inserisco i punteggi
        setcardResult(nomeCittà, response);

        //Inserisco tutti i singoli parametri
        const categories = _.get(response, "data.categories");

        setSingleItem(categories);
      })
      .then(fetchImg()) // Faccio la chiamata per l'immagine
      .catch((error) => {
        setCardStyleError(cardBody, errorDiv, input); // Imposto lo stile in caso di errore
        if ((error.name = "AxiosError")) {
          nomeCittà.value = ""; // azzero il campo input
        }
      });
  }
};

// ------------------- CHIAMATA FETCH IMG --------------
/* Questa funzione verrà chiamata in FetchScore
 dopo la chiamata per lo 'score' con .then */
export const fetchImg = function () {
  const urlScore = apiUrlImage(); // dichiaro l'url per la chiamata fetch dell'immagine

  axios
    .get(urlScore)
    .then((response) => {
      showImage(response);
    })
    .catch((error) => {});
};

//-------------- ShowImage() ----------------
/* Questa funzione è usata dentro ' fetchImg()' */

const showImage = (response) => {
  /* 'response' verrà passato dalla chiamata 'axios.get() 
  ed è la risposta quando si chiamata l'immagine */

  setCardStyleSucces(cardBody, errorDiv, input); // Imposto lo stile
  const response2 = response.data.photos[0].image.mobile; // Prendo l'url dell'immagine
  imgCity.src = response2; // inserisco l'url come 'src' nell'html
};

//----------------- Correzione Valore Input Città -------------
/* Questa funzione serve per adattare il valore dell'input cercato 
in modo da aggiungerlo all'url del fetch.
la userò dentro 'apiUrlScore()' e ' apiUrlImage()' */

const correctName = function (cityName) {
  cityName = cityName.toLowerCase();
  cityName = cityName.replace(/\s+/g, "-");
  return cityName;
};

//----------------------- Url -------------------------------

/* Inizializzo la variabile che poi trasformo tramite 'correctName()'
 La funzione apiUrlScore e apiUrlImage ritorneranno i corrispettivi
 url per la propria chiamata fetch con 'slug' che rappresenta la città ricercata*/

let slug;

const apiUrlScore = function () {
  slug = correctName(nomeCittà.value);
  return API_URL + `${slug}` + API_SCORES;
};

const apiUrlImage = function () {
  slug = correctName(nomeCittà.value);
  return API_URL + `${slug}` + API_IMAGES;
};

//---------------- Stile Card Success --------------

// Lo stile della card in caso di successo nella chiamata fetch
const setCardStyleSucces = (cardBody, errorDiv, input) => {
  cardBody.style.display = "flex";
  errorDiv.style.display = "none";
  input.classList.remove("border-danger");
};

//----------------Stile Card error   ----------------
// Lo stile della card in caso di insuccesso nella chiamata fetch

const setCardStyleError = (cardBody, errorDiv, input) => {
  cardBody.style.display = "none";
  errorDiv.style.display = "flex";
  input.classList.add("border-danger");
};

//--------------Valori Principali Card -----------

/* in questa funzione inserisco i valori di
-nome città
-Il punteggio medio
-Una descrizione 
*/
const setcardResult = function (nomeCittà, response) {
  nameCity.innerHTML = " City: " + nomeCittà.value;
  scoreDiv.innerHTML = "";
  /* azzero il valore dei parametri nel caso di una seconda ricerca
   */

  const descrizione = _.get(response, API_SUMMARY);
  description.innerHTML = "Description: " + descrizione;

  /* Score totale */
  const mediumScore = _.get(response, API_MEDIUM_SCORE).toFixed(2);

  totalScore.innerHTML = "Total score: " + mediumScore;
  // Valore medio approssimato a 2 numeri decimali
};

//------------------- Risultati Singoli Parametri ----------
/* Con questa funzione creo dinamicamente i vari div dei singoli item 
'categories' è un array contente i singoli valori delle varie statistiche,
da li ci credo un 'forEach()'.
Inserisco nome, score e la progressBar con la funzione 'progressBar()'*/

const setSingleItem = function (categories) {
  categories.forEach((element) => {
    const card = document.createElement("div");
    card.classList.add("col-6", "my-1");

    /* Nome parametro */
    const nameCard = document.createElement("h5");
    const nameItem = _.get(element, API_NAME_ITEM);
    nameCard.innerHTML = nameItem;

    /* SCORE SINGOLO PARAMETRO */
    const score = document.createElement("h6");
    const scoreItem = _.get(element, API_SCORE_ITEM).toFixed(1);
    score.innerHTML = scoreItem + "/10";

    //------------- Progress Bar ---------------

    let progressBarDiv = document.createElement("div");
    let progressbar = document.createElement("div");
    progressBar(element, progressBarDiv, progressbar);

    appendElements(card, nameCard, score, progressBarDiv, progressbar);
    scoreDiv.appendChild(card); // Appendo il div dei singoli Item a ScoreDiv
  });
};

// ------------- ProgressBard singolo Parametro -----------

// Questa funzione la uso dentro la funzione 'setSingleItem

// Per prima cosa imposto lo stile

/* Prendo il punteggio complessivo e lo arrotondo a 2 punti percentuali
poi questo valore lo imposto come larghezza della 'progressbar'
per dare la forma alla barra */

const progressBar = function (element, progressBarDiv, progressbar) {
  const color = _.get(element, API_COLOR_ITEM);

  progressBarDiv.classList.add("progress");

  progressbar.classList.add("progress-bar");
  progressbar.style.backgroundColor = color;

  var number = _.get(element, API_SCORE_ITEM);
  var percentage = Math.round(number * 10);
  number = percentage + "%";

  progressbar.style.width = number;
};

//-------------- Funzione per appendere i vari nodi ------------
/* Questa funzione sarà usata dentro 'setSingleItem 
Serva ad apprendere tutti i vari nodi creati per le singole statistiche
 */

const appendElements = function (
  card,
  nameCard,
  score,
  progressBarDiv,
  progressbar
) {
  card.appendChild(nameCard);
  card.appendChild(score);
  progressBarDiv.appendChild(progressbar);
  card.appendChild(progressBarDiv);
};
