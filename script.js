const addNoteBtn = document.getElementById("addNoteBtn");

const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");

const notesContainer = document.getElementById("notesContainer");
const noteCount = document.getElementById("noteCount");

let notes = [];

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

  if (notes.length === 0) {
    notesContainer.innerHTML = `
            <div class="empty-message">
                No notes yet. Create your first note!
            </div>
        `;

    noteCount.textContent = "0 notes";

    return;
  }

  notes.forEach((note) => {
    const noteElement = document.createElement("article");

    noteElement.className = "note-card";

    noteElement.innerHTML = `
            <h3>${note.title}</h3>

            <p>${note.content}</p>
        `;

    notesContainer.appendChild(noteElement);
  });

  noteCount.textContent = `${notes.length} ${notes.length === 1 ? "note" : "notes"}`;
}
