document.getElementById('genres').addEventListener('change', function() {
    // Trigger slide effect by adding a class
    document.querySelector('.record-container').classList.add('slide-left');
    document.querySelector('.song-info').classList.add('show');
    
    // Fetch genre info from API and display
    const genre = this.value;
    document.getElementById('genre-title').innerText = genre;

    // Call function to load song details from API
    loadSongDetails(genre);
});

document.getElementById('refresh-btn').addEventListener('click', function() {
    // Refresh song details from the API
    const genre = document.getElementById('genre-title').innerText;
    loadSongDetails(genre);
});

function loadSongDetails(genre) {
    // Placeholder for fetching data from Deezer API
    // Update #song-details with song information
    document.getElementById('song-details').innerText = "New song details for genre: " + genre;
}
