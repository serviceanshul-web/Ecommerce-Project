// Faceted Filters & Sorting Component
import { store } from "../store.js";

const SIZES = ["XS", "S", "M", "L", "XL"];
const COLORS = [
  { name: "Charcoal", hex: "#2B2D42" },
  { name: "Alabaster", hex: "#F3EDE2" },
  { name: "Bone", hex: "#FAF8F5" },
  { name: "Camel", hex: "#C19A6B" },
  { name: "Sage", hex: "#9EADA2" },
  { name: "Mocha", hex: "#7E685A" },
  { name: "Indigo", hex: "#1C2D42" },
  { name: "Black", hex: "#111111" }
];

export function renderFilters(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <!-- Top Category Bar & Active Count -->
    <div class="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-3">
      <!-- Category Quick Filter Pills -->
      <div class="category-pills-bar flex-grow-1" id="category-pills-bar">
        <button class="category-pill-btn active" data-category="All">All Curations</button>
        <button class="category-pill-btn" data-category="Outerwear">Outerwear</button>
        <button class="category-pill-btn" data-category="Knitwear">Knitwear</button>
        <button class="category-pill-btn" data-category="Tops">Tops</button>
        <button class="category-pill-btn" data-category="Bottoms">Bottoms</button>
        <button class="category-pill-btn" data-category="Accessories">Accessories</button>
      </div>

      <!-- Sort Dropdown & Mobile Filter Button -->
      <div class="d-flex align-items-center gap-2 ms-auto">
        <button class="btn btn-outline-secondary d-lg-none btn-sm px-3" data-bs-toggle="offcanvas" data-bs-target="#mobileFilterDrawer">
          <i class="bi bi-funnel"></i> Filters
        </button>

        <div class="d-flex align-items-center gap-2">
          <label for="catalog-sort-select" class="text-muted small text-nowrap d-none d-sm-inline">Sort by:</label>
          <select class="form-select form-select-sm bg-dark text-light border-secondary" id="catalog-sort-select" style="min-width: 150px; border-radius: 999px;">
            <option value="featured">Featured Curations</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>
    </div>
  `;

  setupFilterEvents();
}

export function renderSidebarFilters(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="filter-card">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h5 class="filter-heading m-0">Refine Curations</h5>
        <button class="btn btn-link btn-sm text-decoration-none text-muted p-0" id="btn-reset-filters">
          Clear All
        </button>
      </div>

      <!-- Price Range Slider -->
      <div class="mb-4">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <span class="small text-secondary fw-semibold">Max Investment</span>
          <span class="small fw-bold text-warning" id="price-slider-val">$600</span>
        </div>
        <input type="range" class="form-range" id="price-slider" min="50" max="600" step="25" value="600">
        <div class="d-flex justify-content-between text-muted" style="font-size: 0.72rem;">
          <span>$50</span>
          <span>$600+</span>
        </div>
      </div>

      <hr class="border-secondary my-3 opacity-25">

      <!-- Size Filter -->
      <div class="mb-4">
        <span class="small text-secondary fw-semibold d-block mb-2">Available Size</span>
        <div class="size-chips-grid" id="sidebar-size-chips">
          ${SIZES.map(s => `
            <button class="size-chip" data-size="${s}">${s}</button>
          `).join("")}
        </div>
      </div>

      <hr class="border-secondary my-3 opacity-25">

      <!-- Color Swatches Filter -->
      <div class="mb-4">
        <span class="small text-secondary fw-semibold d-block mb-2">Color Palette</span>
        <div class="d-flex flex-wrap gap-2" id="sidebar-color-swatches">
          ${COLORS.map(c => `
            <span 
              class="color-swatch-chip" 
              data-color="${c.name}" 
              title="${c.name}" 
              style="background-color: ${c.hex};"
            ></span>
          `).join("")}
        </div>
      </div>

      <hr class="border-secondary my-3 opacity-25">

      <!-- In Stock Toggle -->
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="stock-toggle">
        <label class="form-check-label small text-secondary fw-semibold" for="stock-toggle">
          Ready to Ship (In Stock)
        </label>
      </div>
    </div>
  `;

  setupSidebarEvents();
}

function setupFilterEvents() {
  // Category Pills
  const pills = document.querySelectorAll(".category-pill-btn");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const cat = pill.getAttribute("data-category");
      store.setFilter("category", cat);
    });
  });

  // Sort Select
  const sortSelect = document.getElementById("catalog-sort-select");
  sortSelect?.addEventListener("change", (e) => {
    store.setFilter("sortOption", e.target.value);
  });
}

function setupSidebarEvents() {
  // Price Slider
  const slider = document.getElementById("price-slider");
  const sliderVal = document.getElementById("price-slider-val");
  slider?.addEventListener("input", (e) => {
    const val = Number(e.target.value);
    if (sliderVal) sliderVal.textContent = `$${val}`;
    store.setFilter("maxPrice", val);
  });

  // Size Chips
  const sizeChips = document.querySelectorAll("#sidebar-size-chips .size-chip");
  sizeChips.forEach(chip => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("active");
      store.toggleSizeFilter(chip.getAttribute("data-size"));
    });
  });

  // Color Swatches
  const colorSwatches = document.querySelectorAll("#sidebar-color-swatches .color-swatch-chip");
  colorSwatches.forEach(swatch => {
    swatch.addEventListener("click", () => {
      swatch.classList.toggle("active");
      store.toggleColorFilter(swatch.getAttribute("data-color"));
    });
  });

  // Stock Toggle
  const stockToggle = document.getElementById("stock-toggle");
  stockToggle?.addEventListener("change", (e) => {
    store.setFilter("inStockOnly", e.target.checked);
  });

  // Reset Filters
  const resetBtn = document.getElementById("btn-reset-filters");
  resetBtn?.addEventListener("click", () => {
    store.resetFilters();
    // Reset inputs
    if (slider) {
      slider.value = 600;
      if (sliderVal) sliderVal.textContent = "$600";
    }
    sizeChips.forEach(c => c.classList.remove("active"));
    colorSwatches.forEach(s => s.classList.remove("active"));
    if (stockToggle) stockToggle.checked = false;

    // Reset pills
    const pills = document.querySelectorAll(".category-pill-btn");
    pills.forEach(p => p.classList.toggle("active", p.getAttribute("data-category") === "All"));
  });
}
