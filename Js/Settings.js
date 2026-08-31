// Settings Logic - REAL Working Settings

document.addEventListener('DOMContentLoaded', () => {
    const user = Storage.getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    const darkMode = localStorage.getItem('raahi_dark_mode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').checked = true;
    }
    
    const language = localStorage.getItem('raahi_language') || 'en';
    document.getElementById('languageSelect').value = language;
});

function toggleDarkMode() {
    const isDark = document.getElementById('darkModeToggle').checked;
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('raahi_dark_mode', isDark);
}

function changeLanguage(lang) {
    localStorage.setItem('raahi_language', lang);
    alert(`🌐 Language changed to ${lang.toUpperCase()}`);
}

function blockUser() {
    const email = prompt('Enter the email of the user you want to block:');
    if (email && email.trim()) {
        let blocked = JSON.parse(localStorage.getItem('raahi_blocked') || '[]');
        if (!blocked.includes(email.trim())) {
            blocked.push(email.trim());
            localStorage.setItem('raahi_blocked', JSON.stringify(blocked));
            alert(`✅ User ${email} has been blocked.`);
        } else {
            alert(`⚠️ ${email} is already blocked.`);
        }
    }
}

function deleteAccount() {
    if (confirm('⚠️ Are you sure you want to delete your account? This cannot be undone!')) {
        if (confirm('All your posts, messages, and data will be permanently deleted. Are you sure?')) {
            const user = Storage.getUser();
            if (user) {
                const users = Storage.getUsers();
                delete users[user.email];
                Storage.set('raahi_users', users);
                
                const posts = Storage.getPosts();
                const filteredPosts = posts.filter(p => p.userEmail !== user.email);
                Storage.set('raahi_posts', filteredPosts);
                
                localStorage.removeItem('raahi_user');
                alert('✅ Account deleted successfully.');
                window.location.href = 'login.html';
            }
        }
    }
}
