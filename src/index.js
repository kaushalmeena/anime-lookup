function generateListHTML(data = []) {
  let html = "";

  if (data.length > 0) {
    for (let i = 0; i < data.length; i += 1) {
      const { url, images, title, aired, type, episodes, synopsis } = data[i];

      html += `<a target="_blank" href="${url}">
                <div class="card">
                  <img alt="Anime" class="card-image" src="${images.jpg.image_url}" />
                  <div class="card-content">
                    <div class="card-title">${title}</div>
                    <div class="card-date">${aired.string}</div>
                    <div class="card-info">${type} - (${episodes} eps)</div>
                    <div class="card-synopsis">${synopsis}</div>
                  </div>
                </div>
              </a>`;
    }
  } else {
    html = `<div class="center">
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
    searchContent.innerHTML = `<div class="center">
                                <img alt="Loader" class="loader-image" src="./assets/images/loader.gif" />
                              </div>`;

    fetch(API_URL)
      .then((response) => response.json())
      .then((response) => {
        searchContent.innerHTML = generateListHTML(response.data);
      })
      .catch(() => {
        searchContent.innerHTML = `<div class="center">
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
