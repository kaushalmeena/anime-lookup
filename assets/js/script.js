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

  xmlhttp.open("GET", "https://api.jikan.moe/v3/search/anime?limit=16&q=" + searchInput.value, true);
  xmlhttp.responseType = 'json';
  xmlhttp.send();
}

function generateContent(results = []) {
  var html = "";
  var i;

  if (results.length > 0) {
    for (i = 0; i < results.length; i++) {
      html +=
        `<a target="_blank" rel="noopener noreferrer" href="${decodeURIComponent(results[i].url)}">
            <div class="card">
              <img alt="Search" class="card-image" src="${decodeURIComponent(results[i].image_url)}" />
              <div class="card-content">
                <div class="card-title">${results[i].title}</div>
                <div class="card-date">${getDate(results[i].start_date)}</div>
                <div class="card-info">${results[i].type} - ${results[i].episodes} Eps.</div>
                <div class="card-synopsis">${results[i].synopsis}</div>
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