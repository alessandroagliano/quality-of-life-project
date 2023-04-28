import "./style.css";
import "bootstrap";
import "./progressbar.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { fetchScore } from "./fetch";

import { Search, input } from "./dom-elements";

Search.addEventListener("click", fetchScore);
input.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    fetchScore();
  }
});
