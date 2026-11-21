# Student Laptop Finder

SW302 - User Interface Development, Assignment 2  
Student: Ahmed Ibrahim  
GitHub: Add your repository link here before submission.

This website helps students look through laptop models, check their specifications, save favorites and compare up to four laptops. The laptop information is loaded from `data/laptops.json`. Favorites and the selected theme are saved in the browser.

## Install and build

```bash
npm install
npm run build
```

To rebuild the CSS while editing, run:

```bash
npm run watch
```

## Run the website

Open the project folder in VS Code and start Live Server from `index.html`. A local server is needed because the app loads the JSON file with `fetch()`.

## Pages

- `index.html` - home page and laptop statistics
- `laptops.html` - laptop list, search, filters and sorting
- `details.html?id=1` - details for one laptop
- `favorites.html` - saved laptops and price summary
- `compare.html` - compare two to four saved laptops

## Main JavaScript files

- `api.js` loads the laptop data.
- `storage.js` saves favorites, comparison choices and the theme.
- `ui.js` builds the shared header, footer and laptop cards.
- `compare.js` creates the comparison table.
- The other files control their own pages.

The project uses Tailwind CSS 4, the Forms and Typography plugins, and two color themes.

## Laptop images

The `assets` folder contains `laptop-1.jpg` through `laptop-22.jpg`.
