import "./style.css";
import "bootstrap";
import "./progressbar.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { fetchCallCity } from "./fetch";

import { Search, input } from "./dom-elements";

Search.addEventListener("click", fetchCallCity);
input.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    fetchCallCity();
  }
});
