import { formatPrice } from "./ui.js";

export const compareRows = [
  { key: "price", label: "Price", best: "min", format: formatPrice },
  { key: "category", label: "Category" },
  { key: "cpu", label: "CPU" },
  { key: "ramGB", label: "RAM", best: "max", format: (value) => value + " GB" },
  { key: "storageGB", label: "Storage", best: "max", format: (value) => value + " GB" },
  { key: "batteryHours", label: "Battery life", best: "max", format: (value) => value + " hours" },
  { key: "weightKg", label: "Weight", best: "min", format: (value) => value + " kg" },
  { key: "screenInches", label: "Screen size", format: (value) => value + " inches" },
];

// Price and weight should be lower. The other marked values should be higher.
export const getBest = (laptops, row) =>
  laptops.reduce(
    (best, laptop) =>
      row.best === "min"
        ? Math.min(best, laptop[row.key])
        : Math.max(best, laptop[row.key]),
    row.best === "min" ? Infinity : -Infinity
  );

export function makeCompareTable(laptops) {
  const headings = laptops
    .map(
      (laptop) => `
        <th scope="col" class="min-w-44 px-4 py-3 align-top">
          <a href="details?id=${laptop.id}"class="font-bold hover:text-accent">${laptop.name}</a>
          <span class="block text-xs font-normal text-muted">${laptop.brand}</span>
        </th>`
    )
    .join("");

  const rows = compareRows
    .map((row) => {
      const bestValue = row.best ? getBest(laptops, row) : null;
      const cells = laptops
        .map((laptop) => {
          const value = row.format ? row.format(laptop[row.key]) : laptop[row.key];
          const isBest = row.best && laptop[row.key] === bestValue;

          if (isBest) {
            return `<td class="bg-accent/25 px-4 py-3 font-bold">
              <span class="mr-1 text-xs font-semibold uppercase text-accent">Best</span>${value}
            </td>`;
          }
          return `<td class="px-4 py-3">${value}</td>`;
        })
        .join("");

      return `<tr class="border-t border-border">
        <th scope="row" class="sticky left-0 bg-surface px-4 py-3 text-left font-semibold">${row.label}</th>
        ${cells}
      </tr>`;
    })
    .join("");

  return `
    <div class="overflow-x-auto rounded-lg border border-border bg-surface">
      <table class="w-full min-w-[36rem] text-left text-sm">
        <thead>
          <tr>
            <th class="sticky left-0 bg-surface px-4 py-3"><span class="sr-only">Specification</span></th>
            ${headings}
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}
