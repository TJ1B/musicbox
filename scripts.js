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

function renderSongs(filteredSongs) {
    if (!Array.isArray(filteredSongs)) {
        console.error("Expected an array but got:", filteredSongs);
        return;
    }
    
    // 检查是否需要按照拼音排序
    if (currentSort.key === 'songName' && window.pinyin) {
        // 使用 pinyin 库将歌曲名转换为拼音并进行排序
        filteredSongs.sort((a, b) => {
            let pyA = pinyin(a.songName, { style: pinyin.STYLE_NORMAL }).join('');
            let pyB = pinyin(b.songName, { style: pinyin.STYLE_NORMAL }).join('');
            // 根据拼音进行升序或降序排序
            return (pyA.localeCompare(pyB)) * (currentSort.direction === 'asc' ? 1 : -1);
        });
    } else {
        // 其他字段的通用排序逻辑
        filteredSongs.sort((a, b) => {
            if (a[currentSort.key] < b[currentSort.key]) return currentSort.direction === 'asc' ? -1 : 1;
            if (a[currentSort.key] > b[currentSort.key]) return currentSort.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    // 清空当前歌曲列表
    const songList = document.getElementById('songList');
    songList.innerHTML = '';

    // 遍历排序后的歌曲列表，并渲染到页面上
    filteredSongs.forEach(song => {
        const row = songList.insertRow();
        const songNameCell = row.insertCell();
        songNameCell.innerText = song.songName;
        songNameCell.classList.add("song-name"); // 添加类名以触发后面的点击事件
        
        const singerNameCell = row.insertCell();
        singerNameCell.innerText = song.singerName;
        singerNameCell.classList.add("singer-name"); // 添加类名以触发后面的点击事件
        
        const languageCell = row.insertCell();
        languageCell.innerText = song.language;
    });
    
    // 重新绑定歌手名和歌曲名的点击事件
    bindClickEvents();
}

function bindClickEvents() {
    // 绑定歌曲名点击事件
    document.querySelectorAll('.song-name').forEach(songNameCell => {
        songNameCell.addEventListener('click', () => {
            // 歌曲名点击的逻辑
        });
    });
    
    // 绑定歌手名点击事件
    document.querySelectorAll('.singer-name').forEach(singerNameCell => {
        singerNameCell.addEventListener('click', () => {
            // 歌手名点击的逻辑
        });
    });
}

// 请确保在加载页面时调用 renderSongs 函数


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
