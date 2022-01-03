onDocumentReady(function () {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const searchContent = document.getElementById("searchContent");

  searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      fetchAnimeList({ searchInput, searchButton, searchContent });
      return false;
    }
  });

  searchButton.addEventListener("click", function () {
    fetchAnimeList({ searchInput, searchButton, searchContent });
  });
});

function fetchAnimeList({ searchInput, searchButton, searchContent }) {
  const xmlhttp = new XMLHttpRequest();
  const apiUrl = "https://api.jikan.moe/v3/search/anime?limit=20&q=";

  searchInput.disabled = true;
  searchButton.disabled = true;
  searchContent.innerHTML =
    `<div class="center">
      <img alt="Loader" class="loader-image" src="./assets/images/loader.gif" />
    </div>`;

  xmlhttp.onload = function () {
    if (xmlhttp.status == 200) {
      searchContent.innerHTML = generateContent(xmlhttp.response.results);
    } else {
      searchContent.innerHTML =
        `<div class="center">
          Error ${xmlhttp.status}: ${xmlhttp.statusText}
        </div>`;
    }
    searchInput.disabled = false;
    searchButton.disabled = false;
  };

  xmlhttp.onerror = function () {
    searchContent.innerHTML =
      `<div class="center">
        Request failed...
      </div>`;
  };

  xmlhttp.open("GET", apiUrl + searchInput.value, true);
  xmlhttp.responseType = "json";
  xmlhttp.send();
}

function generateContent(results = []) {
  let html = "";

  let url;
  let imageUrl;
  let title;
  let date;
  let episodes;
  let info;
  let synopsis;

  if (results.length > 0) {
    for (let i = 0; i < results.length; i++) {
      url = decodeURIComponent(results[i].url);
      imageUrl = decodeURIComponent(results[i].image_url);
      title = results[i].title;
      date = getDate(results[i].start_date);
      episodes = results[i].episodes;
      info = `${results[i].type} - ${episodes} ${episodes > 1 ? "Episodes" : "Episode"}`;
      synopsis = results[i].synopsis;

      html +=
        `<a target="_blank" rel="noopener noreferrer" href="${url}">
            <div class="card">
              <img alt="Search" class="card-image" src="${imageUrl}" />
              <div class="card-content">
                <div class="card-title">${title}</div>
                <div class="card-date">${date}</div>
                <div class="card-info">${info}</div>
                <div class="card-synopsis">${synopsis}</div>
              </div>
            </div>
          </a>`;
    }
  } else {
    html =
      `<div class="center">
        No results were found...
      </div>`;
  }

  return html;
}

function getDate(dateString) {
  const date = new Date(dateString);
  return date.getFullYear();
}

function onDocumentReady(fn) {
  if (document.readyState != "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}