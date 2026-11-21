const FAV_KEY = "lf_favorites";
const COMPARE_KEY = "lf_compare";
const THEME_KEY = "lf_theme";

export const MAX_COMPARE = 4;

const read = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export function getFavorites() {
  const favorites = read(FAV_KEY, []);
  return Array.isArray(favorites) ? [...new Set(favorites)] : [];
}

export const isFavorite = (id) => getFavorites().includes(id);

export function toggleFavorite(id) {
  let favorites = getFavorites();

  if (favorites.includes(id)) {
    favorites = favorites.filter((item) => item !== id);
    write(COMPARE_KEY, getCompare().filter((item) => item !== id));
  } else {
    favorites.push(id);
  }

  write(FAV_KEY, favorites);
  return favorites.includes(id);
}

export function clearFavorites() {
  write(FAV_KEY, []);
  write(COMPARE_KEY, []);
}

export function getCompare() {
  const favorites = getFavorites();
  const compareList = read(COMPARE_KEY, []);

  if (!Array.isArray(compareList)) return [];
  return [...new Set(compareList)].filter((id) => favorites.includes(id));
}

export function toggleCompare(id) {
  const compareList = getCompare();

  if (compareList.includes(id)) {
    write(COMPARE_KEY, compareList.filter((item) => item !== id));
    return { ok: true };
  }

  if (compareList.length >= MAX_COMPARE) {
    return {
      ok: false,
      message: "You can compare up to 4 laptops. Remove one first to add another.",
    };
  }

  compareList.push(id);
  write(COMPARE_KEY, compareList);
  return { ok: true };
}

export function getTheme() {
  const theme = read(THEME_KEY, "battery");
  return theme === "performance" ? "performance" : "battery";
}

// Save the theme so it stays when the user opens another page.
export const saveTheme = (theme) => write(THEME_KEY, theme);
