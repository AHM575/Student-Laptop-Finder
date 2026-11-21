let laptopCache = null;

export async function loadLaptops() {
  if (laptopCache) return laptopCache;

  try {
    const response = await fetch("data/laptops.json");
    if (!response.ok) {
      throw new Error("Request failed: " + response.status);
    }

    laptopCache = await response.json();
    return laptopCache;
  } catch (error) {
    console.error("Could not load laptop data:", error);
    throw error;
  }
}

export const findLaptop = (laptops, id) =>
  laptops.find((laptop) => laptop.id === id);
