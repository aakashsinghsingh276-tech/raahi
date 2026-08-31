// Music Library Management - Users Can Edit Their Own Music

let currentUser = null;
let editingSongId = null;

document.addEventListener('DOMContentLoaded', () => {
    currentUser = Storage.getUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    loadUserMusicLibrary();
});

// Get user's personal music library
function getUserMusicLibrary() {
    const allLibraries = Storage.get('raahi_music_libraries', {});
    if (!allLibraries[currentUser.email]) {
        allLibraries[currentUser.email] = getDefaultSongs();
        Storage.set('raahi_music_libraries', allLibraries);
    }
    return allLibraries[currentUser.email];
}

// Default songs when user first opens
function getDefaultSongs() {
    return [
        { id: 1, title: 'Sunset Vibes', artist: 'Travel Beats', duration: '0:30', genre: 'Chill', emoji: '🌅' },
        { id: 2, title: 'Wanderlust', artist: 'Explorer Music', duration: '0:45', genre: 'Electronic', emoji: '✈️' },
        { id: 3, title: 'Beach Day', artist: 'Summer Sounds', duration: '0:35', genre: 'Pop', emoji: '🏖️' },
        { id: 4, title: 'Mountain High', artist: 'Nature Tunes', duration: '0:40', genre: 'Acoustic', emoji: '🏔️' },
        { id: 5, title: 'City Lights', artist: 'Urban Beats', duration: '0:50', genre: 'Hip Hop', emoji: '🌃' },
        { id: 6, title: 'Tropical Rain', artist: 'Island Music', duration: '0:28', genre: 'Reggae', emoji: '🌴' },
        { id: 7, title: 'Adventure Time', artist: 'Epic Trails', duration: '0:55', genre: 'Rock', emoji: '🧗' },
        { id: 8, title: 'Peaceful Journey', artist: 'Meditation Sounds', duration: '0:38', genre: 'Ambient', emoji: '🕊️' }
    ];
}

// Save user's music library
function saveUserMusicLibrary(songs) {
    const allLibraries = Storage.get('raahi_music_libraries', {});
    allLibraries[currentUser.email] = songs;
    Storage.set('raahi_music_libraries', allLibraries);
}

// Load and display user's music library
function loadUserMusicLibrary() {
    const container = document.getElementById('musicLibraryContainer');
    const songs = getUserMusicLibrary();
    
    if (songs.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:40px;color:#999;">
                <i class="fas fa-music" style="font-size:48px;display:block;margin-bottom:12px;color:#FF5A5F;"></i>
                <p>Your music library is empty.</p>
                <button onclick="showAddSongForm()" style="margin-top:12px;padding:10px 24px;background:#FF5A5F;color:#fff;border:none;border-radius:20px;cursor:pointer;">
                    <i class="fas fa-plus"></i> Add Song
                </button>
            </div>
        `;
        return;
    }
    
    let html = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h3>🎵 Your Music Library (${songs.length} songs)</h3>
            <button onclick="showAddSongForm()" style="background:#FF5A5F;color:#fff;border:none;padding:8px 16px;border-radius:20px;cursor:pointer;">
                <i class="fas fa-plus"></i> Add Song
            </button>
        </div>
        <div style="display:grid;gap:10px;">
    `;
    
    songs.forEach(song => {
        html += `
            <div class="music-card" style="background:#f8f8f8;padding:14px;border-radius:12px;display:flex;align-items:center;justify-content:space-between;border-left:4px solid #FF5A5F;">
                <div style="display:flex;align-items:center;gap:12px;flex:1;">
                    <div style="font-size:28px;">${song.emoji || '🎵'}</div>
                    <div>
                        <div style="font-weight:bold;font-size:16px;">${song.title}</div>
                        <div style="color:#999;font-size:13px;">${song.artist} • ${song.genre} • ${song.duration}</div>
                    </div>
                </div>
                <div style="display:flex;gap:8px;">
                    <button onclick="editSong(${song.id})" style="background:#4CAF50;color:#fff;border:none;padding:6px 12px;border-radius:16px;cursor:pointer;font-size:12px;">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteSong(${song.id})" style="background:#dc3545;color:#fff;border:none;padding:6px 12px;border-radius:16px;cursor:pointer;font-size:12px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    container.innerHTML = html;
}

// Show add song form
function showAddSongForm() {
    const container = document.getElementById('musicLibraryContainer');
    container.innerHTML = `
        <div style="background:#f8f8f8;padding:20px;border-radius:12px;">
            <h3 style="margin-bottom:12px;color:#FF5A5F;">🎵 Add New Song</h3>
            <form id="addSongForm" onsubmit="addSong(event)">
                <div class="form-group">
                    <i class="fas fa-music"></i>
                    <input type="text" id="songTitle" placeholder="Song Title" required>
                </div>
                <div class="form-group">
                    <i class="fas fa-user"></i>
                    <input type="text" id="songArtist" placeholder="Artist Name" required>
                </div>
                <div class="form-group">
                    <i class="fas fa-tag"></i>
                    <input type="text" id="songGenre" placeholder="Genre (e.g., Pop, Rock, Chill)">
                </div>
                <div class="form-group">
                    <i class="fas fa-clock"></i>
                    <input type="text" id="songDuration" placeholder="Duration (e.g., 0:30)">
                </div>
                <div class="form-group">
                    <i class="fas fa-smile"></i>
                    <input type="text" id="songEmoji" placeholder="Emoji (e.g., 🌅, 🎸, 🌴)">
                </div>
                <div style="display:flex;gap:10px;">
                    <button type="submit" class="btn-primary" style="flex:1;">
                        <i class="fas fa-save"></i> Save Song
                    </button>
                    <button type="button" onclick="loadUserMusicLibrary()" style="flex:1;background:#999;color:#fff;border:none;border-radius:8px;padding:12px;cursor:pointer;">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
}

// Add new song
function addSong(event) {
    event.preventDefault();
    
    const title = document.getElementById('songTitle').value;
    const artist = document.getElementById('songArtist').value;
    const genre = document.getElementById('songGenre').value || 'Unknown';
    const duration = document.getElementById('songDuration').value || '0:30';
    const emoji = document.getElementById('songEmoji').value || '🎵';
    
    const songs = getUserMusicLibrary();
    const newSong = {
        id: Date.now(),
        title: title,
        artist: artist,
        genre: genre,
        duration: duration,
        emoji: emoji
    };
    
    songs.push(newSong);
    saveUserMusicLibrary(songs);
    
    alert('✅ Song added to your library!');
    loadUserMusicLibrary();
}

// Edit song
function editSong(songId) {
    const songs = getUserMusicLibrary();
    const song = songs.find(s => s.id === songId);
    if (!song) return;
    
    editingSongId = songId;
    
    const container = document.getElementById('musicLibraryContainer');
    container.innerHTML = `
        <div style="background:#f8f8f8;padding:20px;border-radius:12px;">
            <h3 style="margin-bottom:12px;color:#FF5A5F;">✏️ Edit Song</h3>
            <form id="editSongForm" onsubmit="updateSong(event)">
                <div class="form-group">
                    <i class="fas fa-music"></i>
                    <input type="text" id="editSongTitle" value="${song.title}" required>
                </div>
                <div class="form-group">
                    <i class="fas fa-user"></i>
                    <input type="text" id="editSongArtist" value="${song.artist}" required>
                </div>
                <div class="form-group">
                    <i class="fas fa-tag"></i>
                    <input type="text" id="editSongGenre" value="${song.genre}">
                </div>
                <div class="form-group">
                    <i class="fas fa-clock"></i>
                    <input type="text" id="editSongDuration" value="${song.duration}">
                </div>
                <div class="form-group">
                    <i class="fas fa-smile"></i>
                    <input type="text" id="editSongEmoji" value="${song.emoji || '🎵'}">
                </div>
                <div style="display:flex;gap:10px;">
                    <button type="submit" class="btn-primary" style="flex:1;">
                        <i class="fas fa-save"></i> Update Song
                    </button>
                    <button type="button" onclick="loadUserMusicLibrary()" style="flex:1;background:#999;color:#fff;border:none;border-radius:8px;padding:12px;cursor:pointer;">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
}

// Update song
function updateSong(event) {
    event.preventDefault();
    
    const title = document.getElementById('editSongTitle').value;
    const artist = document.getElementById('editSongArtist').value;
    const genre = document.getElementById('editSongGenre').value || 'Unknown';
    const duration = document.getElementById('editSongDuration').value || '0:30';
    const emoji = document.getElementById('editSongEmoji').value || '🎵';
    
    const songs = getUserMusicLibrary();
    const index = songs.findIndex(s => s.id === editingSongId);
    
    if (index !== -1) {
        songs[index] = {
            ...songs[index],
            title: title,
            artist: artist,
            genre: genre,
            duration: duration,
            emoji: emoji
        };
        saveUserMusicLibrary(songs);
        alert('✅ Song updated successfully!');
        loadUserMusicLibrary();
    }
}

// Delete song
function deleteSong(songId) {
    if (!confirm('Are you sure you want to delete this song?')) return;
    
    const songs = getUserMusicLibrary();
    const filtered = songs.filter(s => s.id !== songId);
    saveUserMusicLibrary(filtered);
    
    alert('🗑️ Song deleted!');
    loadUserMusicLibrary();
}

// Get songs for reel upload (called from reels.js)
function getSongsForReel() {
    return getUserMusicLibrary();
}

// Make functions globally available
window.getUserMusicLibrary = getUserMusicLibrary;
window.saveUserMusicLibrary = saveUserMusicLibrary;
window.loadUserMusicLibrary = loadUserMusicLibrary;
window.showAddSongForm = showAddSongForm;
window.addSong = addSong;
window.editSong = editSong;
window.updateSong = updateSong;
window.deleteSong = deleteSong;
window.getSongsForReel = getSongsForReel;
