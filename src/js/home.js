import { loadLaptops } from "./api.js";
import { setupLayout, formatPrice, showError } from "./ui.js";
import { getFavorites } from "./storage.js";

setupLayout("home");

const statsBox = document.getElementById("stats");

async function loadStats() {
  try {
    const laptops = await loadLaptops();

    const lowestPrice = laptops.reduce(
      (lowest, laptop) => Math.min(lowest, laptop.price),
      laptops[0].price
    );
    const longestBattery = laptops.reduce(
      (longest, laptop) => Math.max(longest, laptop.batteryHours),
      0
    );

    document.getElementById("stat-count").textContent = laptops.length;
    document.getElementById("stat-price").textContent = formatPrice(lowestPrice);
    document.getElementById("stat-battery").textContent = longestBattery + " h";
    document.getElementById("stat-favs").textContent = getFavorites().length;
  } catch (error) {
    showError(statsBox, "Laptop data could not be loaded. Please run the website with Live Server.");
  }
}

loadStats();
