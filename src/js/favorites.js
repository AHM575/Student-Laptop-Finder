import { loadLaptops } from "./api.js";
import { setupLayout, showCards, showError, formatPrice, refreshFavCount } from "./ui.js";
import { getFavorites, clearFavorites } from "./storage.js";

setupLayout("favorites");

const list = document.getElementById("fav-list");
const emptyBox = document.getElementById("empty");
const summary = document.getElementById("summary");
const clearButton = document.getElementById("clear-btn");

let allLaptops = [];

function renderFavorites() {
  const favoriteIds = getFavorites();
  const savedLaptops = allLaptops.filter((laptop) => favoriteIds.includes(laptop.id));

  if (savedLaptops.length === 0) {
    list.innerHTML = "";
    emptyBox.classList.remove("hidden");
    summary.classList.add("hidden");
    return;
  }

  emptyBox.classList.add("hidden");
  summary.classList.remove("hidden");

  const totalPrice = savedLaptops.reduce((total, laptop) => total + laptop.price, 0);
  const averagePrice = Math.round(totalPrice / savedLaptops.length);

  document.getElementById("fav-count").textContent = savedLaptops.length;
  document.getElementById("fav-total").textContent = formatPrice(totalPrice);
  document.getElementById("fav-average").textContent = formatPrice(averagePrice);

  showCards(list, savedLaptops, renderFavorites);
}

clearButton.addEventListener("click", () => {
  const shouldClear = confirm("Remove all laptops from your favorites?");
  if (!shouldClear) return;

  clearFavorites();
  refreshFavCount();
  renderFavorites();
});

async function init() {
  try {
    allLaptops = await loadLaptops();
    renderFavorites();
  } catch (error) {
    summary.classList.add("hidden");
    showError(list, "Laptop data could not be loaded. Please run the website with Live Server.");
  }
}

init();
