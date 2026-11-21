import { loadLaptops } from "./api.js";
import { setupLayout, showEmpty, showError, formatPrice } from "./ui.js";
import { getFavorites, getCompare, toggleCompare, MAX_COMPARE } from "./storage.js";
import { makeCompareTable } from "./compare.js";

setupLayout("compare");

const picker = document.getElementById("picker");
const selectedCount = document.getElementById("selected-count");
const message = document.getElementById("compare-msg");
const tableBox = document.getElementById("table-box");

let favoriteLaptops = [];

function renderPicker() {
  const selected = getCompare();

  picker.innerHTML = favoriteLaptops
    .map((laptop) => {
      const isSelected = selected.includes(laptop.id);
      const buttonStyle = isSelected
        ? "border-accent bg-accent/25 ring-2 ring-accent"
        : "border-border bg-surface";

      return `
        <button type="button" data-id="${laptop.id}" aria-pressed="${isSelected}"
          class="${buttonStyle} rounded-xl border p-4 text-left transition duration-200 hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
          <span class="block text-xs font-semibold uppercase text-muted">${laptop.brand}</span>
          <span class="block font-bold">${laptop.name}</span>
          ${isSelected ? `<span class="block text-xs font-semibold text-accent">Selected</span>` : ""}
          <span class="block font-semibold text-accent">${formatPrice(laptop.price)}</span>
        </button>`;
    })
    .join("");

  selectedCount.textContent = `Selected ${selected.length} of ${MAX_COMPARE}`;
}

function renderTable() {
  const selectedIds = getCompare();
  const selectedLaptops = selectedIds
    .map((id) => favoriteLaptops.find((laptop) => laptop.id === id))
    .filter(Boolean);

  if (selectedLaptops.length < 2) {
    tableBox.innerHTML = `
      <p role="status" class="rounded-xl border border-dashed border-border bg-surface p-6 text-center">
        Select at least 2 laptops above to see the comparison.
      </p>`;
    return;
  }

  tableBox.innerHTML = makeCompareTable(selectedLaptops);
}

picker.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;

  const id = Number(button.dataset.id);
  const result = toggleCompare(id);
  message.textContent = result.ok ? "" : result.message;

  renderPicker();
  renderTable();

  const updatedButton = picker.querySelector(`[data-id="${id}"]`);
  if (updatedButton) updatedButton.focus();
});

async function init() {
  try {
    const laptops = await loadLaptops();
    const favoriteIds = getFavorites();
    favoriteLaptops = laptops.filter((laptop) => favoriteIds.includes(laptop.id));

    if (favoriteLaptops.length === 0) {
      selectedCount.textContent = "";
      showEmpty(picker, "You have no favorites yet. Save at least 2 laptops to compare them.", {
        href: "laptops.html",
        label: "Browse laptops",
      });
      return;
    }

    renderPicker();
    renderTable();
  } catch (error) {
    showError(picker, "Laptop data could not be loaded. Please run the website with Live Server.");
  }
}

init();
