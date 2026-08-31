// Check-in System - REAL Working

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    currentUser = Storage.getUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    loadCheckIns();
});

function loadCheckIns() {
    const container = document.getElementById('checkinList');
    const checkins = Storage.getCheckIns();
    const userCheckins = checkins.filter(c => c.userEmail === currentUser.email);
    
    if (userCheckins.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:40px;color:#999;">
                <i class="fas fa-map-pin" style="font-size:48px;display:block;margin-bottom:12px;color:#FF5A5F;"></i>
                <p>No check-ins yet.</p>
                <p style="font-size:14px;margin-top:4px;">Check-in to share where you are!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = userCheckins.map(c => `
        <div class="checkin-card">
            <div style="display:flex;align-items:center;gap:12px;">
                <div style="background:#FF5A5F;border-radius:50%;width:48px;height:48px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px;">
                    <i class="fas fa-map-pin"></i>
                </div>
                <div>
                    <div style="font-weight:bold;font-size:16px;">${c.location}</div>
                    <div style="color:#999;font-size:13px;">${timeAgo(c.time)}</div>
                </div>
            </div>
            ${c.notes ? `<div style="margin-top:8px;color:#666;font-size:14px;">${c.notes}</div>` : ''}
            <div style="margin-top:8px;display:flex;gap:12px;font-size:12px;color:#999;">
                <span>${c.weather || '🌤️'}</span>
                <span>👤 ${c.with ? 'With: ' + c.with : 'Solo'}</span>
            </div>
        </div>
    `).join('');
}

function checkIn(event) {
    event.preventDefault();
    
    const location = document.getElementById('checkinLocation').value;
    const notes = document.getElementById('checkinNotes').value;
    const withPeople = document.getElementById('checkinWith').value;
    
    if (!location) {
        alert('Please enter a location.');
        return;
    }
    
    // Get weather (simulated)
    const weather = ['☀️ Sunny', '⛅ Cloudy', '🌧️ Rainy', '🌤️ Partly Cloudy'][Math.floor(Math.random() * 4)];
    
    Storage.addCheckIn({
        userEmail: currentUser.email,
        location: location,
        notes: notes,
        with: withPeople || 'Solo',
        weather: weather,
        time: new Date().toISOString()
    });
    
    // Check for badge
    BadgeSystem.checkAndUnlock(currentUser.email);
    
    alert(`✅ Checked in at ${location}!`);
    document.getElementById('checkinForm').reset();
    loadCheckIns();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                document.getElementById('checkinLocation').value = `📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                alert('📍 Location detected!');
            },
            function(error) {
                alert('⚠️ Please enter your location manually.');
            }
        );
    } else {
        alert('⚠️ Geolocation is not supported by your browser.');
    }
}
