const noteForm = document.getElementById("noteForm");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const addNoteBtn = document.getElementById("addNoteBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const formStatus = document.getElementById("formStatus");
const searchInput = document.getElementById("searchInput");
const notesContainer = document.getElementById("notesContainer");
const noteCount = document.getElementById("noteCount");

const storageKey = "notes";

let notes = loadNotes();

let searchText = "";
let editingNoteId = null;

displayNotes();

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = noteTitle.value.trim();
  const content = noteContent.value.trim();

  if (title === "" || content === "") {
    noteForm.reportValidity();
    return;
  }

  if (editingNoteId !== null) {
    notes = notes.map((note) =>
      note.id === editingNoteId ? { ...note, title, content } : note,
    );
    formStatus.textContent = "Note updated.";
  } else {
    notes.push({
      id: createNoteId(),
      title,
      content,
    });
    formStatus.textContent = "Note added.";
  }

  saveNotes();
  displayNotes();
  resetForm();
  noteTitle.focus();
});

searchInput.addEventListener("input", searchNotes);
cancelEditBtn.addEventListener("click", () => {
  resetForm();
  formStatus.textContent = "Edit cancelled.";
  noteTitle.focus();
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

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const editButton = document.createElement("button");
    editButton.className = "edit-btn";
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => startEditing(note));

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete note: ${note.title}`);
    deleteButton.addEventListener("click", () => deleteNote(note.id));

    actions.append(editButton, deleteButton);
    noteElement.append(heading, content, actions);

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

  if (editingNoteId === id) {
    resetForm();
  }

  saveNotes();
  displayNotes();
}

function startEditing(note) {
  editingNoteId = note.id;
  noteTitle.value = note.title;
  noteContent.value = note.content;
  addNoteBtn.textContent = "Save changes";
  cancelEditBtn.hidden = false;
  formStatus.textContent = `Editing: ${note.title}`;
  noteTitle.focus();
}

function resetForm() {
  noteForm.reset();
  editingNoteId = null;
  addNoteBtn.textContent = "Add Note";
  cancelEditBtn.hidden = true;
}

function searchNotes() {
  searchText = searchInput.value.toLowerCase().trim();

  displayNotes();
}

function saveNotes() {
  localStorage.setItem(storageKey, JSON.stringify(notes));
}

function createNoteId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
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
