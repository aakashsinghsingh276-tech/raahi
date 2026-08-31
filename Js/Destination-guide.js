// Destination Guide - REAL Working

const destinations = [
    { name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&h=200', rating: 4.9, price: '$$', bestTime: 'April-October' },
    { name: 'Paris, France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&h=200', rating: 4.8, price: '$$$', bestTime: 'April-June' },
    { name: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&h=200', rating: 4.9, price: '$$$', bestTime: 'May-September' },
    { name: 'Kyoto, Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&h=200', rating: 4.7, price: '$$', bestTime: 'March-May' },
    { name: 'Machu Picchu, Peru', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=300&h=200', rating: 4.8, price: '$$', bestTime: 'May-September' },
    { name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&h=200', rating: 4.6, price: '$$$', bestTime: 'November-March' },
    { name: 'Rome, Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&h=200', rating: 4.8, price: '$$', bestTime: 'April-June' },
    { name: 'Bangkok, Thailand', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=300&h=200', rating: 4.5, price: '$', bestTime: 'November-February' }
];

document.addEventListener('DOMContentLoaded', () => {
    const user = Storage.getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    renderDestinations(destinations);
});

function renderDestinations(dests) {
    const container = document.getElementById('destinationGrid');
    container.innerHTML = dests.map(d => `
        <div class="destination-card" onclick="showDestination('${d.name}')">
            <img src="${d.image}" alt="${d.name}">
            <div class="info">
                <h4>${d.name}</h4>
                <p>⭐ ${d.rating} • ${d.price}</p>
                <p style="font-size:12px;">Best: ${d.bestTime}</p>
            </div>
        </div>
    `).join('');
}

function searchDestinations(value) {
    const s = value.toLowerCase();
    const filtered = destinations.filter(d => 
        d.name.toLowerCase().includes(s) ||
        d.bestTime.toLowerCase().includes(s)
    );
    renderDestinations(filtered);
}

function showDestination(name) {
    alert(`🗺️ ${name}\n\nCheck out travel tips and guides for this destination!`);
}
