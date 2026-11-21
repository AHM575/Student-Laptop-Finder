import { loadLaptops } from "./api.js";
import { setupLayout, showCards, showLoading, showError, formatPrice } from "./ui.js";

setupLayout("laptops");

const grid = document.getElementById("laptop-grid");
const resultCount = document.getElementById("result-count");
const noResults = document.getElementById("no-results");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const priceRange = document.getElementById("max-price");
const priceLabel = document.getElementById("price-label");
const ramSelect = document.getElementById("min-ram");
const batterySelect = document.getElementById("min-battery");
const sortSelect = document.getElementById("sort");
const resetButton = document.getElementById("reset");

let allLaptops = [];

const sorters = {
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "battery-asc": (a, b) => a.batteryHours - b.batteryHours,
  "battery-desc": (a, b) => b.batteryHours - a.batteryHours,
  "weight-asc": (a, b) => a.weightKg - b.weightKg,
  "weight-desc": (a, b) => b.weightKg - a.weightKg,
};

function filterLaptops() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;
  const maxPrice = Number(priceRange.value);
  const minRam = Number(ramSelect.value);
  const minBattery = Number(batterySelect.value);

  return allLaptops.filter((laptop) => {
    const matchesSearch = laptop.name.toLowerCase().includes(searchTerm)
      || laptop.brand.toLowerCase().includes(searchTerm);
    const matchesCategory = category === "all" || laptop.category === category;

    return matchesSearch
      && matchesCategory
      && laptop.price <= maxPrice
      && laptop.ramGB >= minRam
      && laptop.batteryHours >= minBattery;
  });
}

function updateList() {
  priceLabel.textContent = formatPrice(Number(priceRange.value));

  let results = filterLaptops();
  const sortFunction = sorters[sortSelect.value];

  // Sort a copy so the original data order does not change.
  if (sortFunction) {
    results = [...results].sort(sortFunction);
  }

  resultCount.textContent = `Showing ${results.length} of ${allLaptops.length} laptops`;

  if (results.length === 0) {
    grid.innerHTML = "";
    noResults.classList.remove("hidden");
    return;
  }

  noResults.classList.add("hidden");
  showCards(grid, results);
}

function resetFilters() {
  searchInput.value = "";
  categorySelect.value = "all";
  priceRange.value = priceRange.max;
  ramSelect.value = "0";
  batterySelect.value = "0";
  sortSelect.value = "default";
  updateList();
}

async function init() {
  showLoading(grid, 6);

  try {
    allLaptops = await loadLaptops();
    const highestPrice = allLaptops.reduce(
      (highest, laptop) => Math.max(highest, laptop.price),
      0
    );

    priceRange.max = Math.ceil(highestPrice / 1000) * 1000;
    priceRange.value = priceRange.max;
    updateList();

    [searchInput, categorySelect, priceRange, ramSelect, batterySelect, sortSelect]
      .forEach((control) => {
        control.addEventListener("input", updateList);
        control.addEventListener("change", updateList);
      });

    resetButton.addEventListener("click", resetFilters);
  } catch (error) {
    resultCount.textContent = "";
    showError(grid, "Laptop data could not be loaded. Check the data folder and run the site with Live Server.");
  }
}

init();
