// Auth Logic - REAL Working Authentication

document.addEventListener('DOMContentLoaded', () => {
    const user = Storage.getUser();
    if (user) {
        if (window.location.pathname.includes('login') || 
            window.location.pathname.includes('signup')) {
            window.location.href = 'feed.html';
        }
    } else {
        const protectedPages = ['feed.html', 'explore.html', 'upload.html', 
                               'profile.html', 'chat.html', 'notifications.html',
                               'stories.html', 'reels.html', 'edit-profile.html',
                               'solo-travel.html', 'travel-buddy.html', 
                               'destination-guide.html', 'weather.html',
                               'packing-list.html', 'trip-planner.html', 
                               'settings.html'];
        if (protectedPages.some(page => window.location.pathname.includes(page))) {
            window.location.href = 'login.html';
        }
    }
});

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageEl = document.getElementById('loginMessage');

    const users = Storage.getUsers();

    if (users[email] && users[email].password === password) {
        const user = {
            email: email,
            name: users[email].name,
            username: users[email].username,
            avatar: users[email].avatar || 'https://i.pravatar.cc/150?img=7',
            joined: users[email].joined
        };
        Storage.set('raahi_user', user);
        window.location.href = 'feed.html';
    } else {
        messageEl.className = 'message error';
        messageEl.innerHTML = '❌ Invalid email or password. <a href="signup.html" style="color:#FF5A5F;">Create account?</a>';
    }
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const avatar = document.getElementById('signupAvatar')?.value || 
                   `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`;
    const messageEl = document.getElementById('signupMessage');

    const users = Storage.getUsers();

    if (users[email]) {
        messageEl.className = 'message error';
        messageEl.innerHTML = '❌ Email already registered. <a href="login.html" style="color:#FF5A5F;">Log in?</a>';
        return;
    }

    users[email] = {
        name: name,
        username: username,
        password: password,
        avatar: avatar,
        joined: new Date().toISOString(),
        followers: [],
        following: [],
        location: '',
        bio: '',
        interests: '',
        travelStyles: [],
        posts: 0
    };

    Storage.set('raahi_users', users);

    const user = {
        email: email,
        name: name,
        username: username,
        avatar: avatar,
        joined: users[email].joined
    };
    Storage.set('raahi_user', user);

    messageEl.className = 'message success';
    messageEl.innerHTML = '✅ Account created successfully! Redirecting...';

    setTimeout(() => {
        window.location.href = 'feed.html';
    }, 1500);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        Storage.remove('raahi_user');
        window.location.href = 'login.html';
    }
}

function togglePassword(id) {
    const input = document.getElementById(id);
    const icon = input.parentElement.querySelector('.toggle-password i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function demoLogin() {
    document.getElementById('loginEmail').value = 'demo@raahi.com';
    document.getElementById('loginPassword').value = 'demo123';
    document.getElementById('loginForm').dispatchEvent(new Event('submit'));
          }
