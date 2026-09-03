const noteForm = document.getElementById("noteForm");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const searchInput = document.getElementById("searchInput");
const notesContainer = document.getElementById("notesContainer");
const noteCount = document.getElementById("noteCount");

const storageKey = "notes";

let notes = loadNotes();

let searchText = "";

displayNotes();

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = noteTitle.value.trim();
  const content = noteContent.value.trim();

  if (title === "" || content === "") {
    noteForm.reportValidity();
    return;
  }

  const note = {
    id: Date.now(),
    title: title,
    content: content,
  };

  notes.push(note);

  saveNotes();
  displayNotes();

  noteForm.reset();
  noteTitle.focus();
});

searchInput.addEventListener("input", searchNotes);

function displayNotes() {
  notesContainer.innerHTML = "";

  const filteredNotes = notes.filter((note) => {
    return (
      note.title.toLowerCase().includes(searchText) ||
      note.content.toLowerCase().includes(searchText)
    );
  });

  if (filteredNotes.length === 0) {
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "empty-message";
    emptyMessage.textContent = searchText
      ? "No notes match your search."
      : "No notes yet. Create your first note!";

    notesContainer.appendChild(emptyMessage);

    noteCount.textContent = "0 notes";

    return;
  }

  filteredNotes.forEach((note) => {
    const noteElement = document.createElement("article");
    noteElement.className = "note-card";

    const heading = document.createElement("h3");
    heading.textContent = note.title;

    const content = document.createElement("p");
    content.textContent = note.content;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete note: ${note.title}`);
    deleteButton.addEventListener("click", () => deleteNote(note.id));

    noteElement.append(heading, content, deleteButton);

    notesContainer.appendChild(noteElement);
  });

  noteCount.textContent = `${filteredNotes.length} ${
    filteredNotes.length === 1 ? "note" : "notes"
  }`;
}

function deleteNote(id) {
  notes = notes.filter((note) => {
    return note.id !== id;
  });

  saveNotes();
  displayNotes();
}

function searchNotes() {
  searchText = searchInput.value.toLowerCase().trim();

  displayNotes();
}

function saveNotes() {
  localStorage.setItem(storageKey, JSON.stringify(notes));
}

function loadNotes() {
  try {
    const savedNotes = JSON.parse(localStorage.getItem(storageKey));

    if (!Array.isArray(savedNotes)) {
      return [];
    }

    return savedNotes.filter(
      (note) =>
        note &&
        (typeof note.id === "number" || typeof note.id === "string") &&
        typeof note.title === "string" &&
        typeof note.content === "string",
    );
  } catch {
    return [];
  }
}
