// Feed Logic - REAL Working Feed

let currentUser = null;
let allPosts = [];

document.addEventListener('DOMContentLoaded', () => {
    currentUser = Storage.getUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    initDemoData();
    loadStories();
    loadPosts();
    updateNotificationBadge();
});

function initDemoData() {
    const users = Storage.getUsers();
    const posts = Storage.getPosts();

    if (Object.keys(users).length < 2) {
        const demoUsers = [
            { email: 'sarah@raahi.com', name: 'Sarah Mary', username: 'sarah_travels', avatar: 'https://i.pravatar.cc/150?img=1' },
            { email: 'marko@raahi.com', name: 'Marko Kovač', username: 'marko_adventures', avatar: 'https://i.pravatar.cc/150?img=2' },
            { email: 'luka@raahi.com', name: 'Luka Babić', username: 'luka_explorer', avatar: 'https://i.pravatar.cc/150?img=3' }
        ];
        demoUsers.forEach(u => {
            if (!users[u.email]) {
                users[u.email] = {
                    name: u.name,
                    username: u.username,
                    password: 'demo123',
                    avatar: u.avatar,
                    joined: new Date().toISOString(),
                    followers: ['demo@raahi.com'],
                    following: ['demo@raahi.com'],
                    travelStyles: ['solo', 'adventure']
                };
            }
        });
        if (!users['demo@raahi.com']) {
            users['demo@raahi.com'] = {
                name: 'Alex Morgan',
                username: 'alex_morgan',
                password: 'demo123',
                avatar: 'https://i.pravatar.cc/150?img=7',
                joined: new Date().toISOString(),
                followers: ['sarah@raahi.com', 'marko@raahi.com'],
                following: ['sarah@raahi.com', 'marko@raahi.com', 'luka@raahi.com'],
                travelStyles: ['solo', 'couple']
            };
        }
        Storage.set('raahi_users', users);
    }

    if (posts.length === 0) {
        const images = [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400',
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400',
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400'
        ];
        const captions = [
            'Can\'t wait for my holiday to Bali! 🌴 #travel #bali',
            'The weather is so nice today! 🏖️ #beach #summer',
            'Best beach day ever! 🏄‍♂️ #beach #friends'
        ];
        const userEmails = Object.keys(users);
        
        images.forEach((img, i) => {
            const post = {
                userEmail: userEmails[i % userEmails.length],
                image: img,
                caption: captions[i % captions.length],
                hashtags: '#' + captions[i % captions.length].split(' ').filter(w => w.startsWith('#')).join(' '),
                likes: Math.floor(Math.random() * 50) + 10,
                comments: [
                    { user: userEmails[(i+1) % userEmails.length], name: users[userEmails[(i+1) % userEmails.length]].name, text: 'Amazing! 😍' },
                    { user: userEmails[(i+2) % userEmails.length], name: users[userEmails[(i+2) % userEmails.length]].name, text: 'Where is this?' }
                ]
            };
            Storage.addPost(post);
        });
    }
}

function loadStories() {
    const container = document.getElementById('storiesRow');
    if (!container) return;

    const users = Storage.getUsers();
    const user = Storage.getUser();
    
    let html = `
        <div class="story-item" onclick="window.location.href='stories.html'">
            <div class="story-avatar" style="border-color:#FF5A5F; position:relative;">
                <img src="${user.avatar || 'https://i.pravatar.cc/150?img=7'}" alt="Your Story">
                <div style="position:absolute; bottom:-2px; right:-2px; background:#FF5A5F; color:#fff; border-radius:50%; width:20px; height:20px; display:flex; align-items:center; justify-content:center; font-size:12px; border:2px solid #fff;">+</div>
            </div>
            <span class="story-name">Your Story</span>
        </div>
    `;

    Object.keys(users).slice(0, 8).forEach(email => {
        if (email !== user.email) {
            const u = users[email];
            html += `
                <div class="story-item" onclick="viewStory('${email}')">
                    <div class="story-avatar">
                        <img src="${u.avatar || 'https://i.pravatar.cc/150?img=1'}" alt="${u.name}">
                    </div>
                    <span class="story-name">${u.name.split(' ')[0]}</span>
                </div>
            `;
        }
    });

    container.innerHTML = html;
}

function viewStory(email) {
    window.location.href = 'stories.html';
}

function loadPosts() {
    allPosts = Storage.getPosts();
    const container = document.getElementById('feedPosts');
    if (!container) return;

    if (allPosts.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:40px;color:#999;">
                <i class="fas fa-camera" style="font-size:48px;display:block;margin-bottom:12px;"></i>
                <p>No posts yet. Be the first to share!</p>
                <button onclick="window.location.href='upload.html'" style="margin-top:12px;padding:10px 24px;background:#FF5A5F;color:#fff;border:none;border-radius:20px;cursor:pointer;">Upload Now</button>
            </div>
        `;
        return;
    }

    container.innerHTML = allPosts.map(post => createPostHTML(post)).join('');

    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = parseInt(this.dataset.postId);
            handleLike(postId);
        });
    });

    document.querySelectorAll('.comment-submit').forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = parseInt(this.dataset.postId);
            const input = document.getElementById(`comment-input-${postId}`);
            if (input && input.value.trim()) {
                handleComment(postId, input.value);
                input.value = '';
            }
        });
    });

    document.querySelectorAll('.comment-input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const postId = parseInt(this.dataset.postId);
                if (this.value.trim()) {
                    handleComment(postId, this.value);
                    this.value = '';
                }
            }
        });
    });

    document.querySelectorAll('.follow-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const email = this.dataset.email;
            handleFollow(email);
        });
    });
}

function createPostHTML(post) {
    const users = Storage.getUsers();
    const user = users[post.userEmail] || { name: post.userEmail.split('@')[0], avatar: 'https://i.pravatar.cc/150?img=1' };
    const currentUser = Storage.getUser();
    const isLiked = post.liked || false;
    const isFollowing = users[currentUser.email]?.following?.includes(post.userEmail) || false;

    return `
        <div class="post-card" data-post-id="${post.id}">
            <div class="post-header">
                <div class="post-avatar">
                    <img src="${user.avatar || 'https://i.pravatar.cc/150?img=1'}" alt="${user.name}">
                </div>
                <span class="post-user">${user.name}</span>
                <span class="post-time">${timeAgo(post.createdAt)}</span>
                <button class="follow-btn" data-email="${post.userEmail}" style="background:none;border:none;color:#FF5A5F;font-weight:600;cursor:pointer;font-size:13px;margin-left:auto;">
                    ${isFollowing ? 'Following' : 'Follow'}
                </button>
            </div>
            
            ${post.image ? `<img src="${post.image}" class="post-image" alt="Travel post">` : ''}
            
            <div class="post-actions">
                <div class="post-actions-left">
                    <button class="post-action-btn like-btn ${isLiked ? 'liked' : ''}" data-post-id="${post.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="post-action-btn" onclick="document.getElementById('comment-input-${post.id}').focus()">
                        <i class="fas fa-comment"></i>
                    </button>
                    <button class="post-action-btn" onclick="sharePost('${post.id}')">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
                <button class="post-action-btn" onclick="savePost('${post.id}')">
                    <i class="fas fa-bookmark"></i>
                </button>
            </div>
            
            <div class="post-likes" id="likes-${post.id}">
                <span class="like-count">${post.likes}</span> likes
            </div>
            
            <div class="post-caption">
                <strong>${user.name}</strong> ${post.caption || ''}
            </div>
            
            ${post.hashtags ? `<div class="post-hashtags">${post.hashtags}</div>` : ''}
            
            ${post.comments && post.comments.length > 0 ? `
                <div class="post-comments" onclick="showAllComments(${post.id})">
                    View all ${post.comments.length} comments
                </div>
                ${post.comments.slice(0, 2).map(c => `
                    <div class="post-comment">
                        <strong>${c.name || c.user}</strong> ${c.text}
                    </div>
                `).join('')}
            ` : ''}
            
            <div style="display:flex; padding:8px 16px; gap:8px;">
                <input type="text" id="comment-input-${post.id}" class="comment-input" data-post-id="${post.id}" placeholder="Add a comment..." style="flex:1; padding:8px 12px; border:1px solid #dbdbdb; border-radius:20px; outline:none; font-size:14px;">
                <button class="comment-submit" data-post-id="${post.id}" style="background:none; border:none; color:#FF5A5F; font-weight:600; cursor:pointer;">Post</button>
            </div>
            
            <div class="post-time-ago">${timeAgo(post.createdAt)}</div>
        </div>
    `;
}

function handleLike(postId) {
    const post = Storage.likePost(postId);
    if (post) {
        const likesEl = document.getElementById(`likes-${postId}`);
        if (likesEl) {
            likesEl.innerHTML = `<span class="like-count">${post.likes}</span> likes`;
        }
        const btn = document.querySelector(`.like-btn[data-post-id="${postId}"]`);
        if (btn) {
            btn.classList.toggle('liked');
            if (post.liked) {
                Storage.addNotification({
                    type: 'like',
                    from: Storage.getUser().email,
                    postId: postId,
                    message: `${Storage.getUser().name} liked your post`
                });
            }
        }
        updateNotificationBadge();
    }
}

function handleComment(postId, text) {
    const user = Storage.getUser();
    const comment = { user: user.email, name: user.name, text: text };
    const post = Storage.addComment(postId, comment);
    if (post) {
        Storage.addNotification({
            type: 'comment',
            from: user.email,
            postId: postId,
            message: `${user.name} commented: "${text}"`
        });
        loadPosts();
        updateNotificationBadge();
    }
}

function handleFollow(email) {
    const users = Storage.followUser(email);
    if (users) {
        const user = Storage.getUser();
        const isFollowing = users[user.email]?.following?.includes(email);
        const btn = document.querySelector(`.follow-btn[data-email="${email}"]`);
        if (btn) {
            btn.textContent = isFollowing ? 'Following' : 'Follow';
        }
        if (isFollowing) {
            Storage.addNotification({
                type: 'follow',
                from: user.email,
                message: `${user.name} started following you`
            });
        }
        updateNotificationBadge();
    }
}

function sharePost(postId) {
    const url = window.location.href;
    if (navigator.share) {
        navigator.share({
            title: 'Check out this post on Raahi!',
            text: 'I found this amazing travel post on Raahi!',
            url: url + '?post=' + postId
        });
    } else {
        navigator.clipboard?.writeText(url + '?post=' + postId);
        alert('🔗 Link copied! Share with your friends.');
    }
}

function savePost(postId) {
    let saved = JSON.parse(localStorage.getItem('raahi_saved') || '[]');
    const index = saved.indexOf(postId);
    if (index === -1) {
        saved.push(postId);
        alert('💾 Post saved!');
    } else {
        saved.splice(index, 1);
        alert('💾 Post unsaved');
    }
    localStorage.setItem('raahi_saved', JSON.stringify(saved));
}

function showAllComments(postId) {
    const post = allPosts.find(p => p.id === postId);
    if (post && post.comments) {
        const comments = post.comments.map(c => 
            `${c.name || c.user}: ${c.text}`
        ).join('\n');
        alert(`📝 All comments:\n\n${comments}`);
    }
}

function updateNotificationBadge() {
    const notifications = Storage.getNotifications();
    const unread = notifications.filter(n => !n.read).length;
    const badge = document.querySelector('.nav-link .badge');
    if (badge) {
        if (unread > 0) {
            badge.textContent = unread;
            badge.style.display = 'inline';
        } else {
            badge.style.display = 'none';
        }
    }
}

setInterval(() => {
    const newPosts = Storage.getPosts();
    if (newPosts.length !== allPosts.length) {
        loadPosts();
    }
}, 10000);
