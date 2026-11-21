# Student Laptop Finder

**SW302 - User Interface Development, Assignment 2**    
**GitHub Repository:** https://github.com/AHM575/Student-Laptop-Finder

This website helps students look through laptop models, check their specifications, save favorites, and compare up to four laptops. The laptop information is loaded from `data/laptops.json`. Favorites and the selected theme are saved in the browser.

## Install and Build

Install the project dependencies:

```bash
npm install
```

Build the CSS:

```bash
npm run build
```

To rebuild the CSS automatically while editing, run:

```bash
npm run watch
```

## Run the Website

Open the project folder in VS Code and start Live Server from `index.html`.

A local server is needed because the app loads the JSON file using `fetch()`.

## Pages

- `index.html` - Home page and laptop statistics.
- `laptops.html` - Laptop list, search, filters, and sorting.
- `details.html?id=1` - Details for one laptop.
- `favorites.html` - Saved laptops and price summary.
- `compare.html` - Compare two to four saved laptops.

## Main JavaScript Files

- `api.js` - Loads the laptop data.
- `storage.js` - Saves favorites, comparison choices, and the theme.
- `ui.js` - Builds the shared header, footer, and laptop cards.
- `compare.js` - Creates the comparison table.
- The other JavaScript files control their respective pages.

## Technologies Used

- HTML
- JavaScript (ES Modules)
- Tailwind CSS 4
- LocalStorage
- JSON and Fetch API

The project also uses the Tailwind Forms and Typography plugins and supports light and dark themes.

## Laptop Images

The `assets` folder contains `laptop-1.jpg` through `laptop-22.jpg`.