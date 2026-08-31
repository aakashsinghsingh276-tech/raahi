// ============================================================
// RAAHI - Reels Logic with Music Support
// Complete Working Reels System
// ============================================================

let currentUser = null;
let selectedMusic = null;

document.addEventListener('DOMContentLoaded', () => {
    currentUser = Storage.getUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    loadReels();
});

// ========== LOAD REELS ==========
function loadReels() {
    const container = document.getElementById('reelsContainer');
    if (!container) return;
    
    const reels = Storage.getReels();
    const users = Storage.getUsers();

    if (reels.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:60px 20px;color:#999;">
                <i class="fas fa-video" style="font-size:64px;display:block;margin-bottom:16px;color:#FF5A5F;"></i>
                <h3 style="margin-bottom:8px;">No Reels Yet</h3>
                <p style="margin-bottom:16px;">Share your travel moments with short videos!</p>
                <button onclick="uploadReel()" style="padding:12px 32px;background:#FF5A5F;color:#fff;border:none;border-radius:25px;cursor:pointer;font-size:16px;font-weight:600;">
                    <i class="fas fa-plus-circle"></i> Upload Reel
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = reels.map(reel => {
        const user = users[reel.userEmail] || { 
            name: reel.userEmail?.split('@')[0] || 'User', 
            avatar: 'https://i.pravatar.cc/150?img=1' 
        };
        
        // Get music from user's library
        const userLibrary = Storage.getUserMusicLibrary(reel.userEmail);
        const music = userLibrary.find(s => s.id === reel.musicId);
        
        return `
            <div class="reel-card" data-reel-id="${reel.id}">
                ${reel.video ? `
                    <video src="${reel.video}" class="reel-video" loop muted playsinline autoplay></video>
                ` : `
                    <img src="${reel.thumbnail || 'https://via.placeholder.com/400x600/FF5A5F/fff?text=🎬+Reel'}" class="reel-video" alt="Reel">
                `}
                
                ${music ? `
                    <div class="reel-music">
                        <i class="fas fa-music"></i> ${music.emoji || '🎵'} ${music.title} - ${music.artist}
                    </div>
                ` : ''}
                
                <div class="reel-overlay">
                    <div class="reel-user">
                        <img src="${user.avatar || 'https://i.pravatar.cc/150?img=1'}" alt="${user.name}" class="reel-avatar">
                        <span class="reel-username">${user.name}</span>
                        ${reel.caption ? `<p class="reel-caption">${reel.caption}</p>` : ''}
                        <div class="reel-time">${timeAgo(reel.createdAt)}</div>
                    </div>
                    
                    <div class="reel-actions">
                        <button class="reel-action-btn" onclick="likeReel('${reel.id}')">
                            <i class="fas fa-heart ${reel.liked ? 'liked' : ''}"></i>
                            <span>${reel.likes || 0}</span>
                        </button>
                        <button class="reel-action-btn" onclick="commentReel('${reel.id}')">
                            <i class="fas fa-comment"></i>
                            <span>${reel.comments?.length || 0}</span>
                        </button>
                        <button class="reel-action-btn" onclick="shareReel('${reel.id}')">
                            <i class="fas fa-share"></i>
                        </button>
                        <button class="reel-action-btn" onclick="saveReel('${reel.id}')">
                            <i class="fas fa-bookmark"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Setup reel interaction
    setupReelInteractions();
    
    // Setup video autoplay
    document.querySelectorAll('.reel-video').forEach(video => {
        video.addEventListener('click', function() {
            if (this.paused) {
                this.play();
            } else {
                this.pause();
            }
        });
    });
}

// ========== SETUP REEL INTERACTIONS ==========
function setupReelInteractions() {
    // Double tap to like
    document.querySelectorAll('.reel-card').forEach(card => {
        let lastTap = 0;
        card.addEventListener('click', function(e) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 300 && tapLength > 0) {
                // Double tap detected
                const reelId = this.dataset.reelId;
                if (reelId) {
                    likeReel(reelId);
                    // Show heart animation
                    showHeartAnimation(this);
                }
            }
            lastTap = currentTime;
        });
    });
}

// ========== HEART ANIMATION ==========
function showHeartAnimation(element) {
    const heart = document.createElement('div');
    heart.className = 'reel-heart-animation';
    heart.innerHTML = '❤️';
    heart.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 80px;
        color: #FF5A5F;
        z-index: 10;
        pointer-events: none;
        animation: heartPop 0.6s ease forwards;
    `;
    element.appendChild(heart);
    setTimeout(() => {
        heart.remove();
    }, 600);
}

// ========== UPLOAD REEL ==========
function uploadReel() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('video/')) {
            const caption = prompt('📝 Add a caption for your reel:') || '';
            showMusicSelection(file, caption);
        } else {
            alert('⚠️ Please select a video file.');
        }
    };
    input.click();
}

// ========== SHOW MUSIC SELECTION ==========
function showMusicSelection(file, caption) {
    const songs = Storage.getUserMusicLibrary(currentUser.email);
    let musicOptions = '🎵 Select music for your reel:\n\n';
    
    if (songs.length === 0) {
        musicOptions = '⚠️ Your music library is empty!\n\nGo to Music Library to add songs.\n\n0. No music';
    } else {
        songs.forEach((s, i) => {
            musicOptions += `${i+1}. ${s.emoji || '🎵'} ${s.title} - ${s.artist} (${s.genre})\n`;
        });
        musicOptions += '\n0. No music';
    }
    musicOptions += '\n\n💡 Tip: Go to Profile → Music Library to add more songs!';
    
    const choice = prompt(musicOptions);
    if (choice === null) return;
    
    const musicId = parseInt(choice);
    let selectedMusicId = null;
    if (musicId > 0 && musicId <= songs.length) {
        selectedMusicId = songs[musicId - 1].id;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
        // Create thumbnail from video
        const video = document.createElement('video');
        video.src = event.target.result;
        video.onloadeddata = function() {
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 600;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, 400, 600);
            const thumbnail = canvas.toDataURL('image/jpeg');
            
            Storage.addReel({
                userEmail: currentUser.email,
                video: event.target.result,
                thumbnail: thumbnail,
                caption: caption,
                musicId: selectedMusicId
            });
            
            alert('✅ Reel uploaded successfully!');
            loadReels();
        };
    };
    reader.readAsDataURL(file);
}

// ========== LIKE REEL ==========
function likeReel(reelId) {
    const reel = Storage.likeReel(reelId);
    if (reel) {
        // Update UI
        const card = document.querySelector(`.reel-card[data-reel-id="${reelId}"]`);
        if (card) {
            const likeBtn = card.querySelector('.reel-action-btn:first-child i');
            const likeCount = card.querySelector('.reel-action-btn:first-child span');
            if (likeBtn) {
                likeBtn.classList.toggle('liked');
            }
            if (likeCount) {
                likeCount.textContent = reel.likes || 0;
            }
        }
        
        // Send notification
        const post = Storage.getReels().find(r => r.id === reelId);
        if (post && post.userEmail !== currentUser.email) {
            Storage.addNotification({
                type: 'like',
                from: currentUser.email,
                postId: reelId,
                message: `${currentUser.name} liked your reel`
            });
        }
        
        // Check for badges
        Storage.checkBadges(currentUser.email);
    }
}

// ========== COMMENT ON REEL ==========
function commentReel(reelId) {
    const comment = prompt('💬 Write a comment:');
    if (comment && comment.trim()) {
        const reels = Storage.getReels();
        const reel = reels.find(r => r.id === reelId);
        if (reel) {
            if (!reel.comments) reel.comments = [];
            reel.comments.push({
                id: Date.now(),
                user: currentUser.email,
                name: currentUser.name,
                text: comment.trim(),
                time: new Date().toISOString()
            });
            Storage.set('raahi_reels', reels);
            
            // Update UI
            loadReels();
            
            // Send notification
            if (reel.userEmail !== currentUser.email) {
                Storage.addNotification({
                    type: 'comment',
                    from: currentUser.email,
                    postId: reelId,
                    message: `${currentUser.name} commented on your reel: "${comment}"`
                });
            }
            
            // Check for badges
            Storage.checkBadges(currentUser.email);
        }
    }
}

// ========== SHARE REEL ==========
function shareReel(reelId) {
    const url = window.location.href + '?reel=' + reelId;
    if (navigator.share) {
        navigator.share({
            title: '🎬 Check out this reel on Raahi!',
            text: 'I found this amazing travel reel!',
            url: url
        }).catch(() => {});
    } else {
        navigator.clipboard?.writeText(url).then(() => {
            alert('🔗 Link copied to clipboard!');
        }).catch(() => {
            alert('🔗 Share this link: ' + url);
        });
    }
}

// ========== SAVE REEL ==========
function saveReel(reelId) {
    const saved = Storage.get('raahi_saved_reels', []);
    const index = saved.indexOf(reelId);
    if (index === -1) {
        saved.push(reelId);
        Storage.set('raahi_saved_reels', saved);
        alert('💾 Reel saved to your collection!');
    } else {
        saved.splice(index, 1);
        Storage.set('raahi_saved_reels', saved);
        alert('💾 Reel removed from saved');
    }
}

// ========== DELETE REEL ==========
function deleteReel(reelId) {
    if (confirm('⚠️ Are you sure you want to delete this reel?')) {
        Storage.deleteReel(reelId);
        loadReels();
        alert('🗑️ Reel deleted!');
    }
}

// ========== ADD REEL CSS ANIMATIONS ==========
function addReelStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes heartPop {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            50% { transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
            100% { transform: translate(-50%, -70%) scale(1); opacity: 0; }
        }
        
        .reel-heart-animation {
            animation: heartPop 0.6s ease forwards;
        }
        
        .reel-card {
            position: relative;
            margin-bottom: 20px;
            border-radius: 12px;
            overflow: hidden;
            background: #1a1a1a;
        }
        
        .reel-video {
            width: 100%;
            max-height: 70vh;
            object-fit: cover;
            display: block;
        }
        
        .reel-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 60px 16px 20px;
            background: linear-gradient(transparent, rgba(0,0,0,0.7));
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        
        .reel-user {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        
        .reel-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid #fff;
            object-fit: cover;
        }
        
        .reel-username {
            color: #fff;
            font-weight: 600;
            font-size: 15px;
        }
        
        .reel-caption {
            color: #ddd;
            font-size: 13px;
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        .reel-time {
            color: rgba(255,255,255,0.6);
            font-size: 11px;
        }
        
        .reel-actions {
            display: flex;
            flex-direction: column;
            gap: 16px;
            align-items: center;
        }
        
        .reel-action-btn {
            background: none;
            border: none;
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s;
        }
        
        .reel-action-btn i {
            font-size: 28px;
            transition: all 0.3s;
        }
        
        .reel-action-btn i:hover {
            transform: scale(1.1);
        }
        
        .reel-action-btn i.liked {
            color: #FF5A5F;
        }
        
        .reel-action-btn span {
            font-size: 12px;
            color: rgba(255,255,255,0.8);
        }
        
        .reel-music {
            position: absolute;
            top: 16px;
            left: 16px;
            background: rgba(0,0,0,0.6);
            color: #fff;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 6px;
            backdrop-filter: blur(4px);
            z-index: 5;
        }
        
        .reel-music i {
            color: #FF5A5F;
        }
    `;
    document.head.appendChild(style);
}

// Call once on load
addReelStyles();

// ========== AUTO-PLAY NEXT REEL ON SCROLL ==========
let currentReelIndex = 0;
let reelsList = [];

function setupReelScroll() {
    const container = document.getElementById('reelsContainer');
    if (!container) return;
    
    reelsList = container.querySelectorAll('.reel-card');
    if (reelsList.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target.querySelector('.reel-video');
                if (video && video.tagName === 'VIDEO') {
                    video.play();
                }
            } else {
                const video = entry.target.querySelector('.reel-video');
                if (video && video.tagName === 'VIDEO') {
                    video.pause();
                }
            }
        });
    }, { threshold: 0.6 });
    
    reelsList.forEach(card => observer.observe(card));
}

// Call after loading reels
setTimeout(setupReelScroll, 500);

// ========== KEYBOARD CONTROLS ==========
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const cards = document.querySelectorAll('.reel-card');
        if (cards.length === 0) return;
        
        let currentIndex = -1;
        cards.forEach((card, i) => {
            const rect = card.getBoundingClientRect();
            if (rect.top >= -100 && rect.top <= 100) {
                currentIndex = i;
            }
        });
        
        if (currentIndex === -1) currentIndex = 0;
        
        let newIndex = currentIndex;
        if (e.key === 'ArrowDown') {
            newIndex = Math.min(currentIndex + 1, cards.length - 1);
        } else if (e.key === 'ArrowUp') {
            newIndex = Math.max(currentIndex - 1, 0);
        }
        
        cards[newIndex].scrollIntoView({ behavior: 'smooth' });
    }
});

// ========== EXPORT FUNCTIONS ==========
window.uploadReel = uploadReel;
window.likeReel = likeReel;
window.commentReel = commentReel;
window.shareReel = shareReel;
window.saveReel = saveReel;
window.deleteReel = deleteReel;
window.loadReels = loadReels;
