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
const imageBox = document.querySelector("#recipe-image");
const headerBox = document.querySelector("#recipe-header");
const ingredientsBox = document.querySelector("#recipe-ingredients");
const instructionsBox = document.querySelector("#recipe-instructions");

const triviaContainer = document.querySelector("#trivia");
const mapFrame = document.querySelector("#map");
const randomButton = document.querySelector("#random-btn");
const rouletteWheel = document.querySelector("#wheel");

// user actions
randomButton.addEventListener("click", newRandomRecipe);

// wheel spin

    // start spin

// recipe data

// get a random recipe
async function getRandomRecipe() {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");

  if (!res.ok) throw new Error("Failed to get recipe, sorry!");

  const data = await res.json();
  return data.meals[0];
}

// ingredients from themealdb is in messy format, needs sorting
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

// rendering the recipe
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
 * @param {string} place - Name of the location
 * @returns {Object} Latitude & longitude as float
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

// get info from rest countries api
async function getCountryInfo(country) {
  const res = await fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`);

  if (!res.ok) throw new Error("Failed to get country info, sorry!");

  const data = await res.json();
  return data[0];
}

// render trivia
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


// show loading
function showLoading() {
  headerBox.innerHTML = "<p>Loading recipe...</p>";
  ingredientsBox.innerHTML = "";
  instructionsBox.innerHTML = "";
  triviaContainer.innerHTML = "<p>Loading country info...</p>";
}

// show error
function showError(err) {
  headerBox.innerHTML = `<p>${err.body}...</p>`;
  triviaContainer.innerHTML = "<p>Error, reload the page...</p>";
}

// the whole thing
async function newRandomRecipe() {
  try {
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

// get random recipe on pageload
newRandomRecipe();