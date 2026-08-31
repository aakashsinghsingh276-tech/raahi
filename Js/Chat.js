// Chat Logic - REAL Working Chat

let currentUser = null;
let currentChatUser = null;

document.addEventListener('DOMContentLoaded', () => {
    currentUser = Storage.getUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    loadChatList();
});

function loadChatList() {
    const chatList = document.getElementById('chatList');
    const users = Storage.getUsers();
    const chats = Storage.getChats();
    const currentEmail = currentUser.email;

    const chatUsers = new Set();
    Object.keys(chats).forEach(key => {
        const [u1, u2] = key.split('_');
        if (u1 === currentEmail) chatUsers.add(u2);
        if (u2 === currentEmail) chatUsers.add(u1);
    });

    if (chatUsers.size === 0) {
        Object.keys(users).forEach(email => {
            if (email !== currentEmail) chatUsers.add(email);
        });
    }

    let html = '';
    chatUsers.forEach(email => {
        const user = users[email];
        if (user) {
            const history = Storage.getChatHistory(email);
            const last = history.length > 0 ? history[history.length - 1] : null;
            html += `
                <div class="chat-item" onclick="openChat('${email}')">
                    <div class="chat-item-avatar"><img src="${user.avatar || 'https://i.pravatar.cc/150?img=1'}" alt="${user.name}"></div>
                    <div class="chat-item-info">
                        <div class="chat-item-name">${user.name}</div>
                        <div class="chat-item-last">${last ? last.text : 'Start chatting...'}</div>
                    </div>
                    <div class="chat-item-time">${last ? timeAgo(last.time) : ''}</div>
                </div>
            `;
        }
    });

    chatList.innerHTML = html || '<p style="text-align:center;color:#999;padding:40px;">No users to chat with yet.</p>';
}

function openChat(email) {
    currentChatUser = email;
    const users = Storage.getUsers();
    const user = users[email];
    if (!user) return;

    document.getElementById('chatList').style.display = 'none';
    document.getElementById('chatWindow').style.display = 'flex';
    document.getElementById('chatAvatar').src = user.avatar || 'https://i.pravatar.cc/150?img=1';
    document.getElementById('chatName').textContent = user.name;
    loadMessages(email);
}

function loadMessages(email) {
    const container = document.getElementById('chatMessages');
    const history = Storage.getChatHistory(email);
    const currentEmail = currentUser.email;

    container.innerHTML = history.map(msg => `
        <div class="message ${msg.from === currentEmail ? 'me' : 'other'}">
            ${msg.text}
            <span class="message-time">${timeAgo(msg.time)}</span>
        </div>
    `).join('') || '<p style="text-align:center;color:#999;padding:20px;">No messages yet. Say hello!</p>';

    container.scrollTop = container.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    if (!input || !input.value.trim() || !currentChatUser) return;
    const text = input.value.trim();
    input.value = '';
    Storage.sendMessage(currentChatUser, text);
    loadMessages(currentChatUser);
}

function sendMessageOnEnter(event) {
    if (event.key === 'Enter') sendMessage();
}

function closeChat() {
    document.getElementById('chatList').style.display = 'block';
    document.getElementById('chatWindow').style.display = 'none';
    currentChatUser = null;
    loadChatList();
}

setInterval(() => {
    if (currentChatUser) loadMessages(currentChatUser);
}, 5000);
