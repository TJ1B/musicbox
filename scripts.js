let songs = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://tj1b.github.io/musicbox/songs.json');
        songs = await response.json();
        renderSongs(songs);
    } catch (error) {
        console.error('Error fetching the song list:', error);
    }
});

document.getElementById('searchBox').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filteredSongs = songs.filter(song => 
        song.songName.toLowerCase().includes(searchTerm) || 
        song.singerName.toLowerCase().includes(searchTerm) || 
        song.language.toLowerCase().includes(searchTerm)
    );
    renderSongs(filteredSongs);
});

let currentSort = { key: 'songName', direction: 'asc' };
document.querySelectorAll('#songTable th').forEach(th => {
    th.addEventListener('click', function() {
        const sortKey = this.dataset.sort;
        if (sortKey) {
            currentSort.direction = (currentSort.key === sortKey && currentSort.direction === 'asc') ? 'desc' : 'asc';
            currentSort.key = sortKey;
            renderSongs(songs);
        }
    });
});

function renderSongs(filteredSongs) {
    if (!Array.isArray(filteredSongs)) {
        console.error("Expected an array but got:", filteredSongs);
        return;
    }

    const songList = document.getElementById('songList');
    songList.innerHTML = '';

    filteredSongs.sort((a, b) => {
        if (a[currentSort.key] < b[currentSort.key]) return currentSort.direction === 'asc' ? -1 : 1;
        if (a[currentSort.key] > b[currentSort.key]) return currentSort.direction === 'asc' ? 1 : -1;
        return 0;
    });

    for (const item of filteredSongs) {
        const row = songList.insertRow();
        row.insertCell().innerText = item.songName;
        row.insertCell().innerText = item.singerName;
        row.insertCell().innerText = item.language;
    }
}

document.getElementById('randomPick').addEventListener('click', function() {
    if (songs.length === 0) {
        document.getElementById('randomResult').innerText = "歌曲列表为空！";
        return;
    }

    const randomSong = songs[Math.floor(Math.random() * songs.length)];

    // Highlight the song in the table
    document.querySelectorAll('#songList tr').forEach((row, index) => {
        if (songs[index] === randomSong) {
            row.classList.add('highlighted-row');

            // Scroll to the highlighted song
            row.scrollIntoView({ block: 'center', behavior: 'smooth' });
        } else {
            row.classList.remove('highlighted-row');
        }
    });

    document.getElementById('randomResult').innerText = `随机歌曲：${randomSong.songName} 由 ${randomSong.singerName}`;
});
