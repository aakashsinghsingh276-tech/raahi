// Edit Profile Logic - REAL Working Edit Profile

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    currentUser = Storage.getUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    loadProfileData();
});

function loadProfileData() {
    const users = Storage.getUsers();
    const userData = users[currentUser.email] || {};
    
    document.getElementById('editAvatar').src = currentUser.avatar || 'https://i.pravatar.cc/150?img=7';
    document.getElementById('editName').value = currentUser.name || '';
    document.getElementById('editUsername').value = currentUser.username || '';
    document.getElementById('editLocation').value = userData.location || '';
    document.getElementById('editBio').value = userData.bio || '';
    document.getElementById('editInterests').value = userData.interests || '';
    document.getElementById('editLanguage').value = userData.language || 'en';
    
    const styles = userData.travelStyles || [];
    document.querySelectorAll('.travel-style-options input[type="checkbox"]').forEach(cb => {
        cb.checked = styles.includes(cb.value);
    });
}

function saveProfile(event) {
    event.preventDefault();
    
    const users = Storage.getUsers();
    const userData = users[currentUser.email] || {};
    
    const name = document.getElementById('editName').value;
    const username = document.getElementById('editUsername').value;
    const location = document.getElementById('editLocation').value;
    const bio = document.getElementById('editBio').value;
    const interests = document.getElementById('editInterests').value;
    const language = document.getElementById('editLanguage').value;
    
    const travelStyles = [];
    document.querySelectorAll('.travel-style-options input[type="checkbox"]:checked').forEach(cb => {
        travelStyles.push(cb.value);
    });
    
    users[currentUser.email] = {
        ...userData,
        name: name,
        username: username,
        location: location,
        bio: bio,
        interests: interests,
        language: language,
        travelStyles: travelStyles
    };
    
    Storage.set('raahi_users', users);
    
    currentUser.name = name;
    currentUser.username = username;
    Storage.set('raahi_user', currentUser);
    
    alert('✅ Profile updated successfully!');
    window.location.href = 'profile.html';
}

function changeAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('editAvatar').src = event.target.result;
                
                const users = Storage.getUsers();
                const userData = users[currentUser.email] || {};
                users[currentUser.email] = {
                    ...userData,
                    avatar: event.target.result
                };
                Storage.set('raahi_users', users);
                
                currentUser.avatar = event.target.result;
                Storage.set('raahi_user', currentUser);
                
                alert('✅ Avatar updated!');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}
