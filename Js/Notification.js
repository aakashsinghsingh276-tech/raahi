// Notification Logic - REAL Working Notifications

document.addEventListener('DOMContentLoaded', () => {
    const user = Storage.getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    loadNotifications();
});

function loadNotifications() {
    const container = document.getElementById('notificationsList');
    const notifications = Storage.getNotifications();
    
    Storage.markAllRead();

    if (notifications.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:60px 20px;color:#999;">
                <i class="fas fa-bell" style="font-size:48px;display:block;margin-bottom:16px;"></i>
                <p>No notifications yet.</p>
                <p style="font-size:14px;margin-top:8px;">When someone likes, comments, or follows you, you'll see it here.</p>
            </div>
        `;
        return;
    }

    const users = Storage.getUsers();
    container.innerHTML = notifications.map(n => {
        const user = users[n.from] || { name: n.from?.split('@')[0] || 'Unknown', avatar: 'https://i.pravatar.cc/150?img=1' };
        const icon = n.type === 'like' ? '❤️' : n.type === 'comment' ? '💬' : '👤';
        return `
            <div class="notification-item">
                <div class="notification-avatar"><img src="${user.avatar || 'https://i.pravatar.cc/150?img=1'}" alt="${user.name}"></div>
                <div class="notification-content">
                    <div class="notification-text">
                        <strong>${user.name}</strong> ${n.message || n.type + ' your post'}
                    </div>
                    <div class="notification-time">${timeAgo(n.time)}</div>
                </div>
                <div class="notification-icon">${icon}</div>
            </div>
        `;
    }).join('');
}
