/**
 * Recipe Roulette
 * A mashup web application for random recipes.
 *
 * APIs:
 * - TheMealDB
 * - REST Countries
 * - Nominatim
 * - OpenStreetMap
 */

// menu

/**
 * Hamburger menu btn
 * @type {HTMLButtonElement}
 */
const menuBtn = document.querySelector('.burger');

/**
 * Navigation menu
 * @type {HTMLUListElement}
 */
const menu = document.querySelector('.menu');

/**
 * Toggles mobile hamburger menu
 */
menuBtn.addEventListener('click', () => {
    menu.classList.toggle('show');
});

// dark mode

/**
 * Dark mode toggle button
 * @type {HTMLElement}
 */
const toggle = document.getElementById("dark-toggle");

/**
 * Document body element
 * @type {HTMLBodyElement}
 */
const body = document.body;

/**
 * Toggles dark mode theme
 */
toggle.addEventListener("click", () => {
  body.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    toggle.textContent = "☀️";
  } else {
    toggle.textContent = "🌙";
  }
});

// index.html

/**
 * Recipe image container
 * @type {HTMLElement}
 */
const imageBox = document.querySelector("#recipe-image");

/**
 * Recipe header container
 * @type {HTMLElement}
 */
const headerBox = document.querySelector("#recipe-header");

/**
 * Ingredients container
 * @type {HTMLElement}
 */
const ingredientsBox = document.querySelector("#recipe-ingredients");

/**
 * Instructions container
 * @type {HTMLElement}
 */
const instructionsBox = document.querySelector("#recipe-instructions");

/**
 * Country trivia container
 * @type {HTMLElement}
 */
const triviaContainer = document.querySelector("#trivia");

/**
 * OpenStreetMap iframe
 * @type {HTMLIFrameElement}
 */
const mapFrame = document.querySelector("#map");

/**
 * Random recipe button
 * @type {HTMLButtonElement}
 */
const randomButton = document.querySelector("#random-btn");

/**
 * Roulette wheel element
 * @type {HTMLElement}
 */
const rouletteWheel = document.querySelector("#wheel");

/**
 * Loads a new random recipe
 */
randomButton.addEventListener("click", newRandomRecipe);

// recipe data

/**
 * Fetches a random recipe from TheMealDB
 * 
 * @async
 * @returns {Promise<Object>} Recipe object
 * @throws {Error} If API request fails
 */
async function getRandomRecipe() {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");

  if (!res.ok) throw new Error("Failed to get recipe, sorry!");

  const data = await res.json();
  return data.meals[0];
}

/**
 * Organizes ingredients and measurements from recipe object
 * 
 * @param {Object} recipe - Recipe object from API
 * @returns {string[]} Array of ingredient strings
 */
function getIngredients(recipe) {
  const list = [];

  for (let i = 1; i <= 20; i++) {
    const ing = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];

    if (ing && ing.trim()) {
      list.push(`${measure} ${ing}`);
    }
  }

  return list;
}

/**
 * Renders recipe content in DOM
 * 
 * @param {Object} recipe - Recipe object
 */
function renderRecipe(recipe) {
  const ingredients = getIngredients(recipe);

  imageBox.innerHTML = `
    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" />
  `;

  headerBox.innerHTML = `
    <h2>${recipe.strMeal}</h2>
    <p><strong>Origin:</strong> ${recipe.strArea || recipe.strCountry || ""}</p>
    <p><strong>Category:</strong> ${recipe.strCategory || ""}</p>
    <p><strong>Tags:</strong> ${recipe.strTags || ""}</p>
    <p><strong>Recipe source:</strong> <a href="${recipe.strSource || ""}">${recipe.strSource || ""}</a></p>   
  `;

  ingredientsBox.innerHTML = `
    <h3>Ingredients</h3>
    <ul>
      ${ingredients.map((i) => `<li>${i}</li>`).join("")}
    </ul>
  `;

  instructionsBox.innerHTML = `
    <h3>Instructions</h3>
    <p>${recipe.strInstructions}</p>
  `;
}

// map data

/**
 * Gets coordinates from Nominatim
 * @async
 * @param {string} place - Name of the location
 * @returns {Object} Latitude & longitude as float
 * @throws {Error} If coordinates cannot be fetched
 */
async function getCoordinates(place) {

    const url = `https://nominatim.openstreetmap.org/search?q=${place}&format=jsonv2&limit=1`;

    const res = await fetch(url);

    if (!res.ok) throw new Error("Failed to get coordinates, sorry!");

    const data = await res.json();

    if (!data.length) throw new Error("No coordinates found");

    return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
    };

}

/**
 *
 * Sets the iframe map marker to a specific position
 * @param {number} lat - latitude
 * @param {number} lon - longitude
 */
function updateMap(lat, lon) {

    const map = document.querySelector("#map");
    const zoom = 6;

    map.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-zoom},${lat-zoom},${lon+zoom},${lat+zoom}&layer=mapnik&marker=${lat},${lon}`;

}

// country info data

/**
 * Gets country information from REST Countries
 * 
 * @async
 * @param {string} country - Country name
 * @returns {Promise<Object>} Country object
 * 
 * @throws {Error} If API request fails
 */
async function getCountryInfo(country) {
  const res = await fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`);

  if (!res.ok) throw new Error("Failed to get country info, sorry!");

  const data = await res.json();
  return data[0];
}

/**
 * Renders country info in DOM
 * 
 * @param {Object} country - Country object
 */
function renderTrivia(country) {
  const languages = Object.values(country.languages || {}).join(", ");

  triviaContainer.innerHTML = `
    <div class="card">
      <img src="${country.flags.svg}" alt="Flag" />
      <h2>${country.name.common}</h2>

      <p><strong>Capital:</strong> ${
        country.capital?.[0] || "Unknown"
      }</p>

      <p><strong>Region:</strong> ${country.region}</p>

      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>

      <p><strong>Languages:</strong> ${languages}</p>
    </div>
  `;
}


/**
 * Shows loading state
 */
function showLoading() {
  headerBox.innerHTML = "<p>Loading recipe...</p>";
  ingredientsBox.innerHTML = "";
  instructionsBox.innerHTML = "";
  triviaContainer.innerHTML = "<p>Loading country info...</p>";
}

/**
 * Shows error message
 * 
 * @param {Error} err - Error object
 */
function showError(err) {
  headerBox.innerHTML = `<p>${err.body}...</p>`;
  triviaContainer.innerHTML = "<p>Error, reload the page...</p>";
}

// main function

/**
 * Fetches and renders
 * a new random recipe with:
 * - recipe info
 * - country info
 * - map coordinates
 * 
 * @async
 */
async function newRandomRecipe() {
  try {
    
    // Spin the wheel
    rouletteWheel.classList.remove("spin");
    void rouletteWheel.offsetWidth;
    rouletteWheel.classList.add("spin");

    // show loading text
    showLoading();

    // Recipe
    const recipe = await getRandomRecipe();

    let country = recipe.strCountry;

    // Country info
    const countryInfo = await getCountryInfo(country);

    // Coordinates
    const coords = await getCoordinates(country);

    // Render everything
    renderRecipe(recipe);
    renderTrivia(countryInfo);
    updateMap(coords.lat, coords.lon, country);

  } catch (err) {
    console.error(err);
    showError(err);
  }
}

/**
 * Loads first recipe on page load
 */
newRandomRecipe();