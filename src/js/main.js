import LastFM from './lastfm.api.js';

document.addEventListener("DOMContentLoaded", function() {
  // Initialize LastFM
  const lastfm = new LastFM({
    apiKey: import.meta.env.VITE_LASTFM_API_KEY,
    apiSecret: import.meta.env.VITE_LASTFM_API_SECRET,
    apiUrl: 'https://ws.audioscrobbler.com/2.0/',
  });

  // Check if we're on index.html or genre.html
  if (document.querySelector(".main-content")) {
    setupIndexPage(lastfm);
  } else if (document.getElementById("genreTitle")) {
    setupGenrePage(lastfm);
  }
});

// Define showSongInfo and refreshSongInfo at the top level of setupIndexPage
function setupIndexPage(lastfm) {
    const genreSelect = document.getElementById("genre");
    const songInfoDiv = document.getElementById("songInfo");
    genreSelect.addEventListener("change", () => {
        if (genreSelect.value) {
            showSongInfo(lastfm);
        } else {
            console.warn("No genre selected.");
        }
    });
    
    window.showSongInfo = function() { // Moved to global scope
      if (!genreSelect.value) return;
      getRandomSongInfo(lastfm, genreSelect.value);
      songInfoDiv.classList.remove("hidden");
    };
  
    function refreshSongInfo() { // This can remain scoped
      if (!genreSelect.value) return;
      getRandomSongInfo(lastfm, genreSelect.value);
    }

    document.querySelector(".refresh-button").addEventListener("click", refreshSongInfo);
    
    document.querySelector(".more-button").onclick = function() {
      const genre = genreSelect.value;
      window.location.href = `genre.html?genre=${genre}`;
    };
}

  

// Fetch a random song and update the song info
function fetchTopTracks(lastfm, genre) {
    return new Promise((resolve, reject) => {
        lastfm.tag.getTopTracks({ tag: genre }, {
            success: resolve,
            error: reject,
        });
    });
}

function fetchTrackInfo(lastfm, track, artist) {
    return new Promise((resolve, reject) => {
        lastfm.track.getInfo({ track, artist }, {
            success: resolve,
            error: reject,
        });
    });
}

async function getRandomSongInfo(lastfm, genre) {
    try {
        console.log(`Fetching tracks for genre: ${genre}`);
        const normalizedGenre = genre.toLowerCase();
        const data = await fetchTopTracks(lastfm, normalizedGenre);

        if (!data || !data.tracks || !data.tracks.track || data.tracks.track.length === 0) {
            console.warn("No tracks found for this genre:", genre);
            document.querySelector("#songInfo p").textContent = "No songs found for this genre.";
            return;
        }

        const tracks = data.tracks.track;
        console.log("Tracks:", tracks);

        const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
        console.log("Selected track:", randomTrack);

        document.querySelector("#songInfo h2").textContent = randomTrack.name;

        const trackData = await fetchTrackInfo(lastfm, randomTrack.name, randomTrack.artist.name);

        document.querySelector("#songInfo p").innerHTML = trackData.track.wiki
            ? trackData.track.wiki.summary
            : "No additional information available.";
    } catch (error) {
        console.error("Error fetching song info:", error);
        document.querySelector("#songInfo p").textContent = "Could not load song info.";
    }
}




function setupGenrePage(lastfm) {
  const urlParams = new URLSearchParams(window.location.search);
  const genre = urlParams.get("genre");
  document.getElementById("genreTitle").textContent = `Genre: ${genre}`;

  lastfm.tag.getInfo({ tag: genre }, {
    success: function(data) {
      const genreInfo = data.tag;
      const genreDescription = genreInfo.wiki.summary;
      document.getElementById("genreInfo").innerHTML = genreDescription;
    }
  });

  lastfm.tag.getTopTracks({ tag: genre }, {
    success: function(data) {
      const topTracks = data.tracks.track;
      const songList = document.querySelector('.song-list');
      topTracks.forEach(function(track) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <h3>${track.name}</h3>
          <p>${track.artist.name}</p>
          <hr>
        `;
        songList.appendChild(listItem);
      });
    }
  });
}
