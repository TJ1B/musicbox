let songs = [];
let currentSort = { key: 'songName', direction: 'asc' };

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://tj1b.github.io/musicbox/songs.json');
        songs = await response.json();
        console.log('Songs loaded:', songs.length);
        renderSongs(songs);
        populateFilterOptions();
        updateSongCount(songs.length);
    } catch (error) {
        console.error('Error fetching the song list:', error);
    }
});

function populateFilterOptions() {
    console.log('Populating filter options');
    console.log('Number of songs:', songs.length);

    const singerSet = new Set();
    const languageSet = new Set();

    songs.forEach(song => {
        singerSet.add(song.singerName);
        languageSet.add(song.language);
    });

    console.log('Unique singers:', singerSet.size);
    console.log('Unique languages:', languageSet.size);

    const singerFilter = document.getElementById('singerNameFilter');
    const languageFilter = document.getElementById('languageFilter');

    if (!singerFilter || !languageFilter) {
        console.error('Filter elements not found');
        return;
    }

    singerSet.forEach(singer => {
        const option = document.createElement('option');
        option.value = singer;
        option.textContent = singer;
        singerFilter.appendChild(option);
    });

    languageSet.forEach(language => {
        const option = document.createElement('option');
        option.value = language;
        option.textContent = language;
        languageFilter.appendChild(option);
    });

    console.log('Filter options populated');
}

document.getElementById('singerNameFilter').addEventListener('change', filterSongs);
document.getElementById('languageFilter').addEventListener('change', filterSongs);

function filterSongs() {
    const selectedSinger = document.getElementById('singerNameFilter').value;
    const selectedLanguage = document.getElementById('languageFilter').value;

    const rows = document.querySelectorAll('#songList tr');

    rows.forEach(row => {
        const singerName = row.querySelector('td:nth-child(2)').textContent;
        const language = row.querySelector('td:nth-child(3)').textContent;

        const singerMatch = !selectedSinger || singerName === selectedSinger;
        const languageMatch = !selectedLanguage || language === selectedLanguage;

        row.style.display = (singerMatch && languageMatch) ? '' : 'none';
    });
}

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
        songNameCell.classList.add("song-name");

        row.insertCell().innerText = item.singerName;
        row.insertCell().innerText = item.language;
    }
}

function updateSongCount(count) {
    const songCountElement = document.getElementById('songCount');
    songCountElement.textContent = `总收录曲目数量：${count}`;
}


 // 世界时钟
 function updateTimes() {
    const baseTimeZone = 'Asia/Shanghai'; // 设置北京时间为基准时区
    const baseTime = new Date().toLocaleString('en-US', { timeZone: baseTimeZone });
    const baseDate = new Date(baseTime).getDate(); // 获取北京日期
    
    const timeZones = [
      { el: 'time-beijing', timeZone: 'Asia/Shanghai', dateDiffEl: 'date-diff-beijing' },
      { el: 'time-new-york', timeZone: 'America/New_York', dateDiffEl: 'date-diff-new-york' },
      { el: 'time-los-angeles', timeZone: 'America/Los_Angeles', dateDiffEl: 'date-diff-los-angeles' },
      { el: 'time-paris', timeZone: 'Europe/Paris', dateDiffEl: 'date-diff-paris' },
      { el: 'time-london', timeZone: 'Europe/London', dateDiffEl: 'date-diff-london' },
      { el: 'time-tokyo', timeZone: 'Asia/Tokyo', dateDiffEl: 'date-diff-tokyo' },
    ];
  
    timeZones.forEach((item) => {
      const currentTime = new Date().toLocaleString('en-US', { timeZone: item.timeZone });
      const currentDate = new Date(currentTime).getDate();
      
      const timeString = new Date(currentTime).toLocaleTimeString('zh-CN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
  
      const dateDiff = currentDate - baseDate; // 计算日期差
      let dateDiffDisplay = ''; // 用于显示的日期差
      if (dateDiff === 1) {
        dateDiffDisplay = '+1';
      } else if (dateDiff === -1) {
        dateDiffDisplay = '-1';
      }
      
      document.getElementById(item.el).textContent = timeString;
      document.getElementById(item.dateDiffEl).textContent = dateDiffDisplay;
    });
  }

document.addEventListener('DOMContentLoaded', function() {
    updateTimes();
    setInterval(updateTimes, 60000);
  });

// 点击歌名复制歌名到剪贴板
document.getElementById('songList').addEventListener('click', function(event) {
    if (event.target && event.target.nodeName === 'TD' && event.target.parentElement.querySelector('td:nth-child(1)')) {
        const songName = event.target.parentElement.querySelector('td:nth-child(1)').textContent;
        navigator.clipboard.writeText(songName).then(() => {
            const copyNotification = document.getElementById('copyNotification');
            copyNotification.style.display = 'block';
            setTimeout(() => {
                copyNotification.style.display = 'none';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }
});

// 随机歌曲
document.getElementById('randomPick').addEventListener('click', function() {
    if (songs.length === 0) {
        document.getElementById('randomResult').innerText = "歌曲列表为空555";
        return;
    }

    const randomSong = songs[Math.floor(Math.random() * songs.length)];

    // Highlight the song in the table
    let found = false;
    document.querySelectorAll('#songList tr').forEach(row => {
        const songName = row.querySelector('td:nth-child(1)').textContent;
        const singerName = row.querySelector('td:nth-child(2)').textContent;
        const language = row.querySelector('td:nth-child(3)').textContent;

        if (songName === randomSong.songName && singerName === randomSong.singerName && language === randomSong.language) {
            row.classList.add('highlighted-row');
            if (!found) {
                setTimeout(() => {
                    row.scrollIntoView({ block: 'center', behavior: 'smooth' });
                }, 100); // Small delay to ensure the scroll action is triggered
                found = true;
            }
        } else {
            row.classList.remove('highlighted-row');
        }
    });

    document.getElementById('randomResult').innerText = `${randomSong.songName} - ${randomSong.singerName}`;
});
