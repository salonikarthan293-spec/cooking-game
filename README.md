# Kitchen Rush

A fun browser-based cooking game where the player serves orders before time runs out.

## Features
- Click ingredients to build dishes
- Serve recipes matching active customer orders
- Score points and build combos
- 60-second timer with restart support

## How to run
1. Open `index.html` in a browser, or
2. Serve the folder with a simple local server such as:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in the browser.

## Project files
- `index.html` — layout and game structure
- `styles.css` — styling for the interface
- `script.js` — game logic for ingredients, orders, scoring, and timer

## Controls
- Click ingredients to add them to the current dish
- Click `Clear` to reset the dish
- Click `Serve` to submit the dish to the active order
- Click `Start Game` to restart

## Goal
Complete as many valid dishes as possible before the timer ends.
