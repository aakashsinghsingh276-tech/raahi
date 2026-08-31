// Explore Logic - REAL Working Explore

let allPosts = [];

document.addEventListener('DOMContentLoaded', () => {
    const user = Storage.getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    loadExplore();
});

function loadExplore(filter = 'all', search = '') {
    const grid = document.getElementById('exploreGrid');
    allPosts = Storage.getPosts();
    const users = Storage.getUsers();

    let filtered = [...allPosts];

    if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(p => {
            const user = users[p.userEmail];
            const caption = (p.caption || '').toLowerCase();
            const hashtags = (p.hashtags || '').toLowerCase();
            const name = (user?.name || '').toLowerCase();
            return caption.includes(s) || hashtags.includes(s) || name.includes(s);
        });
    }

    if (filter === 'popular') {
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (filter === 'recent') {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:40px; color:#999;">
                <i class="fas fa-search" style="font-size:48px; display:block; margin-bottom:12px;"></i>
                <p>No posts found.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(post => {
        const user = users[post.userEmail] || { name: 'User', avatar: 'https://i.pravatar.cc/150?img=1' };
        return `
            <div class="explore-item" onclick="window.location.href='feed.html'">
                <img src="${post.image}" alt="${post.caption || 'Travel post'}">
                <div class="overlay">
                    <span><i class="fas fa-heart"></i> ${post.likes || 0}</span>
                    <span><i class="fas fa-comment"></i> ${post.comments?.length || 0}</span>
                </div>
            </div>
        `;
    }).join('');
}

function filterContent(value) {
    const activeTab = document.querySelector('.category-tab.active');
    const filter = activeTab ? activeTab.textContent.toLowerCase() : 'all';
    if (filter === 'all' || filter.includes('all')) loadExplore('all', value);
    else if (filter.includes('popular')) loadExplore('popular', value);
    else if (filter.includes('recent')) loadExplore('recent', value);
}

function filterCategory(category) {
    document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.category-tab[onclick*="${category}"]`).classList.add('active');
    const search = document.getElementById('searchInput').value;
    loadExplore(category, search);
          }
