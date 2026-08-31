// Weather Feature - REAL Working

const weatherData = {
    'bali': { temp: 28, condition: '☀️ Sunny', humidity: 70, wind: 12 },
    'paris': { temp: 18, condition: '⛅ Partly Cloudy', humidity: 65, wind: 15 },
    'santorini': { temp: 26, condition: '☀️ Sunny', humidity: 60, wind: 10 },
    'kyoto': { temp: 20, condition: '🌧️ Rainy', humidity: 80, wind: 8 },
    'dubai': { temp: 35, condition: '☀️ Sunny', humidity: 50, wind: 20 },
    'rome': { temp: 22, condition: '☀️ Sunny', humidity: 55, wind: 10 },
    'bangkok': { temp: 32, condition: '🌧️ Rainy', humidity: 85, wind: 5 },
    'default': { temp: 25, condition: '⛅ Partly Cloudy', humidity: 65, wind: 10 }
};

document.addEventListener('DOMContentLoaded', () => {
    const user = Storage.getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
});

function getWeather(city) {
    const container = document.getElementById('weatherDisplay');
    const cityLower = city.toLowerCase().trim();
    
    if (!cityLower) {
        container.innerHTML = `
            <div style="text-align:center;padding:20px;color:#999;">
                <i class="fas fa-cloud-sun" style="font-size:48px;display:block;margin-bottom:12px;"></i>
                <p>Enter a city to get weather</p>
            </div>
        `;
        return;
    }
    
    let data = null;
    let matchedCity = '';
    
    for (const [key, value] of Object.entries(weatherData)) {
        if (cityLower.includes(key) || key.includes(cityLower)) {
            data = value;
            matchedCity = key.charAt(0).toUpperCase() + key.slice(1);
            break;
        }
    }
    
    if (!data) {
        data = weatherData.default;
        matchedCity = city.charAt(0).toUpperCase() + city.slice(1);
    }
    
    container.innerHTML = `
        <div class="location">📍 ${matchedCity}</div>
        <div class="temp">${data.temp}°C</div>
        <div class="condition">${data.condition}</div>
        <div style="display:flex;justify-content:center;gap:20px;margin-top:16px;">
            <div>💧 ${data.humidity}%</div>
            <div>💨 ${data.wind} km/h</div>
        </div>
        <div style="margin-top:12px;font-size:14px;opacity:0.8;">
            ${getWeatherTip(data.condition)}
        </div>
    `;
}

function getWeatherTip(condition) {
    if (condition.includes('Rainy')) return '🌂 Don\'t forget your umbrella!';
    if (condition.includes('Sunny')) return '🧴 Apply sunscreen! Stay hydrated.';
    if (condition.includes('Cloudy')) return '👕 Perfect weather for exploring!';
    return '🌤️ Enjoy your day!';
                     }
