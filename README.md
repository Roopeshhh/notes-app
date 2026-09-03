# 📝 Notes App

A dependency-free, responsive notes application built with HTML, CSS, and
JavaScript. Notes are stored locally in the browser, so they remain available
after a refresh.

## Features

- Create, edit, cancel edits, search, pin, and delete notes
- Show a live count of the currently visible notes
- Keep pinned notes above the normal newest-first list
- Record and display the last update time for new and edited notes
- Validate required fields and support keyboard-friendly form submission
- Safely render note text, including text that contains HTML-like characters
- Handle missing or malformed saved data without breaking the app
- Work responsively on desktop and mobile screens

## Run locally

No install or build step is required. Open `index.html` in a modern browser.

For a local development server, run:

Then visit `http://127.0.0.1:4173`.

## Project structure

```text
notes-app/
├── index.html  # Structure and accessible controls
├── style.css   # Responsive visual design
├── script.js   # Note data, rendering, and local storage
└── README.md   # Project documentation
```
