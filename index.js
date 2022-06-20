function generateListHTML(data = []) {
  let html = "";

  if (data.length > 0) {
    for (let i = 0; i < data.length; i += 1) {
      const url = data[i].url;
      const imageURL = data[i].images.jpg.image_url;
      const title = data[i].title;
      const date = data[i].aired.string;
      const episodes = data[i].episodes;
      const info = `${data[i].type} - ${episodes} ` + episodes > 1 ? "Episodes" : "Episode";
      const synopsis = data[i].synopsis;

      html +=
          `<a target="_blank" href="${url}">
            <div class="card">
              <img alt="Anime" class="card-image" src="${imageURL}" />
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

function onDocumentReady(fn) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

onDocumentReady(() => {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const searchContent = document.getElementById("searchContent");

  function fetchAnime() {
    const API_URL = `https://api.jikan.moe/v4/anime?limit=20&q=${searchInput.value}`;

    searchInput.disabled = true;
    searchButton.disabled = true;
    searchContent.innerHTML = 
      `<div class="center">
        <img alt="Loader" class="loader-image" src="./assets/images/loader.gif" />
      </div>`;

    fetch(API_URL)
      .then((response) => response.json())
      .then((response) => {
        searchContent.innerHTML = generateListHTML(response.data);
      })
      .catch(() => {
        searchContent.innerHTML = 
          `<div class="center">
            Request failed...
          </div>`;
      })
      .finally(() => {
        searchInput.disabled = false;
        searchButton.disabled = false;
      });
  }

  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      fetchAnime();
    }
  });

  searchButton.addEventListener("click", () => {
    fetchAnime();
  });
});
