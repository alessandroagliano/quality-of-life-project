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

// ENV
const API_URL = process.env.API_URL;
const API_SCORES = process.env.API_SCORES;
const API_IMAGES = process.env.API_IMAGES;
const API_SUMMARY = process.env.API_SUMMARY;
const API_MEDIUM_SCORE = process.env.API_MEDIUM_SCORE;
const API_CATEGORIES = process.env.API_CATEGORIES;
const API_PHOTO = process.env.API_PHOTO;
const API_NAME_ITEM = process.env.API_NAME_ITEM;
const API_SCORE_ITEM = process.env.API_SCORE_ITEM;
const API_COLOR_ITEM = process.env.API_COLOR_ITEM;

//---------------------- CHIAMATA GETURBANSAREAS -----------------

/* Dichiaro un array vuoto dove inserirò tutte le città
ricavate tramite la chiamata axios a Teleport 
tramite la funzione getUrbanAreas */

let arrayCity = [];

/* Questa funzione mi restituisce un oggetto dove vado ad estrapolare
un array di oggetti()
Da questo array applico un map() e ricavo la proprietà 'name'
In questo modo trasformo  'arrayCity' in un array contente
la lista completa delle città in Teleport
arrayCity mi servirà in 'checkCity()' */

const getUrbanAreas = async function () {
  try {
    const response = await axios.get(
      "https://api.teleport.org/api/urban_areas/"
    );
    arrayCity = response.data["_links"]["ua:item"]; //Array di oggetti
    arrayCity = arrayCity.map((city) => city.name); // lista di tutte le città in un array
  } catch (error) {
    console.log(error);
  }
};

// Eseguo la funzione
getUrbanAreas();

// --------------------- CHIAMATA FETCHCITYCALL -------------
// Questa è la funzione principale quando si cercherà una città

export const fetchCityCall = async function () {
  /* Faccio vari controlli al valore dell'input e poi
  chiamo la funzione 'checkCity' */
  if (
    nomeCittà.value === null ||
    nomeCittà.value === undefined ||
    nomeCittà.value == !String
  ) {
    return;
  } else {
    checkCity();
  }
};

// -------------------- CHIAMATA CHECKCITY --------------

/* Con questa funzione controllo che la città cercata 
    sia presente nel database Teleport.

    Per confrontarlo trasformo tutto con toLowerCase()

     Se la città trovata è presente restituisce 1 e lancio 'fetchCity'
     se non è presente gestisco l'errore.

     In questa maniera si evita l'errore in console
     nel caso la città cercata non sia presente nel database di Teleport

      */

const checkCity = async function () {
  try {
    const foundIndex = arrayCity.findIndex(
      (item) => item.toLowerCase() === nomeCittà.value.toLowerCase()
    );

    if (foundIndex !== -1) {
      fetchCity();
    } else {
      setCardStyleError(cardBody, errorDiv, input); // Imposto lo stile in caso di errore

      nomeCittà.value = ""; // azzero il campo input

      return;
    }
  } catch (error) {
    console.log(error);
  }
};

// ------------------ CHIAMATA FETCH CITY ------------------
export const fetchCity = async function () {
  /* prendo il valore dell'input e lo inserisco come variale nell'url del fetch */
  const urlScore = apiUrlScore();

  try {
    const response = await axios.get(urlScore);

    // Imposto le classi in caso di risposta positiva
    setCardStyleSucces(cardBody, errorDiv, input);

    // Inserisco i punteggi
    setcardResult(nomeCittà, response);

    //Inserisco tutti i singoli parametri
    const categories = _.get(response, API_CATEGORIES);

    setSingleItem(categories);

    fetchImg();
  } catch (error) {
    setCardStyleError(cardBody, errorDiv, input); // Imposto lo stile in caso di errore
    if ((error.name = "AxiosError")) {
      nomeCittà.value = ""; // azzero il campo input
    }
  }
};

// ------------------- CHIAMATA FETCH IMG --------------
// Questa funzione verrà chiamata in FetchCity
export const fetchImg = function () {
  const urlScore = apiUrlImage(); // Imposto l'url per la chiamata fetch dell'immagine

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
  // 'response' verrà passato dalla chiamata 'axios.get() di 'fetchImg'

  setCardStyleSucces(cardBody, errorDiv, input); // Imposto lo stile
  const urlPhoto = _.get(response, API_PHOTO); // Prendo l'url della foto

  imgCity.src = urlPhoto; // inserisco l'url come 'src' nell'html
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

//----------------- Correzione Valore Input Città -------------
/* Questa funzione serve per adattare il valore dell'input cercato 
in modo da aggiungerlo all'url del fetch.
la userò dentro 'apiUrlScore()' e ' apiUrlImage()' */

const correctName = function (cityName) {
  cityName = cityName.toLowerCase();
  cityName = cityName.replace(/\s+/g, "-");
  return cityName;
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
  scoreDiv.innerHTML = ""; // azzero il valore dei parametri nel caso di una seconda ricerca

  // Descrizione
  const descrizione = _.get(response, API_SUMMARY);
  description.innerHTML = "Description: " + descrizione;

  // Score totale
  const mediumScore = _.get(response, API_MEDIUM_SCORE).toFixed(2);

  // Valore medio approssimato a 2 numeri decimali
  totalScore.innerHTML = "Total score: " + mediumScore;
};

//------------------- Risultati Singoli Parametri ----------
/* Con questa funzione creo dinamicamente i vari div dei singoli item.
'categories' è un array contente i singoli valori delle varie statistiche,
da li ci applico un 'forEach()'.

Inserisco nome, score e la progressBar con la funzione 'progressBar()'*/

const setSingleItem = function (categories) {
  categories.forEach((element) => {
    //Creo i div e aggiungo lo stile
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

    // Creo i div della barra del punteggio
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
