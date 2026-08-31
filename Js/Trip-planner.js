// Trip Planner - REAL Working

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    currentUser = Storage.getUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    loadTrips();
});

function saveTrip(event) {
    event.preventDefault();
    
    const destination = document.getElementById('tripDestination').value;
    const start = document.getElementById('tripStart').value;
    const end = document.getElementById('tripEnd').value;
    const budget = document.getElementById('tripBudget').value;
    const notes = document.getElementById('tripNotes').value;
    
    Storage.addTrip({
        userEmail: currentUser.email,
        destination: destination,
        start: start,
        end: end,
        budget: budget,
        notes: notes
    });
    
    alert('✅ Trip saved!');
    document.getElementById('tripForm').reset();
    loadTrips();
}

function loadTrips() {
    const container = document.getElementById('savedTrips');
    const trips = Storage.getTrips();
    const userTrips = trips.filter(t => t.userEmail === currentUser.email);
    
    if (userTrips.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:20px;color:#999;">
                <p>No saved trips yet. Plan your next adventure!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = userTrips.map(t => `
        <div class="trip-card">
            <div class="trip-destination">✈️ ${t.destination}</div>
            <div class="trip-dates">📅 ${formatDate(t.start)} - ${formatDate(t.end)}</div>
            <div class="trip-budget">💰 ₹${t.budget}</div>
            ${t.notes ? `<p style="font-size:13px;color:#999;margin-top:4px;">${t.notes}</p>` : ''}
            <button onclick="deleteTrip('${t.id}')" style="margin-top:8px;background:#dc3545;color:#fff;border:none;padding:4px 12px;border-radius:12px;cursor:pointer;font-size:12px;">
                Delete
            </button>
        </div>
    `).join('');
}

function deleteTrip(tripId) {
    if (confirm('Delete this trip?')) {
        Storage.deleteTrip(tripId);
        loadTrips();
    }
}
