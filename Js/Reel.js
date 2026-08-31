// Reels Logic - REAL Working Reels

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    currentUser = Storage.getUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    loadReels();
});

function loadReels() {
    const container = document.getElementById('reelsContainer');
    const reels = Storage.getReels();
    const users = Storage.getUsers();

    if (reels.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:40px;color:#999;">
                <i class="fas fa-video" style="font-size:48px;display:block;margin-bottom:12px;"></i>
                <p>No reels yet.</p>
                <button onclick="uploadReel()" style="margin-top:12px;padding:10px 24px;background:#FF5A5F;color:#fff;border:none;border-radius:20px;cursor:pointer;">Upload Reel</button>
            </div>
        `;
        return;
    }

    container.innerHTML = reels.map(reel => {
        const user = users[reel.userEmail] || { name: reel.userEmail.split('@')[0], avatar: 'https://i.pravatar.cc/150?img=1' };
        return `
            <div class="reel-card">
                <img src="${reel.thumbnail || reel.image || 'https://via.placeholder.com/400x600/FF5A5F/fff?text=Reel'}" alt="Reel">
                <div class="reel-overlay">
                    <div class="reel-user">
                        <img src="${user.avatar || 'https://i.pravatar.cc/150?img=1'}" alt="${user.name}" class="reel-avatar">
                        <span>${user.name}</span>
                    </div>
                    <div class="reel-actions">
                        <button onclick="likeReel('${reel.id}')"><i class="fas fa-heart"></i> ${reel.likes || 0}</button>
                        <button onclick="window.location.href='chat.html'"><i class="fas fa-comment"></i></button>
                        <button onclick="shareReel('${reel.id}')"><i class="fas fa-share"></i></button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function uploadReel() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('video/')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                Storage.addReel({
                    userEmail: currentUser.email,
                    video: event.target.result,
                    thumbnail: null,
                    caption: prompt('Add a caption for your reel:') || ''
                });
                loadReels();
                alert('✅ Reel uploaded successfully!');
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a video file.');
        }
    };
    input.click();
}

function likeReel(reelId) {
    const reel = Storage.likeReel(reelId);
    if (reel) {
        loadReels();
    }
}

function shareReel(reelId) {
    const url = window.location.href;
    if (navigator.share) {
        navigator.share({
            title: 'Check out this reel on Raahi!',
            text: 'I found this amazing travel reel!',
            url: url
        });
    } else {
        navigator.clipboard?.writeText(url);
        alert('🔗 Link copied!');
    }
}
