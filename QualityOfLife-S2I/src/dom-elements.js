const { default: axios } = require("axios");
import { fetchImg, fetchScore, ricerca2, ricerca3 } from "./fetch";

/* Selezione Elementi Html */
export const Search = document.getElementById("search");
export const nomeCittà = document.getElementById("città");
export const input = document.querySelector(".form-control");
export const errorDiv = document.querySelector("#errorDiv");
export const imgCity = document.querySelector("#imgCity");
export const description = document.querySelector("#description");
export const totalScore = document.querySelector("#totalScore");
export const scoreDiv = document.querySelector("#scoreDiv");
export const cardBody = document.querySelector("#card-body");

Search.addEventListener("click", fetchScore);
input.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    fetchScore();
  }
});

Search.addEventListener("click", fetchImg);
input.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    fetchImg();
  }
});
