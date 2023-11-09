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

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('song-name')) {
            const songName = event.target.innerText;
            const singerName = event.target.parentElement.cells[1].innerText;
            const contentToCopy = `${songName} - ${singerName}`;
            copyToClipboard(contentToCopy);
            showCopyNotification();
        }
    });
});

function copyToClipboard(content) {
    const textarea = document.createElement('textarea');
    textarea.value = content;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function showCopyNotification() {
    const notification = document.getElementById('copyNotification');
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('song-name')) {
            // 移除之前点击的歌名的颜色
            const previousClickedSong = document.querySelector('.clicked-song');
            if (previousClickedSong) {
                previousClickedSong.classList.remove('clicked-song');
            }

            // 为当前点击的歌名添加颜色
            event.target.classList.add('clicked-song');

            const songName = event.target.innerText;
            const singerName = event.target.parentElement.cells[1].innerText;
            const contentToCopy = `${songName} - ${singerName}`;
            copyToClipboard(contentToCopy);
            showCopyNotification();
        }
    });
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


  // 世界时钟
function updateTimes() {
    const timeZones = [
        { el: 'time-beijing', timeZone: 'Asia/Shanghai' },
        { el: 'time-new-york', timeZone: 'America/New_York' },
        { el: 'time-los-angeles', timeZone: 'America/Los_Angeles' },
        { el: 'time-paris', timeZone: 'Europe/Paris' },
        { el: 'time-london', timeZone: 'Europe/London' },
        { el: 'time-tokyo', timeZone: 'Asia/Tokyo' },
    ];

    timeZones.forEach((item) => {
        const time = new Date().toLocaleTimeString('zh-CN', {
            timeZone: item.timeZone,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById(item.el).textContent = time;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    updateTimes();
    setInterval(updateTimes, 60000);
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
    
        const songNameCell = row.insertCell();
        songNameCell.innerText = item.songName;
        songNameCell.classList.add("song-name"); // Add the class here
    
        row.insertCell().innerText = item.singerName;
        row.insertCell().innerText = item.language;
    }



}

// 显示曲目总数量
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://tj1b.github.io/musicbox/songs.json');
        songs = await response.json();
        renderSongs(songs);

        // 更新曲目数量
        updateSongCount(songs.length);
    } catch (error) {
        console.error('Error fetching the song list:', error);
    }
});

// 更新曲目数量的函数
function updateSongCount(count) {
    const songCountElement = document.getElementById('songCount');
    songCountElement.textContent = `总收录曲目数量：${count}`;
}

// 随机歌曲
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
