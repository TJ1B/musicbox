const songs = [
    "Song 1",
    "Song 2",
    "Song 3",
    // ... add all your songs here
];

const songList = document.getElementById('songList');
const searchBox = document.getElementById('searchBox');

function renderSongs(filteredSongs) {
    songList.innerHTML = '';
    for (const song of filteredSongs) {
        const li = document.createElement('li');
        li.textContent = song;
        songList.appendChild(li);
    }
}

searchBox.addEventListener('input', function() {
    const query = searchBox.value.toLowerCase();
    const filteredSongs = songs.filter(song => song.toLowerCase().includes(query));
    renderSongs(filteredSongs);
});

renderSongs(songs);
