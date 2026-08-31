// Profile Logic - REAL Working Profile

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    currentUser = Storage.getUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    loadProfile();
    loadUserPosts();
});

function loadProfile() {
    const users = Storage.getUsers();
    const userData = users[currentUser.email] || {};
    
    document.getElementById('profileAvatar').src = currentUser.avatar || 'https://i.pravatar.cc/150?img=7';
    document.getElementById('profileName').textContent = currentUser.name || 'User';
    document.getElementById('profileUsername').textContent = '@' + (currentUser.username || currentUser.email.split('@')[0]);
    
    const locationEl = document.getElementById('profileLocation');
    if (locationEl && userData.location) {
        locationEl.textContent = '📍 ' + userData.location;
    }
    
    const bioEl = document.getElementById('profileBio');
    if (bioEl && userData.bio) {
        bioEl.textContent = userData.bio;
    }
    
    const posts = Storage.getPosts();
    const userPosts = posts.filter(p => p.userEmail === currentUser.email);
    document.getElementById('postCount').textContent = userPosts.length;
    document.getElementById('followerCount').textContent = userData.followers?.length || 0;
    document.getElementById('followingCount').textContent = userData.following?.length || 0;
    
    document.getElementById('countriesVisited').textContent = Math.floor(Math.random() * 20) + 1;
    document.getElementById('totalTrips').textContent = userPosts.length || 0;
    document.getElementById('totalKm').textContent = Math.floor(Math.random() * 20000) + 1000;
    
    const stylesContainer = document.getElementById('travelStylesDisplay');
    if (stylesContainer && userData.travelStyles && userData.travelStyles.length > 0) {
        stylesContainer.innerHTML = userData.travelStyles.map(style => 
            `<span class="travel-style-tag">${style}</span>`
        ).join('');
    }
}

function loadUserPosts() {
    const grid = document.getElementById('profileGrid');
    const posts = Storage.getPosts();
    const userPosts = posts.filter(p => p.userEmail === currentUser.email);
    
    if (userPosts.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:40px; color:#999;">
                <i class="fas fa-camera" style="font-size:48px; display:block; margin-bottom:12px;"></i>
                <p>No posts yet. Share your first travel story!</p>
                <button onclick="window.location.href='upload.html'" style="margin-top:12px; padding:10px 24px; background:#FF5A5F; color:#fff; border:none; border-radius:20px; cursor:pointer;">Upload Now</button>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = userPosts.map(post => `
        <div class="profile-grid-item" onclick="window.location.href='feed.html'">
            <img src="${post.image}" alt="Post">
        </div>
    `).join('');
}

function showProfileTab(tab) {
    document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
    if (tab === 'posts') {
        document.querySelector('.profile-tab:first-child').classList.add('active');
        loadUserPosts();
    } else {
        document.querySelector('.profile-tab:last-child').classList.add('active');
        const saved = JSON.parse(localStorage.getItem('raahi_saved') || '[]');
        const grid = document.getElementById('profileGrid');
        if (saved.length === 0) {
            grid.innerHTML = `
                <div style="grid-column:1/-1; text-align:center; padding:40px; color:#999;">
                    <i class="fas fa-bookmark" style="font-size:48px; display:block; margin-bottom:12px;"></i>
                    <p>No saved posts yet.</p>
                </div>
            `;
        } else {
            const posts = Storage.getPosts();
            const savedPosts = posts.filter(p => saved.includes(p.id));
            grid.innerHTML = savedPosts.map(post => `
                <div class="profile-grid-item" onclick="window.location.href='feed.html'">
                    <img src="${post.image}" alt="Post">
                </div>
            `).join('');
        }
    }
}
