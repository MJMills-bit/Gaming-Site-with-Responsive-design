const platformUrl = `https://api.rawg.io/api/platforms?key=${APIKEY}`;
const storesAvailable = `https://api.rawg.io/api/stores?key=${APIKEY}`;
const url = `https://api.rawg.io/api/games?key=${APIKEY}`;
let currentPage = 1;
const pageSize = 12;
let currentGenre = "";

// script.js
document.getElementById("toggleButton").addEventListener("click", function () {
  let aside = document.getElementById("myAside");
  if (aside.style.display === "none") {
    aside.style.display = "block";
  } else {
    aside.style.display = "none";
  }
});

document.getElementById("search-button").addEventListener("click", searchGames);
document.getElementById("next-button").addEventListener("click", nextPage);
document.getElementById("prev-button").addEventListener("click", prevPage);

async function searchGames() {
  currentPage = 1; // Reset to the first page on new search
  const query = document.getElementById("search-bar").value;
  const urlPage = `${url}&search=${query}&page=${currentPage}&page_size=${pageSize}`;

  fetchGames(urlPage);
}

async function fetchGames(urlPage) {
  try {
    const response = await fetch(urlPage);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    const customResponse = await fetch("./customInfo.json");
    const customData = await customResponse.json();

    const customInfoMap = {};
    customData.forEach((info) => {
      customInfoMap[info.custId] = {
        extention: info.extention,
        extention2: info.extention2,
        entention: info.extention2,
      };
      //console.log(extention);
      // const customInfoMap2 = {};
      // customInfoMap2[info.custId] = info.extention2;
      //console.log(info.extention2);
    });

    data.results.forEach((game) => {
      const extraData = customInfoMap[game.id] || {};
      game.extention = extraData.extention || "";
      game.extention2 = extraData.extention2 || "";
      game.extention3 = extraData.extention3 || "";
    });

    displayGames(data.results);
    updatePagination(data.count);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function displayGames(games) {
  const gameList = document.querySelector(".games");
  gameList.innerHTML = ""; // Clear the game list

  for (const item of games) {
    const title = item.name;
    const image = item.background_image;
    const stores = item.stores;
    const ext = item.extention;
    const ext2 = item.extention2;

    let gameLink = item.domain; // Default link

    if (
      stores &&
      stores.length > 0 &&
      stores[0].store &&
      stores[0].store.domain
    ) {
      gameLink = `https://${stores[0].store.domain}`;
    }

    if (
      stores &&
      stores.length > 0 &&
      stores[1].store &&
      stores[1].store.domain
    ) {
      gameLink2 = `https://${stores[1].store.domain}`;
    }
    // let gameLink3 = "";
    // if (
    //   stores &&
    //   stores.length > 0 &&
    //   stores[2].store &&
    //   stores[2].store.domain
    // ) {
    //   gameLink3 = `https://${stores[2].store.domain}`;
    // }
    // <a href="${gameLink3}/${ext3}" target="_blank">Purchase Here</a>
    // console.log(gameLink3);

    const game = `
          <li>
              <img src="${image}" alt="${title}">
              <h2>${title}</h2>
              <a href="${gameLink}/${ext}" target="_blank">Purchase Here</a>
              <a href="${gameLink2}/${ext2}" target="_blank">Purchase Here</a>
              
          </li>
      `;
    gameList.insertAdjacentHTML("beforeend", game);
  }
}

function updatePagination(totalCount) {
  const totalPages = Math.ceil(totalCount / pageSize);
  document.getElementById(
    "page-info"
  ).textContent = `Page ${currentPage} of ${totalPages}`;

  document.getElementById("prev-button").disabled = currentPage === 1;
  document.getElementById("next-button").disabled = currentPage === totalPages;
}

function nextPage() {
  currentPage++;
  const query = document.getElementById("search-bar").value;
  const genreParam = currentGenre ? `&genres=${currentGenre}` : "";
  const urlPage = `${url}&search=${query}&page=${currentPage}&page_size=${pageSize}${genreParam}`;
  fetchGames(urlPage);
}

function prevPage() {
  currentPage--;
  const query = document.getElementById("search-bar").value;
  const genreParam = currentGenre ? `&genres=${currentGenre}` : "";
  const urlPage = `${url}&search=${query}&page=${currentPage}&page_size=${pageSize}${genreParam}`;
  fetchGames(urlPage);
}

function filterByGenre(genre) {
  currentGenre = genre;
  currentPage = 1;
  const query = document.getElementById("search-bar").value;
  const genreParam = genre ? `&genres=${genre}` : "";
  const urlPage = `${url}&search=${query}&page=${currentPage}&page_size=${pageSize}${genreParam}`;
  fetchGames(urlPage);
}

// Initial load
fetchGames(`${url}&page=${currentPage}&page_size=${pageSize}`);
