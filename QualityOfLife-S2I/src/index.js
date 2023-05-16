import "./style.css";
import "bootstrap";
import "./progressbar.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { fetchCityCall } from "./fetch";

import { Search, input } from "./dom-elements";

Search.addEventListener("click", fetchCityCall);
input.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    fetchCityCall();
  }
});
