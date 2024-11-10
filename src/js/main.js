
 // Get genre from URL and update page title
const urlParams = new URLSearchParams(window.location.search);
const genre = urlParams.get("genre");
document.getElementById("genreTitle").textContent = `Genre: ${genre}`;

const lastfm = new LastFM({apiKey: import.meta.env.VITE_LASTFM_API_KEY, apiSecret: import.meta.env.VITE_LASTFM_API_SECRET, apiUrl: 'https://ws.audioscrobbler.com/2.0/'});
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
})