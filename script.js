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
      note.id === editingNoteId
        ? { ...note, title, content, updatedAt: new Date().toISOString() }
        : note,
    );
    formStatus.textContent = "Note updated.";
  } else {
    const now = new Date().toISOString();

    notes.push({
      id: createNoteId(),
      title,
      content,
      createdAt: now,
      updatedAt: now,
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

  const filteredNotes = notes
    .filter((note) => {
      return (
        note.title.toLowerCase().includes(searchText) ||
        note.content.toLowerCase().includes(searchText)
      );
    })
    .sort((firstNote, secondNote) => {
      return (
        Number(Boolean(secondNote.isPinned)) -
          Number(Boolean(firstNote.isPinned)) ||
        getNoteTimestamp(secondNote) - getNoteTimestamp(firstNote)
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

    if (note.isPinned) {
      noteElement.classList.add("note-card--pinned");
    }

    const heading = document.createElement("h3");
    heading.textContent = note.title;

    const content = document.createElement("p");
    content.textContent = note.content;

    const noteDate = createNoteDate(note);

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const pinButton = document.createElement("button");
    pinButton.className = "pin-btn";
    pinButton.type = "button";
    pinButton.textContent = note.isPinned ? "Unpin" : "Pin";
    pinButton.setAttribute(
      "aria-label",
      `${note.isPinned ? "Unpin" : "Pin"} note: ${note.title}`,
    );
    pinButton.setAttribute("aria-pressed", String(Boolean(note.isPinned)));
    pinButton.addEventListener("click", () => togglePinnedNote(note.id));

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

    actions.append(pinButton, editButton, deleteButton);
    noteElement.append(heading, content);

    if (noteDate) {
      noteElement.append(noteDate);
    }

    if (note.isPinned) {
      const pinStatus = document.createElement("span");
      pinStatus.className = "note-pin-status";
      pinStatus.textContent = "Pinned";
      noteElement.append(pinStatus);
    }

    noteElement.append(actions);

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

function togglePinnedNote(id) {
  notes = notes.map((note) =>
    note.id === id ? { ...note, isPinned: !note.isPinned } : note,
  );

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

function createNoteDate(note) {
  const timestamp = getNoteTimestamp(note);

  if (!timestamp) {
    return null;
  }

  const date = new Date(timestamp);
  const dateElement = document.createElement("time");
  dateElement.className = "note-date";
  dateElement.dateTime = date.toISOString();
  dateElement.textContent = `Updated ${new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)}`;

  return dateElement;
}

function getNoteTimestamp(note) {
  const timestamp = Date.parse(note.updatedAt ?? note.createdAt ?? "");

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function loadNotes() {
  try {
    const savedNotes = JSON.parse(localStorage.getItem(storageKey));

    if (!Array.isArray(savedNotes)) {
      return [];
    }

    return savedNotes.filter(
      isValidNote,
    );
  } catch {
    return [];
  }
}

function isValidNote(note) {
  return (
    note &&
    (typeof note.id === "number" || typeof note.id === "string") &&
    typeof note.title === "string" &&
    typeof note.content === "string"
  );
}
