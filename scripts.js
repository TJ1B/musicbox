let songs = [];

// Fetch the songs from the JSON file
fetch('songs.json')
    .then(response => response.json())
    .then(data => {
        songs = data;
        renderSongs(songs); // Render songs after fetching
    });

function renderSongs(filteredSongs) {
    songList.innerHTML = '';
    for (const item of filteredSongs) {
        const li = document.createElement('li');
        li.textContent = `${item.song} by ${item.singer} [${item.language}]`;
        songList.appendChild(li);
    }
}

searchBox.addEventListener('input', function() {
    const query = searchBox.value.toLowerCase();
    const filteredSongs = songs.filter(item => 
        item.song.toLowerCase().includes(query) || 
        item.singer.toLowerCase().includes(query) ||
        item.language.toLowerCase().includes(query)
    );
    renderSongs(filteredSongs);
});
