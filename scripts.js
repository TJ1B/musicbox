let songs = [];

// Fetch the songs from the JSON file
fetch('songs.json')
    .then(response => response.json())
    .then(data => {
        songs = data;
        renderSongs(songs); // Render songs after fetching
    });

function renderSongs(filteredSongs) {
    const songList = document.getElementById('songList');
    songList.innerHTML = '';

    for (const item of filteredSongs) {
        const li = document.createElement('li');
        li.textContent = `${item.songName} 由 ${item.singerName} [${item.language}]`;
        songList.appendChild(li);
    }
}

const searchBox = document.getElementById('searchBox');
searchBox.addEventListener('input', function() {
    const query = searchBox.value.toLowerCase();
    const filteredSongs = songs.filter(item =>
        item.songName.toLowerCase().includes(query) ||
        item.singerName.toLowerCase().includes(query) ||
        item.language.toLowerCase().includes(query)
    );
    renderSongs(filteredSongs);
});
