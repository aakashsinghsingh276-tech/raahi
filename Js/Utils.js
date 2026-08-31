// Utility Functions

function timeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000);
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
    if (diff < 2592000) return Math.floor(diff / 604800) + 'w ago';
    return past.toLocaleDateString();
}

function generateId() {
    return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
    return password.length >= 6;
}

function truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

function getInitials(name) {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substr(0, 2);
}

function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function isLoggedIn() {
    return !!Storage.getUser();
}

function getUserByEmail(email) {
    const users = Storage.getUsers();
    return users[email] || null;
}

function getCurrentUserData() {
    const user = Storage.getUser();
    if (!user) return null;
    const users = Storage.getUsers();
    return users[user.email] || null;
}

// Make all functions globally available
window.timeAgo = timeAgo;
window.generateId = generateId;
window.isValidEmail = isValidEmail;
window.isValidPassword = isValidPassword;
window.truncateText = truncateText;
window.getInitials = getInitials;
window.formatDate = formatDate;
window.formatNumber = formatNumber;
window.debounce = debounce;
window.isLoggedIn = isLoggedIn;
window.getUserByEmail = getUserByEmail;
window.getCurrentUserData = getCurrentUserData;
