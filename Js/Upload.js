// Upload Logic - REAL Working Upload

let selectedFile = null;
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    currentUser = Storage.getUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
});

function previewFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    selectedFile = file;
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const preview = document.getElementById('uploadPreview');
        const image = document.getElementById('previewImage');
        const uploadBox = document.getElementById('uploadBox');
        
        image.src = e.target.result;
        preview.style.display = 'block';
        uploadBox.style.display = 'none';
    };
    
    reader.readAsDataURL(file);
}

function removeFile() {
    selectedFile = null;
    document.getElementById('fileInput').value = '';
    document.getElementById('uploadPreview').style.display = 'none';
    document.getElementById('uploadBox').style.display = 'block';
}

function handleUpload(event) {
    event.preventDefault();
    
    if (!selectedFile) {
        alert('Please select a photo to upload.');
        return;
    }
    
    const caption = document.getElementById('postCaption').value;
    const hashtags = document.getElementById('postHashtags').value;
    const user = Storage.getUser();
    
    const reader = new FileReader();
    reader.onload = function(e) {
        Storage.addPost({
            userEmail: user.email,
            image: e.target.result,
            caption: caption,
            hashtags: hashtags
        });
        
        alert('✅ Post uploaded successfully!');
        window.location.href = 'feed.html';
    };
    
    reader.readAsDataURL(selectedFile);
}

function uploadFromCamera() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = function(e) {
        if (e.target.files[0]) {
            selectedFile = e.target.files[0];
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('previewImage').src = event.target.result;
                document.getElementById('uploadPreview').style.display = 'block';
                document.getElementById('uploadBox').style.display = 'none';
            };
            reader.readAsDataURL(selectedFile);
        }
    };
    input.click();
}
