document.addEventListener("DOMContentLoaded", loadNotes);

// Not ekleme ve silme işlemleri
const noteForm = document.getElementById('noteForm');
const noteInput = document.getElementById('noteInput');
const noteList = document.getElementById('noteList');
const searchInput = document.getElementById('searchInput');

// Not ekleme
noteForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const noteText = noteInput.value.trim();
    const category = document.getElementById('categorySelect').value;
    const priority = document.getElementById('prioritySelect').value;

    if (noteText !== "") {
        const note = {
            text: noteText,
            category: category,
            priority: priority,
            timestamp: Date.now(),
            id: Date.now()
        };
        addNoteToList(note);
        saveNoteToLocalStorage(note);
        noteInput.value = ""; // Giriş kutusunu temizle
    }
});

// Notları ekranda görüntüle
function addNoteToList(note) {
    const li = document.createElement('li');
    const timestamp = new Date(note.timestamp).toLocaleString();
    li.setAttribute('data-id', note.id);
    li.classList.add(note.category);
    li.innerHTML = `
        <span class="note-text">${note.text}</span>
        <span class="category">${note.category}</span>
        <span class="priority">${note.priority}</span>
        <span class="timestamp">${timestamp}</span>
        <button class="edit">Düzenle</button>
        <button class="delete">Sil</button>
    `;

    noteList.appendChild(li);

    // Düzenle butonuna tıklanınca
    li.querySelector('.edit').addEventListener('click', function () {
        editNote(note.id); // Düzenleme fonksiyonunu çağır
    });

    // Silme butonuna tıklanınca
    li.querySelector('.delete').addEventListener('click', function () {
        deleteNote(note.id); // Silme fonksiyonunu çağır
    });
}

// Yerel depolamaya not ekle
function saveNoteToLocalStorage(note) {
    const notes = getNotesFromLocalStorage();
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Yerel depolamadan notları al
function getNotesFromLocalStorage() {
    const notes = localStorage.getItem('notes');
    return notes ? JSON.parse(notes) : [];
}

// Notları sayfada yükle
function loadNotes() {
    const notes = getNotesFromLocalStorage();
    notes.forEach(note => addNoteToList(note));
}

// Not silme
function deleteNote(noteId) {
    const notes = getNotesFromLocalStorage();
    const updatedNotes = notes.filter(note => note.id !== noteId);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    document.querySelector(`[data-id='${noteId}']`).remove();
}

// Not güncelleme
function editNote(noteId) {
    const notes = getNotesFromLocalStorage();
    const note = notes.find(n => n.id === noteId);
    const newText = prompt("Notu düzenleyin:", note.text);
    
    if (newText !== null && newText !== "") {
        note.text = newText;
        saveNotesToLocalStorage(notes);
        // Güncellenmiş notu ekrana yansıt
        document.querySelector(`[data-id='${noteId}'] .note-text`).textContent = newText;
    }
}

// Yerel depolamaya tüm notları kaydet
function saveNotesToLocalStorage(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Arama işlevi
searchInput.addEventListener('input', function (e) {
    const query = e.target.value.toLowerCase();
    const notes = document.querySelectorAll('li');
    notes.forEach(note => {
        const text = note.querySelector('.note-text').textContent.toLowerCase();
        if (text.includes(query)) {
            note.style.display = '';
        } else {
            note.style.display = 'none';
        }
    });
});
