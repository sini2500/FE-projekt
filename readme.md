## DT211G - frontend-baserad webbutveckling

Det här är slutprojektet för kursen frontend-baserad webbutveckling, VT 2026.

Webbplatsen är publicerad på Netlify: https://dt211g-projekt-sini2500.netlify.app/

JSDoc-dokumentation finns på https://dt211g-projekt-sini2500.netlify.app/docs/

Rapporten för projektet finns här i Git som `rapport.pdf`.

---

Recipe Roulette kombinerar flera API:er för att ge användaren slumpmässiga recept från olika delar av världen.

Utöver recept visas också geografisk information och fakta om landet recepten kommer ifrån.

När användaren klickar på knappen "New Recipe” hämtas:

 - ett slumpmässigt recept från TheMealDB
 - information om landet från REST Countries
 - koordinater från Nominatim
 - en karta från OpenStreetMap

Projektet utvecklades utan frontend-ramverk och fokuserar istället på JavaScript, DOM-uppdatering och API-användning via Fetch.

Projektet utvecklades med HTML5, JavaScript, SCSS, Vite, Node, Git & Github

---

API:er

TheMealDB: https://www.themealdb.com/

REST Countries: https://restcountries.com/

Nominatim: https://nominatim.openstreetmap.org/

OpenStreetMap: https://www.openstreetmap.org/