/**
 * Recipe Roulette
 *
 * APIs:
 * - TheMealDB
 * - REST Countries
 * - Nominatim
 * - OpenStreetMap
 */

/* menu */
const menuBtn = document.querySelector('.burger');
const menu = document.querySelector('.menu');

menuBtn.addEventListener('click', () => {
    menu.classList.toggle('show');
});

/* dark mode */
const toggle = document.getElementById("dark-toggle");
const body = document.body;

toggle.addEventListener("click", () => {
  body.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    toggle.textContent = "☀️";
  } else {
    toggle.textContent = "🌙";
  }
});

/* index.html */
const recipeContainer = document.querySelector("#recipe");
const triviaContainer = document.querySelector("#trivia");
const randomButton = document.querySelector("#random-btn");
const rouletteWheel = document.querySelector("#wheel");

// user actions
randomButton.addEventListener("click", newRandomRecipe);

// wheel spin

    // start spin

// recipe data

    // get recipe from themealdb
    // filter ingredients from recipe
    // render recipe

// map data

    // get coordinates from nominatim api
    // render map

// trivia data

    // get info from rest countries api
    // render trivia

// helpers

    // show loading
    // show error

// the whole thing
async function newRandomRecipe() {

    // try
    // get recipe from api

    // get country name

    // convert country name for next api if needed

    // get country info/trivia from api

    // get country coordinates from api

    // render recipe
    // render trivia
    // render map

    // catch error
    // show error message

}

// get random recipe on pageload
newRandomRecipe();