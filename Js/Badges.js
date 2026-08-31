// Badges System - REAL Working

const BadgeSystem = {
    badges: [
        { id: 'first_post', name: '📸 First Post', description: 'Posted your first photo', icon: 'fa-camera' },
        { id: 'first_like', name: '❤️ First Like', description: 'Got your first like', icon: 'fa-heart' },
        { id: 'first_comment', name: '💬 First Comment', description: 'Got your first comment', icon: 'fa-comment' },
        { id: 'first_follower', name: '👥 First Follower', description: 'Got your first follower', icon: 'fa-user-plus' },
        { id: 'first_checkin', name: '📍 First Check-in', description: 'Checked-in at a place', icon: 'fa-map-pin' },
        { id: 'first_reel', name: '🎬 First Reel', description: 'Uploaded your first reel', icon: 'fa-video' },
        { id: 'first_story', name: '📖 First Story', description: 'Posted your first story', icon: 'fa-book' },
        { id: 'traveler', name: '🌍 Traveler', description: 'Visited 5+ places', icon: 'fa-globe' },
        { id: 'explorer', name: '🗺️ Explorer', description: 'Visited 10+ places', icon: 'fa-compass' },
        { id: 'adventurer', name: '🏔️ Adventurer', description: 'Visited 20+ places', icon: 'fa-mountain' },
        { id: 'social', name: '🤝 Social', description: 'Followed 10+ people', icon: 'fa-users' },
        { id: 'popular', name: '⭐ Popular', description: 'Got 100+ likes', icon: 'fa-star' },
        { id: 'influencer', name: '📱 Influencer', description: 'Got 500+ likes', icon: 'fa-crown' },
        { id: 'storyteller', name: '📝 Storyteller', description: 'Posted 10+ posts', icon: 'fa-pen-fancy' },
        { id: 'wanderer', name: '🧳 Wanderer', description: 'Posted 25+ posts', icon: 'fa-suitcase' }
    ],
    
    getBadges() {
        return this.badges;
    },
    
    getBadge(id) {
        return this.badges.find(b => b.id === id);
    },
    
    checkAndUnlock(userEmail) {
        const user = Storage.getUser();
        if (!user) return;
        
        const posts = Storage.getPosts();
        const userPosts = posts.filter(p => p.userEmail === userEmail);
        const checkins = Storage.getUserCheckIns(userEmail);
        const notifications = Storage.getNotifications();
        
        const unlocked = Storage.getUserBadges(userEmail);
        
        // Check each badge condition
        const checks = [
            { id: 'first_post', condition: userPosts.length >= 1 },
            { id: 'storyteller', condition: userPosts.length >= 10 },
            { id: 'wanderer', condition: userPosts.length >= 25 },
            { id: 'first_checkin', condition: checkins.length >= 1 },
            { id: 'traveler', condition: checkins.length >= 5 },
            { id: 'explorer', condition: checkins.length >= 10 },
            { id: 'adventurer', condition: checkins.length >= 20 },
            { id: 'first_follower', condition: (Storage.getUsers()[userEmail]?.followers?.length || 0) >= 1 },
            { id: 'social', condition: (Storage.getUsers()[userEmail]?.following?.length || 0) >= 10 },
            { id: 'first_like', condition: userPosts.some(p => p.likes > 0) },
            { id: 'popular', condition: userPosts.reduce((sum, p) => sum + (p.likes || 0), 0) >= 100 },
            { id: 'influencer', condition: userPosts.reduce((sum, p) => sum + (p.likes || 0), 0) >= 500 },
            { id: 'first_comment', condition: userPosts.some(p => p.comments?.length > 0) },
            { id: 'first_reel', condition: Storage.getReels().some(r => r.userEmail === userEmail) },
            { id: 'first_story', condition: Storage.getStories().some(s => s.userEmail === userEmail) }
        ];
        
        checks.forEach(check => {
            if (check.condition && !unlocked.includes(check.id)) {
                Storage.unlockBadge(userEmail, check.id);
                // Show notification
                const badge = this.getBadge(check.id);
                if (badge) {
                    alert(`🎉 New Badge Unlocked!\n\n${badge.icon} ${badge.name}\n${badge.description}`);
                }
            }
        });
    },
    
    getUserBadgesWithDetails(userEmail) {
        const unlocked = Storage.getUserBadges(userEmail);
        return this.badges.map(b => ({
            ...b,
            unlocked: unlocked.includes(b.id)
        }));
    }
};

window.BadgeSystem = BadgeSystem;
