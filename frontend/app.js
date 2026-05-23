const container = document.getElementById("movies");
const search = document.getElementById("search");

let allVideos = [];

async function loadVideos() {

    const response = await fetch(
      "http://localhost:3000/api/videos"
    );

    const data = await response.json();

    allVideos = data;

    renderVideos(allVideos);
}

function renderVideos(videos) {

    container.innerHTML = "";

    videos.forEach(video => {

        let thumb;

        if (video.status === 4) {

            //thumb = video.thumbnail;
            thumb = video.thumbnail || "https://dummyimage.com/500x300/333/fff&text=No+Thumbnail";

        } else {

            thumb =
              "https://dummyimage.com/500x300/333/fff&text=Encoding";

        }

        const div = document.createElement("div");

        div.className = "card";

        div.innerHTML = `

            <div class="play-overlay">
              ▶
            </div>

            <img
              src="${thumb}"
              onerror="this.src='https://dummyimage.com/500x300/222/fff&text=No+Thumbnail'"
            >

            <div class="card-content">

                <h3>${video.title}</h3>

                <div class="status">
                    Status: ${video.status}
                </div>

                <div class="status">
                    Views: ${video.views}
                </div>

                <div class="status">
                    Length: ${Math.floor(video.length / 60)} min
                </div>

                <div class="progress">
                    <div
                      class="progress-bar"
                      style="width:${video.encodeProgress}%">
                    </div>
                </div>

            </div>
        `;

        div.onclick = () => openPlayer(video.player);

        container.appendChild(div);
    });
}

function openPlayer(url) {

    const modal = document.getElementById("playerModal");
    const frame = document.getElementById("playerFrame");

    frame.src = url;

    modal.classList.remove("hidden");

    // Continue watching
    localStorage.setItem("lastVideo", url);
}

function closePlayer() {

    const modal = document.getElementById("playerModal");
    const frame = document.getElementById("playerFrame");

    frame.src = "";

    modal.classList.add("hidden");
}

function filterReady() {

    const ready = allVideos.filter(v => v.status === 4);

    renderVideos(ready);
}

function filterEncoding() {

    const encoding = allVideos.filter(v => v.status !== 4);

    renderVideos(encoding);
}

function filterAll() {
    renderVideos(allVideos);
}

search.addEventListener("input", e => {

    const value = e.target.value.toLowerCase();

    const filtered = allVideos.filter(video => {

        return video.title
            .toLowerCase()
            .includes(value);
    });

    renderVideos(filtered);
});

async function register() {

    const username =
      document.getElementById("username").value;

    const password =
      document.getElementById("password").value;

    const response = await fetch(
      "http://localhost:3000/api/register",
      {
        method: "POST",

        headers: {
            "Content-Type":
              "application/json"
        },

        body: JSON.stringify({
            username,
            password
        })
      }
    );

    const data = await response.json();

    alert("Registrované");
}

async function login() {

    const username =
      document.getElementById("username").value;

    const password =
      document.getElementById("password").value;

    const response = await fetch(
      "http://localhost:3000/api/login",
      {
        method: "POST",

        headers: {
            "Content-Type":
              "application/json"
        },

        body: JSON.stringify({
            username,
            password
        })
      }
    );

    const data = await response.json();

    if (data.token) {

        localStorage.setItem(
          "token",
          data.token
        );

        alert("Prihlásený");

    } else {

        alert(data.error);

    }

}

loadVideos();