// Travel Map - Visual Display of Visited Places

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    currentUser = Storage.getUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    loadTravelMap();
});

function loadTravelMap() {
    const container = document.getElementById('travelMapContainer');
    const checkins = Storage.getUserCheckIns(currentUser.email);
    const posts = Storage.getPosts();
    const userPosts = posts.filter(p => p.userEmail === currentUser.email);
    
    // Collect all locations
    const locations = [];
    checkins.forEach(c => {
        if (c.location && !locations.includes(c.location)) {
            locations.push(c.location);
        }
    });
    userPosts.forEach(p => {
        if (p.location && !locations.includes(p.location)) {
            locations.push(p.location);
        }
    });
    
    if (locations.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:60px 20px;color:#999;">
                <i class="fas fa-map-marked-alt" style="font-size:64px;display:block;margin-bottom:16px;color:#FF5A5F;"></i>
                <h3>No Places Visited Yet</h3>
                <p style="margin-top:8px;">Start checking in at places to build your travel map!</p>
                <button onclick="window.location.href='checkin.html'" style="margin-top:16px;padding:10px 24px;background:#FF5A5F;color:#fff;border:none;border-radius:20px;cursor:pointer;">
                    Check-in Now
                </button>
            </div>
        `;
        return;
    }
    
    // Create visual map grid
    let html = `
        <div style="margin-bottom:16px;">
            <h3>🗺️ Your Travel Map</h3>
            <p style="color:#999;font-size:14px;">${locations.length} places visited</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;">
    `;
    
    locations.forEach((location, index) => {
        const colors = ['#FF5A5F', '#FF6B6B', '#FF8E8E', '#FFB3B3', '#FFD9D9', '#FFE5E5'];
        const color = colors[index % colors.length];
        html += `
            <div style="background:${color};padding:16px;border-radius:12px;text-align:center;min-height:100px;display:flex;flex-direction:column;justify-content:center;align-items:center;color:#fff;">
                <i class="fas fa-map-pin" style="font-size:24px;margin-bottom:8px;"></i>
                <span style="font-weight:bold;font-size:14px;">${location}</span>
                <span style="font-size:11px;opacity:0.8;">${getRandomDate()}</span>
            </div>
        `;
    });
    
    html += `</div>`;
    
    // Add travel stats summary
    const stats = Storage.getTravelStats(currentUser.email);
    html += `
        <div style="margin-top:24px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
            <div style="background:#f8f8f8;padding:16px;border-radius:12px;text-align:center;">
                <div style="font-size:24px;font-weight:bold;color:#FF5A5F;">${locations.length}</div>
                <div style="font-size:12px;color:#999;">Places</div>
            </div>
            <div style="background:#f8f8f8;padding:16px;border-radius:12px;text-align:center;">
                <div style="font-size:24px;font-weight:bold;color:#FF5A5F;">${stats.posts}</div>
                <div style="font-size:12px;color:#999;">Posts</div>
            </div>
            <div style="background:#f8f8f8;padding:16px;border-radius:12px;text-align:center;">
                <div style="font-size:24px;font-weight:bold;color:#FF5A5F;">${stats.totalLikes}</div>
                <div style="font-size:12px;color:#999;">Likes</div>
            </div>
            <div style="background:#f8f8f8;padding:16px;border-radius:12px;text-align:center;">
                <div style="font-size:24px;font-weight:bold;color:#FF5A5F;">${stats.checkins}</div>
                <div style="font-size:12px;color:#999;">Check-ins</div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function getRandomDate() {
    const start = new Date(2024, 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
