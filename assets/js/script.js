document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("searchInput").addEventListener('keypress', checkEnterKey, false);
  document.getElementById("searchButton").addEventListener('click', fetchAnimeList, false);
}, false);

function checkEnterKey(e) {
  if (e.keyCode == 13) {
    fetchAnimeList();
    return false;
  }
}

function fetchAnimeList() {
  var xmlhttp = null;
  var apiUrl = "https://api.jikan.moe/v3/search/anime?limit=20&q=";

  var searchInput = document.getElementById("searchInput");
  var searchButton = document.getElementById("searchButton");
  var searchContent = document.getElementById("searchContent");

  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  } else {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  searchInput.disabled = true;
  searchButton.disabled = true;
  searchContent.innerHTML =
    `<div class="center">
      <img alt="Loader" class="loader-image" src="./assets/img/loader.gif" />
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
  xmlhttp.responseType = 'json';
  xmlhttp.send();
}

function generateContent(results = []) {
  var html = "";
  var i;

  var url;
  var imageUrl;
  var title;
  var date;
  var episodes;
  var info;
  var synopsis;

  if (results.length > 0) {
    for (i = 0; i < results.length; i++) {
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
  var date = new Date(dateString);
  return date.getFullYear();
}