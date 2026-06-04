/**
 * Funktioner för kartan
 * @module karta
 */

/**
 * Hämtar koordinater via Nominatim
 * @param {string} place - Namn på platsen användaren söker
 * @returns {Object} latitud och longitud som float
 */
async function getCoordinates(place) {

    const url = `https://nominatim.openstreetmap.org/search?q=${place}&format=jsonv2`;

    const response = await fetch(url);
    const data = await response.json();

    return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
    };
}

/**
 * Visar kartan i iframe med markör
 * @param {number} lat - latitud
 * @param {number} lon - longitud
 */
function showMap(lat, lon) {

    const map = document.getElementById("map1");

    map.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.05},${lat-0.05},${lon+0.05},${lat+0.05}&layer=mapnik&marker=${lat},${lon}`;

}

/**
 * Hanterar formulär-submit
 * @param {Event} event
 */
async function doSearch(event) {

    event.preventDefault();

    const place = document.getElementById("map-search-input").value;

    const coordinates = await getCoordinates(place);

    showMap(coordinates.lat, coordinates.lon);
}

// Form submit
document.getElementById("map-search").addEventListener("submit", doSearch);

// Kartan när sidan laddas
showMap(56.87906072279415, 14.809438499999942);