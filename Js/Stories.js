// Stories Logic - REAL Working Stories

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    currentUser = Storage.getUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    loadStories();
});

function loadStories() {
    const container = document.getElementById('storiesContainer');
    const stories = Storage.getStories();
    const users = Storage.getUsers();

    if (stories.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:40px;color:#999;">
                <i class="fas fa-play-circle" style="font-size:48px;display:block;margin-bottom:12px;"></i>
                <p>No stories yet.</p>
                <button onclick="addStory()" style="margin-top:12px;padding:10px 24px;background:#FF5A5F;color:#fff;border:none;border-radius:20px;cursor:pointer;">Add Story</button>
            </div>
        `;
        return;
    }

    container.innerHTML = stories.map(story => {
        const user = users[story.userEmail] || { name: story.userEmail.split('@')[0], avatar: 'https://i.pravatar.cc/150?img=1' };
        return `
            <div class="story-card" onclick="viewStory('${story.id}')">
                <img src="${story.image}" alt="${user.name}'s story">
                <div class="story-overlay">
                    <img src="${user.avatar || 'https://i.pravatar.cc/150?img=1'}" alt="${user.name}" class="story-user-avatar">
                    <span class="story-user-name">${user.name}</span>
                    <span class="story-time">${timeAgo(story.createdAt)}</span>
                </div>
            </div>
        `;
    }).join('');
}

function addStory() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                Storage.addStory({
                    userEmail: currentUser.email,
                    image: event.target.result
                });
                loadStories();
                alert('✅ Story uploaded! It will expire in 24 hours.');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function viewStory(storyId) {
    const stories = Storage.getStories();
    const story = stories.find(s => s.id === storyId);
    if (story) {
        alert(`📸 Viewing story\n\nPosted: ${timeAgo(story.createdAt)}`);
    }
}

setInterval(() => {
    const stories = Storage.getStories();
    const now = new Date();
    const filtered = stories.filter(s => new Date(s.expiresAt) > now);
    if (filtered.length !== stories.length) {
        Storage.set('raahi_stories', filtered);
        loadStories();
    }
}, 60000);
