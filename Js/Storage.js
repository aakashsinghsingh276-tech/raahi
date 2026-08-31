// ============================================================
// RAAHI - Complete Storage Helper
// All data persists in browser localStorage
// ============================================================

const Storage = {
    // ========== BASE FUNCTIONS ==========
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
    
    clear() {
        localStorage.clear();
    },

    // ========== USER FUNCTIONS ==========
    getUser() {
        return this.get('raahi_user');
    },
    
    getUsers() {
        return this.get('raahi_users', {});
    },
    
    saveUser(user) {
        return this.set('raahi_user', user);
    },
    
    saveUsers(users) {
        return this.set('raahi_users', users);
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
            shares: 0,
            views: 0
        };
        posts.unshift(newPost);
        this.set('raahi_posts', posts);
        return newPost;
    },
    
    updatePost(postId, updates) {
        const posts = this.getPosts();
        const index = posts.findIndex(p => p.id === postId);
        if (index !== -1) {
            posts[index] = { ...posts[index], ...updates };
            this.set('raahi_posts', posts);
            return posts[index];
        }
        return null;
    },
    
    deletePost(postId) {
        const posts = this.getPosts();
        const filtered = posts.filter(p => p.id !== postId);
        this.set('raahi_posts', filtered);
        return filtered;
    },
    
    likePost(postId) {
        const posts = this.getPosts();
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.liked = !post.liked;
            post.likes += post.liked ? 1 : -1;
            this.set('raahi_posts', posts);
            
            // Check for badge
            const user = this.getUser();
            if (user) {
                this.checkBadges(user.email);
            }
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
            
            // Check for badge
            const user = this.getUser();
            if (user) {
                this.checkBadges(user.email);
            }
        }
        return post;
    },
    
    deleteComment(postId, commentId) {
        const posts = this.getPosts();
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.comments = post.comments.filter(c => c.id !== commentId);
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
    
    markMessagesRead(withUser) {
        const user = this.getUser();
        if (!user) return;
        const chats = this.getChats();
        const key = [user.email, withUser].sort().join('_');
        if (chats[key]) {
            chats[key].forEach(msg => {
                if (msg.to === user.email) msg.read = true;
            });
            this.set('raahi_chats', chats);
        }
    },
    
    getUnreadCount() {
        const user = this.getUser();
        if (!user) return 0;
        const chats = this.getChats();
        let count = 0;
        Object.keys(chats).forEach(key => {
            chats[key].forEach(msg => {
                if (msg.to === user.email && !msg.read) count++;
            });
        });
        return count;
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
    
    markNotificationRead(id) {
        const notifications = this.getNotifications();
        const notif = notifications.find(n => n.id === id);
        if (notif) {
            notif.read = true;
            this.set('raahi_notifications', notifications);
        }
        return notif;
    },
    
    deleteNotification(id) {
        let notifications = this.getNotifications();
        notifications = notifications.filter(n => n.id !== id);
        this.set('raahi_notifications', notifications);
        return notifications;
    },
    
    getUnreadNotifications() {
        const notifications = this.getNotifications();
        return notifications.filter(n => !n.read);
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
                this.saveUsers(users);
                
                // Check for badge
                this.checkBadges(currentUser.email);
                this.checkBadges(userEmail);
                return true;
            } else {
                users[userEmail].followers.splice(index, 1);
                const idx = users[currentUser.email].following.indexOf(userEmail);
                if (idx > -1) users[currentUser.email].following.splice(idx, 1);
                this.saveUsers(users);
                return false;
            }
        }
        return null;
    },
    
    isFollowing(userEmail) {
        const user = this.getUser();
        if (!user) return false;
        const users = this.getUsers();
        return users[user.email]?.following?.includes(userEmail) || false;
    },
    
    getFollowers(userEmail) {
        const users = this.getUsers();
        return users[userEmail]?.followers || [];
    },
    
    getFollowing(userEmail) {
        const users = this.getUsers();
        return users[userEmail]?.following || [];
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
            time: new Date().toISOString(),
            status: 'pending' // pending, accepted, rejected
        });
        this.set('raahi_buddy_requests', requests);
        return requests;
    },
    
    updateBuddyRequest(id, status) {
        const requests = this.getBuddyRequests();
        const request = requests.find(r => r.id === id);
        if (request) {
            request.status = status;
            this.set('raahi_buddy_requests', requests);
        }
        return request;
    },
    
    deleteBuddyRequest(id) {
        let requests = this.getBuddyRequests();
        requests = requests.filter(r => r.id !== id);
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
    
    updateTrip(tripId, updates) {
        let trips = this.getTrips();
        const index = trips.findIndex(t => t.id === tripId);
        if (index !== -1) {
            trips[index] = { ...trips[index], ...updates };
            this.set('raahi_trips', trips);
            return trips[index];
        }
        return null;
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
    
    togglePackingItem(itemId) {
        const items = this.getPackingList();
        if (items[itemId] !== undefined) {
            items[itemId] = !items[itemId];
            this.set('raahi_packing_list', items);
        }
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
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            views: 0,
            viewers: []
        });
        this.set('raahi_stories', stories);
        
        // Check for badge
        const user = this.getUser();
        if (user) {
            this.checkBadges(user.email);
        }
        return stories;
    },
    
    viewStory(storyId) {
        const stories = this.getStories();
        const story = stories.find(s => s.id === storyId);
        const user = this.getUser();
        if (story && user) {
            if (!story.viewers) story.viewers = [];
            if (!story.viewers.includes(user.email)) {
                story.viewers.push(user.email);
                story.views = (story.views || 0) + 1;
                this.set('raahi_stories', stories);
            }
        }
        return story;
    },
    
    deleteStory(storyId) {
        let stories = this.getStories();
        stories = stories.filter(s => s.id !== storyId);
        this.set('raahi_stories', stories);
        return stories;
    },
    
    getActiveStories() {
        const stories = this.getStories();
        const now = new Date();
        return stories.filter(s => new Date(s.expiresAt) > now);
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
            liked: false,
            comments: [],
            views: 0
        });
        this.set('raahi_reels', reels);
        
        // Check for badge
        const user = this.getUser();
        if (user) {
            this.checkBadges(user.email);
        }
        return reels;
    },
    
    likeReel(reelId) {
        const reels = this.getReels();
        const reel = reels.find(r => r.id === reelId);
        if (reel) {
            reel.liked = !reel.liked;
            reel.likes += reel.liked ? 1 : -1;
            this.set('raahi_reels', reels);
        }
        return reel;
    },
    
    deleteReel(reelId) {
        let reels = this.getReels();
        reels = reels.filter(r => r.id !== reelId);
        this.set('raahi_reels', reels);
        return reels;
    },

    // ========== BADGES ==========
    getAllBadges() {
        return [
            { id: 'first_post', name: '📸 First Post', description: 'Posted your first photo', category: 'Content' },
            { id: 'first_like', name: '❤️ First Like', description: 'Got your first like', category: 'Engagement' },
            { id: 'first_comment', name: '💬 First Comment', description: 'Got your first comment', category: 'Engagement' },
            { id: 'first_follower', name: '👥 First Follower', description: 'Got your first follower', category: 'Social' },
            { id: 'first_checkin', name: '📍 First Check-in', description: 'Checked-in at a place', category: 'Travel' },
            { id: 'first_reel', name: '🎬 First Reel', description: 'Uploaded your first reel', category: 'Content' },
            { id: 'first_story', name: '📖 First Story', description: 'Posted your first story', category: 'Content' },
            { id: 'traveler', name: '🌍 Traveler', description: 'Visited 5+ places', category: 'Travel' },
            { id: 'explorer', name: '🗺️ Explorer', description: 'Visited 10+ places', category: 'Travel' },
            { id: 'adventurer', name: '🏔️ Adventurer', description: 'Visited 20+ places', category: 'Travel' },
            { id: 'social', name: '🤝 Social', description: 'Followed 10+ people', category: 'Social' },
            { id: 'popular', name: '⭐ Popular', description: 'Got 100+ total likes', category: 'Engagement' },
            { id: 'influencer', name: '📱 Influencer', description: 'Got 500+ total likes', category: 'Engagement' },
            { id: 'storyteller', name: '📝 Storyteller', description: 'Posted 10+ posts', category: 'Content' },
            { id: 'wanderer', name: '🧳 Wanderer', description: 'Posted 25+ posts', category: 'Content' },
            { id: 'music_lover', name: '🎵 Music Lover', description: 'Added 5+ songs to library', category: 'Music' },
            { id: 'reel_star', name: '⭐ Reel Star', description: 'Uploaded 5+ reels', category: 'Content' },
            { id: 'travel_buddy', name: '🤗 Travel Buddy', description: 'Found a travel buddy', category: 'Social' },
        ];
    },
    
    getBadges() {
        return this.get('raahi_badges', {});
    },
    
    unlockBadge(userEmail, badgeId) {
        const badges = this.getBadges();
        if (!badges[userEmail]) badges[userEmail] = [];
        if (!badges[userEmail].includes(badgeId)) {
            badges[userEmail].push(badgeId);
            this.set('raahi_badges', badges);
            return true;
        }
        return false;
    },
    
    getUserBadges(userEmail) {
        const badges = this.getBadges();
        return badges[userEmail] || [];
    },
    
    isBadgeUnlocked(userEmail, badgeId) {
        const badges = this.getUserBadges(userEmail);
        return badges.includes(badgeId);
    },
    
    checkBadges(userEmail) {
        const user = this.getUser();
        if (!user) return;
        
        const posts = this.getPosts();
        const userPosts = posts.filter(p => p.userEmail === userEmail);
        const checkins = this.getUserCheckIns(userEmail);
        const reels = this.getReels();
        const userReels = reels.filter(r => r.userEmail === userEmail);
        const stories = this.getStories();
        const userStories = stories.filter(s => s.userEmail === userEmail);
        const users = this.getUsers();
        const userData = users[userEmail] || {};
        const musicLib = this.getUserMusicLibrary(userEmail);
        
        const unlocked = this.getUserBadges(userEmail);
        const allBadges = this.getAllBadges();
        let newBadges = [];
        
        // Check each badge
        const badgeChecks = {
            'first_post': userPosts.length >= 1,
            'storyteller': userPosts.length >= 10,
            'wanderer': userPosts.length >= 25,
            'first_checkin': checkins.length >= 1,
            'traveler': checkins.length >= 5,
            'explorer': checkins.length >= 10,
            'adventurer': checkins.length >= 20,
            'first_follower': (userData.followers?.length || 0) >= 1,
            'social': (userData.following?.length || 0) >= 10,
            'first_like': userPosts.some(p => p.likes > 0),
            'popular': userPosts.reduce((sum, p) => sum + (p.likes || 0), 0) >= 100,
            'influencer': userPosts.reduce((sum, p) => sum + (p.likes || 0), 0) >= 500,
            'first_comment': userPosts.some(p => p.comments?.length > 0),
            'first_reel': userReels.length >= 1,
            'reel_star': userReels.length >= 5,
            'first_story': userStories.length >= 1,
            'music_lover': (musicLib?.length || 0) >= 5,
            'travel_buddy': this.getBuddyRequests().some(r => r.userEmail === userEmail && r.status === 'accepted')
        };
        
        Object.keys(badgeChecks).forEach(badgeId => {
            if (badgeChecks[badgeId] && !unlocked.includes(badgeId)) {
                const badge = allBadges.find(b => b.id === badgeId);
                if (badge) {
                    this.unlockBadge(userEmail, badgeId);
                    newBadges.push(badge);
                }
            }
        });
        
        return newBadges;
    },

    // ========== CHECK-INS ==========
    getCheckIns() {
        return this.get('raahi_checkins', []);
    },
    
    addCheckIn(checkin) {
        const checkins = this.getCheckIns();
        checkins.unshift({
            id: Date.now(),
            ...checkin,
            time: new Date().toISOString()
        });
        this.set('raahi_checkins', checkins);
        
        // Check for badge
        const user = this.getUser();
        if (user) {
            this.checkBadges(user.email);
        }
        return checkins;
    },
    
    getUserCheckIns(userEmail) {
        const checkins = this.getCheckIns();
        return checkins.filter(c => c.userEmail === userEmail);
    },
    
    deleteCheckIn(checkinId) {
        let checkins = this.getCheckIns();
        checkins = checkins.filter(c => c.id !== checkinId);
        this.set('raahi_checkins', checkins);
        return checkins;
    },

    // ========== MUSIC LIBRARY ==========
    getUserMusicLibrary(userEmail) {
        const allLibraries = this.get('raahi_music_libraries', {});
        if (!allLibraries[userEmail]) {
            allLibraries[userEmail] = this.getDefaultSongs();
            this.set('raahi_music_libraries', allLibraries);
        }
      
