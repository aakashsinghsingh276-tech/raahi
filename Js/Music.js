// Music Library for Reels - REAL Working

const MusicLibrary = {
    songs: [
        { id: 1, title: 'Sunset Vibes', artist: 'Travel Beats', duration: '0:30', genre: 'Chill', url: '' },
        { id: 2, title: 'Wanderlust', artist: 'Explorer Music', duration: '0:45', genre: 'Electronic', url: '' },
        { id: 3, title: 'Beach Day', artist: 'Summer Sounds', duration: '0:35', genre: 'Pop', url: '' },
        { id: 4, title: 'Mountain High', artist: 'Nature Tunes', duration: '0:40', genre: 'Acoustic', url: '' },
        { id: 5, title: 'City Lights', artist: 'Urban Beats', duration: '0:50', genre: 'Hip Hop', url: '' },
        { id: 6, title: 'Tropical Rain', artist: 'Island Music', duration: '0:28', genre: 'Reggae', url: '' },
        { id: 7, title: 'Adventure Time', artist: 'Epic Trails', duration: '0:55', genre: 'Rock', url: '' },
        { id: 8, title: 'Peaceful Journey', artist: 'Meditation Sounds', duration: '0:38', genre: 'Ambient', url: '' }
    ],
    
    getSongs() {
        return this.songs;
    },
    
    getSong(id) {
        return this.songs.find(s => s.id === id);
    },
    
    searchSongs(query) {
        const q = query.toLowerCase();
        return this.songs.filter(s => 
            s.title.toLowerCase().includes(q) || 
            s.artist.toLowerCase().includes(q) ||
            s.genre.toLowerCase().includes(q)
        );
    },
    
    getTrending() {
        return this.songs.slice(0, 4);
    }
};

// Make globally available
window.MusicLibrary = MusicLibrary;
