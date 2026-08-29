const addNoteBtn = document.getElementById("addNoteBtn");

const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");

const notesContainer = document.getElementById("notesContainer");
const noteCount = document.getElementById("noteCount");

let notes = [];
let searchText = "";

addNoteBtn.addEventListener("click", () => {
  const title = noteTitle.value.trim();
  const content = noteContent.value.trim();

  if (title === "" || content === "") {
    alert("Please enter a title and note.");
    return;
  }

  const note = {
    id: Date.now(),
    title: title,
    content: content,
  };

  notes.push(note);

  displayNotes();

  noteTitle.value = "";
  noteContent.value = "";
});

function displayNotes() {
  notesContainer.innerHTML = "";

  const filteredNotes = notes.filter((note) => {
    return (
      note.title.toLowerCase().includes(searchText) ||
      note.content.toLowerCase().includes(searchText)
    );
  });

  if (filteredNotes.length === 0) {
    notesContainer.innerHTML = `
            <div class="empty-message">
                No notes found.
            </div>
        `;

    noteCount.textContent = "0 notes";

    return;
  }

  filteredNotes.forEach((note) => {
    const noteElement = document.createElement("article");

    noteElement.className = "note-card";

    noteElement.innerHTML = `
            <h3>${note.title}</h3>

            <p>${note.content}</p>

            <button
                class="delete-btn"
                onclick="deleteNote(${note.id})"
            >
                Delete
            </button>
        `;

    notesContainer.appendChild(noteElement);
  });

  noteCount.textContent = `${filteredNotes.length} ${
    filteredNotes.length === 1 ? "note" : "notes"
  }`;
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);

  displayNotes();
}

function searchNotes() {
  searchText = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();

  displayNotes();
}
