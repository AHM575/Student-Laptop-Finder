import { loadLaptops, findLaptop } from "./api.js";
import { setupLayout, showEmpty, showError, formatPrice, refreshFavCount } from "./ui.js";
import { isFavorite, toggleFavorite, getCompare, toggleCompare } from "./storage.js";

setupLayout("details");

const detailsBox = document.getElementById("details");
const backLink = { href: "laptops.html", label: "Back to the catalogue" };

function showLaptop(laptop) {
  document.title = laptop.name + " | Student Laptop Finder";

  const specifications = [
    ["ID", laptop.id],
    ["Name", laptop.name],
    ["Brand", laptop.brand],
    ["Category", laptop.category],
    ["Price", formatPrice(laptop.price)],
    ["CPU", laptop.cpu],
    ["RAM", laptop.ramGB + " GB"],
    ["Storage", laptop.storageGB + " GB"],
    ["Battery life", laptop.batteryHours + " hours"],
    ["Weight", laptop.weightKg + " kg"],
    ["Screen size", laptop.screenInches + " inches"],
  ];

  const tableRows = specifications
    .map(([label, value]) => `
      <tr class="odd:bg-bg">
        <th scope="row" class="w-2/5 px-4 py-3 text-left font-semibold">${label}</th>
        <td class="px-4 py-3">${value}</td>
      </tr>`)
    .join("");

  detailsBox.innerHTML = `
    <a href="laptops.html" class="text-sm font-semibold text-accent hover:underline">&larr; Back to laptops</a>
    <div class="mt-4 grid gap-8 md:grid-cols-2">
      <div class="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-surface">
        <span class="placeholder absolute inset-0 hidden items-center justify-center text-lg text-muted">No image</span>
        <img src="${laptop.image}" alt="${laptop.name}" class="h-full w-full object-contain p-4">
      </div>
      <div class="space-y-4">
        <p class="text-sm font-semibold uppercase tracking-wide text-muted">${laptop.brand} &middot; ${laptop.category}</p>
        <h1 class="text-3xl font-extrabold">${laptop.name}</h1>
        <p class="text-3xl font-bold text-accent">${formatPrice(laptop.price)}</p>
        <div class="prose prose-lg max-w-none"><p>${laptop.description}</p></div>
        <div class="flex flex-wrap gap-3">
          <button id="fav-btn" type="button" class="btn-action"></button>
          <button id="compare-btn" type="button" class="btn-outline"></button>
        </div>
        <p id="action-msg" role="status" class="text-sm font-semibold text-accent"></p>
      </div>
    </div>
    <section class="mt-10">
      <h2 class="mb-4 text-2xl font-bold">Full specifications</h2>
      <div class="overflow-x-auto rounded-xl border border-border bg-surface">
        <table class="w-full text-sm"><tbody>${tableRows}</tbody></table>
      </div>
    </section>`;

  const image = detailsBox.querySelector("img");
  image.addEventListener("error", () => {
    image.classList.add("hidden");
    const placeholder = detailsBox.querySelector(".placeholder");
    placeholder.classList.remove("hidden");
    placeholder.classList.add("flex");
  });

  const favoriteButton = document.getElementById("fav-btn");
  const compareButton = document.getElementById("compare-btn");
  const message = document.getElementById("action-msg");

  function updateButtons() {
    favoriteButton.textContent = isFavorite(laptop.id)
      ? "Remove from favorites"
      : "Add to favorites";
    compareButton.textContent = getCompare().includes(laptop.id)
      ? "Remove from comparison"
      : "Add to comparison";
    refreshFavCount();
  }

  favoriteButton.addEventListener("click", () => {
    message.textContent = "";
    toggleFavorite(laptop.id);
    updateButtons();
  });

  compareButton.addEventListener("click", () => {
    message.textContent = "";
    const result = toggleCompare(laptop.id);

    if (!result.ok) {
      message.textContent = result.message;
    } else if (!isFavorite(laptop.id)) {
      toggleFavorite(laptop.id);
      message.textContent = "Added to favorites and comparison.";
    }

    updateButtons();
  });

  updateButtons();
}

async function init() {
  const laptopId = new URLSearchParams(window.location.search).get("id");

  if (!laptopId) {
    showEmpty(detailsBox, "No laptop was selected. Choose one from the catalogue.", backLink);
    return;
  }

  detailsBox.innerHTML = `
    <div class="grid animate-pulse gap-8 md:grid-cols-2" aria-hidden="true">
      <div class="aspect-[4/3] rounded-xl bg-border"></div>
      <div class="space-y-4">
        <div class="h-4 w-1/4 rounded bg-border"></div>
        <div class="h-8 w-3/4 rounded bg-border"></div>
        <div class="h-8 w-1/3 rounded bg-border"></div>
        <div class="h-24 rounded bg-border"></div>
      </div>
    </div>`;

  try {
    const laptops = await loadLaptops();
    const laptop = findLaptop(laptops, Number(laptopId));

    if (laptop) {
      showLaptop(laptop);
    } else {
      showEmpty(detailsBox, "We could not find that laptop. Please choose another one.", backLink);
    }
  } catch (error) {
    showError(detailsBox, "Laptop data could not be loaded. Please run the website with Live Server.");
  }
}

init();
