// Storage Helper - All data persists in browser

const Storage = {
    get(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch {
            return defaultValue;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    },
    
    remove(key) {
        localStorage.removeItem(key);
    },
    
    // ========== USER FUNCTIONS ==========
    getUser() {
        return this.get('raahi_user');
    },
    
    getUsers() {
        return this.get('raahi_users', {});
    },
    
    // ========== POST FUNCTIONS ==========
    getPosts() {
        return this.get('raahi_posts', []);
    },
    
    addPost(post) {
        const posts = this.getPosts();
        const newPost = {
            id: Date.now(),
            ...post,
            createdAt: new Date().toISOString(),
            likes: 0,
            liked: false,
            comments: [],
            shares: 0
        };
        posts.unshift(newPost);
        this.set('raahi_posts', posts);
        return newPost;
    },
    
    likePost(postId) {
        const posts = this.getPosts();
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.liked = !post.liked;
            post.likes += post.liked ? 1 : -1;
            this.set('raahi_posts', posts);
        }
        return post;
    },
    
    addComment(postId, comment) {
        const posts = this.getPosts();
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.comments.push({
                id: Date.now(),
                ...comment,
                createdAt: new Date().toISOString()
            });
            this.set('raahi_posts', posts);
        }
        return post;
    },
    
    // ========== CHAT FUNCTIONS ==========
    getChats() {
        return this.get('raahi_chats', {});
    },
    
    sendMessage(to, text) {
        const user = this.getUser();
        if (!user) return null;
        const chats = this.getChats();
        const key = [user.email, to].sort().join('_');
        if (!chats[key]) chats[key] = [];
        const message = {
            id: Date.now(),
            from: user.email,
            to: to,
            text: text,
            time: new Date().toISOString(),
            read: false
        };
        chats[key].push(message);
        this.set('raahi_chats', chats);
        return message;
    },
    
    getChatHistory(withUser) {
        const user = this.getUser();
        if (!user) return [];
        const chats = this.getChats();
        const key = [user.email, withUser].sort().join('_');
        return chats[key] || [];
    },
    
    // ========== NOTIFICATION FUNCTIONS ==========
    getNotifications() {
        return this.get('raahi_notifications', []);
    },
    
    addNotification(notification) {
        const notifications = this.getNotifications();
        notifications.unshift({
            id: Date.now(),
            ...notification,
            time: new Date().toISOString(),
            read: false
        });
        this.set('raahi_notifications', notifications);
        return notifications;
    },
    
    markAllRead() {
        const notifications = this.getNotifications();
        notifications.forEach(n => n.read = true);
        this.set('raahi_notifications', notifications);
        return notifications;
    },
    
    // ========== FOLLOW FUNCTIONS ==========
    followUser(userEmail) {
        const currentUser = this.getUser();
        if (!currentUser) return null;
        const users = this.getUsers();
        if (users[userEmail]) {
            if (!users[userEmail].followers) users[userEmail].followers = [];
            if (!users[currentUser.email].following) users[currentUser.email].following = [];
            const index = users[userEmail].followers.indexOf(currentUser.email);
            if (index === -1) {
                users[userEmail].followers.push(currentUser.email);
                users[currentUser.email].following.push(userEmail);
            } else {
                users[userEmail].followers.splice(index, 1);
                const idx = users[currentUser.email].following.indexOf(userEmail);
                if (idx > -1) users[currentUser.email].following.splice(idx, 1);
            }
            this.set('raahi_users', users);
        }
        return users;
    },
    
    // ========== BUDDY REQUESTS ==========
    getBuddyRequests() {
        return this.get('raahi_buddy_requests', []);
    },
    
    addBuddyRequest(request) {
        const requests = this.getBuddyRequests();
        requests.unshift({
            id: Date.now(),
            ...request,
            time: new Date().toISOString()
        });
        this.set('raahi_buddy_requests', requests);
        return requests;
    },
    
    // ========== TRIPS ==========
    getTrips() {
        return this.get('raahi_trips', []);
    },
    
    addTrip(trip) {
        const trips = this.getTrips();
        trips.unshift({
            id: Date.now(),
            ...trip,
            createdAt: new Date().toISOString()
        });
        this.set('raahi_trips', trips);
        return trips;
    },
    
    deleteTrip(tripId) {
        let trips = this.getTrips();
        trips = trips.filter(t => t.id !== tripId);
        this.set('raahi_trips', trips);
        return trips;
    },
    
    // ========== PACKING LIST ==========
    getPackingList() {
        return this.get('raahi_packing_list', {});
    },
    
    savePackingList(items) {
        this.set('raahi_packing_list', items);
        return items;
    },
    
    // ========== STORIES ==========
    getStories() {
        return this.get('raahi_stories', []);
    },
    
    addStory(story) {
        const stories = this.getStories();
        stories.unshift({
            id: Date.now(),
            ...story,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });
        this.set('raahi_stories', stories);
        return stories;
    },
    
    // ========== REELS ==========
    getReels() {
        return this.get('raahi_reels', []);
    },
    
    addReel(reel) {
        const reels = this.getReels();
        reels.unshift({
            id: Date.now(),
            ...reel,
            createdAt: new Date().toISOString(),
            likes: 0,
            comments: []
        });
        this.set('raahi_reels', reels);
        return reels;
    },
    
    likeReel(reelId) {
        const reels = this.getReels();
        const reel = reels.find(r => r.id === reelId);
        if (reel) {
            reel.likes = (reel.likes || 0) + 1;
            this.set('raahi_reels', reels);
        }
        return reel;
    }
};

// Make globally available
window.Storage = Storage;
