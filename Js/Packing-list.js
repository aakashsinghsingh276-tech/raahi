// Packing List - REAL Working

document.addEventListener('DOMContentLoaded', () => {
    const user = Storage.getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    loadPackingList();
});

function loadPackingList() {
    const saved = Storage.getPackingList();
    document.querySelectorAll('.packing-item').forEach(cb => {
        cb.checked = saved[cb.id] || false;
        if (cb.checked) {
            cb.parentElement.classList.add('checked');
        }
    });
    
    document.querySelectorAll('.packing-item').forEach(cb => {
        cb.addEventListener('change', function() {
            if (this.checked) {
                this.parentElement.classList.add('checked');
            } else {
                this.parentElement.classList.remove('checked');
            }
        });
    });
}

function savePackingList() {
    const items = {};
    document.querySelectorAll('.packing-item').forEach(cb => {
        items[cb.id] = cb.checked;
    });
    Storage.savePackingList(items);
    alert('✅ Packing list saved!');
}
