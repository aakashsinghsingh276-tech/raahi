// Travel Buddy System - REAL Working

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    currentUser = Storage.getUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    loadBuddyRequests();
});

function postBuddyRequest(event) {
    event.preventDefault();
    
    const destination = document.getElementById('buddyDestination').value;
    const date = document.getElementById('buddyDate').value;
    const count = document.getElementById('buddyCount').value;
    const message = document.getElementById('buddyMessage').value;
    
    Storage.addBuddyRequest({
        userEmail: currentUser.email,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        destination: destination,
        date: date,
        count: count,
        message: message
    });
    
    alert('✅ Buddy request posted!');
    document.getElementById('buddyForm').reset();
    loadBuddyRequests();
}

function loadBuddyRequests() {
    const container = document.getElementById('buddyRequests');
    const requests = Storage.getBuddyRequests();
    
    if (requests.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:20px;color:#999;">
                <p>No buddy requests yet. Be the first!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = requests.map(r => `
        <div class="buddy-request-card">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                <img src="${r.userAvatar || 'https://i.pravatar.cc/150?img=1'}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">
                <div>
                    <h4>${r.userName}</h4>
                    <p style="color:#999;font-size:12px;">${r.destination} • ${r.date}</p>
                </div>
            </div>
            <p>👥 ${r.count} people • ${r.message || 'No message'}</p>
            <button onclick="window.location.href='chat.html?user=${r.userEmail}'" style="margin-top:8px;background:#FF5A5F;color:#fff;border:none;padding:6px 16px;border-radius:16px;cursor:pointer;">
                Chat
            </button>
        </div>
    `).join('');
}
