import { getTheme, saveTheme, getFavorites, isFavorite, toggleFavorite } from "./storage.js";

export const formatPrice = (price) => price.toLocaleString("en-US") + " EGP";

const themeNames = {
  battery: "Battery Saver Mode",
  performance: "Performance Mode",
};
const shortNames = {
  battery: "Battery Saver",
  performance: "Performance",
};

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

// Read the saved choice as soon as each page loads.
applyTheme(getTheme());

const navLinks = [
  ["index.html", "Home", "home"],
  ["laptops.html", "Laptops", "laptops"],
  ["favorites.html", "Favorites", "favorites"],
  ["compare.html", "Compare", "compare"],
];

export function refreshFavCount() {
  const total = getFavorites().length;
  document.querySelectorAll(".fav-count").forEach((badge) => {
    badge.textContent = total;
  });
}

function updateThemeButton() {
  const button = document.getElementById("theme-btn");
  const nextTheme = getTheme() === "battery" ? "performance" : "battery";
  button.textContent = shortNames[nextTheme];
  button.setAttribute("aria-label", "Switch to " + themeNames[nextTheme]);
}

export function setupLayout(activePage) {
  const makeLinks = (extraClasses) =>
    navLinks
      .map(([href, label, key]) => {
        const activeClass = key === activePage ? "text-accent font-bold" : "text-text";
        const badge = key === "favorites"
          ? `<span class="fav-count ml-1 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-text">0</span>`
          : "";
        return `<a href="${href}" class="${activeClass} ${extraClasses} transition duration-200 hover:text-accent">${label}${badge}</a>`;
      })
      .join("");

  document.getElementById("site-header").innerHTML = `
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
      <a href="index.html" class="text-lg font-bold text-accent">Laptop Finder</a>
      <nav class="hidden items-center gap-6 md:flex" aria-label="Main navigation">
        ${makeLinks("")}
      </nav>
      <div class="flex items-center gap-2">
        <button id="theme-btn" type="button" class="btn-action"></button>
        <button id="menu-btn" type="button" aria-label="Toggle menu" aria-expanded="false"
          class="rounded-lg border border-border px-3 py-2 transition duration-200 hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden">Menu</button>
      </div>
    </div>
    <div id="mobile-menu" class="hidden border-t border-border md:hidden">
      <nav class="mx-auto flex max-w-6xl flex-col px-4 py-2" aria-label="Mobile navigation">
        ${makeLinks("py-2")}
      </nav>
    </div>`;

  document.getElementById("site-footer").innerHTML = `
    <div class="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-muted">
      Student Laptop Finder &middot; Compare laptop prices and specifications before you choose &middot; Prices shown in EGP
    </div>`;

  const menuButton = document.getElementById("menu-btn");
  const menu = document.getElementById("mobile-menu");
  menuButton.addEventListener("click", () => {
    const isHidden = menu.classList.toggle("hidden");
    menuButton.setAttribute("aria-expanded", String(!isHidden));
  });

  updateThemeButton();
  document.getElementById("theme-btn").addEventListener("click", () => {
    const nextTheme = getTheme() === "battery" ? "performance" : "battery";
    saveTheme(nextTheme);
    applyTheme(nextTheme);
    updateThemeButton();
  });

  refreshFavCount();
}

function styleFavoriteButton(button, saved) {
  button.textContent = saved ? "Saved" : "Save";
  button.setAttribute("aria-pressed", String(saved));
  button.setAttribute("aria-label", saved ? "Remove from favorites" : "Add to favorites");
  button.classList.toggle("bg-accent", saved);
  button.classList.toggle("text-accent-text", saved);
  button.classList.toggle("border-accent", saved);
  button.classList.toggle("text-muted", !saved);
  button.classList.toggle("border-border", !saved);
}

export function makeCard(laptop, onFavoriteChange) {
  const card = document.createElement("article");
  const detailsUrl = `details?id=${laptop.id}`;
  card.className = "laptop-card";

  card.innerHTML = `
    <a href="${detailsUrl}" class="relative block aspect-[4/3] bg-border/40">
      <span class="placeholder absolute inset-0 hidden items-center justify-center text-sm text-muted">No image</span>
      <img src="${laptop.image}" alt="${laptop.name}" loading="lazy" class="h-full w-full object-contain p-3">
    </a>
    <div class="flex flex-1 flex-col gap-3 p-4">
      <div class="flex items-start justify-between gap-2">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-muted">${laptop.brand} &middot; ${laptop.category}</p>
          <h3 class="font-bold leading-snug"><a href="${detailsUrl}" class="hover:text-accent">${laptop.name}</a></h3>
        </div>
        <button type="button" class="fav-btn shrink-0 rounded-lg border px-3 py-1 text-sm font-semibold transition duration-200 hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"></button>
      </div>
      <p class="text-xl font-bold text-accent">${formatPrice(laptop.price)}</p>
      <ul class="grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-muted">
        <li class="col-span-2">CPU: ${laptop.cpu}</li>
        <li>RAM: ${laptop.ramGB} GB</li>
        <li>Storage: ${laptop.storageGB} GB</li>
        <li>Battery: ${laptop.batteryHours} h</li>
        <li>Weight: ${laptop.weightKg} kg</li>
      </ul>
      <a href="${detailsUrl}" class="btn-action mt-auto">View details</a>
    </div>`;

  const image = card.querySelector("img");
  image.addEventListener("error", () => {
    image.classList.add("hidden");
    const placeholder = card.querySelector(".placeholder");
    placeholder.classList.remove("hidden");
    placeholder.classList.add("flex");
  });

  const favoriteButton = card.querySelector(".fav-btn");
  styleFavoriteButton(favoriteButton, isFavorite(laptop.id));
  favoriteButton.addEventListener("click", () => {
    const saved = toggleFavorite(laptop.id);
    styleFavoriteButton(favoriteButton, saved);
    refreshFavCount();
    if (onFavoriteChange) onFavoriteChange();
  });

  return card;
}

export function showCards(container, laptops, onFavoriteChange) {
  container.innerHTML = "";
  container.append(...laptops.map((laptop) => makeCard(laptop, onFavoriteChange)));
}

export function showLoading(container, count = 6) {
  const skeleton = `
    <div class="laptop-card animate-pulse" aria-hidden="true">
      <div class="aspect-[4/3] bg-border"></div>
      <div class="space-y-3 p-4">
        <div class="h-3 w-1/3 rounded bg-border"></div>
        <div class="h-5 w-3/4 rounded bg-border"></div>
        <div class="h-6 w-1/2 rounded bg-border"></div>
        <div class="grid grid-cols-2 gap-2">
          <div class="h-4 rounded bg-border"></div>
          <div class="h-4 rounded bg-border"></div>
          <div class="h-4 rounded bg-border"></div>
          <div class="h-4 rounded bg-border"></div>
        </div>
        <div class="h-10 rounded-lg bg-border"></div>
      </div>
    </div>`;
  container.innerHTML = Array.from({ length: count }, () => skeleton).join("");
}

export function showEmpty(container, text, link) {
  container.innerHTML = `
    <div role="status" class="col-span-full rounded-lg border border-dashed border-border bg-surface p-8 text-center">
      <p class="mb-4 text-lg">${text}</p>
      ${link ? `<a href="${link.href}" class="btn-action">${link.label}</a>` : ""}
    </div>`;
}

export function showError(container, text) {
  container.innerHTML = `
    <div role="alert" class="col-span-full rounded-lg border border-red-500 bg-red-500/10 p-6 text-center">
      <p class="mb-1 text-lg font-bold">Something went wrong</p>
      <p class="mb-4">${text}</p>
      <button type="button" class="btn-action">Try again</button>
    </div>`;
  container.querySelector("button").addEventListener("click", () => location.reload());
}
