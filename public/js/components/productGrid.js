// Product Grid & Card Rendering Component
import { store } from "../store.js";
import { api } from "../api.js";

export async function renderProductGrid(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Show skeleton loader
  container.innerHTML = `
    <div class="row g-4">
      ${Array.from({ length: 6 }).map(() => `
        <div class="col-12 col-sm-6 col-lg-4">
          <div class="product-card placeholder-glow p-3">
            <div class="placeholder rounded w-100" style="padding-top: 130%;"></div>
            <div class="placeholder col-6 mt-3"></div>
            <div class="placeholder col-8 mt-2"></div>
            <div class="placeholder col-4 mt-2"></div>
          </div>
        </div>
      `).join("")}
    </div>
  `;

  // Fetch products matching current filters
  const products = await api.getProducts(store.filters);

  if (products.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5">
        <div class="mb-3 text-muted"><i class="bi bi-search display-3"></i></div>
        <h4 class="font-editorial text-light">No pieces match your criteria</h4>
        <p class="text-muted">Try adjusting your filters or expanding your price tolerance.</p>
        <button class="btn btn-outline-secondary btn-sm rounded-pill px-4 mt-2" id="grid-reset-btn">
          Reset Filters
        </button>
      </div>
    `;

    document.getElementById("grid-reset-btn")?.addEventListener("click", () => {
      store.resetFilters();
    });
    return;
  }

  container.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3 text-muted small">
      <span>Showing <strong class="text-light">${products.length}</strong> curated pieces</span>
    </div>
    <div class="row g-4" id="products-row">
      ${products.map(product => renderProductCardHtml(product)).join("")}
    </div>
  `;

  attachCardEvents(container, products);
}

function renderProductCardHtml(p) {
  const isWish = store.isInWishlist(p.id);
  const discountPercent = p.originalPrice
    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
    : null;

  return `
    <div class="col-12 col-sm-6 col-lg-4">
      <article class="product-card" data-product-id="${p.id}">
        <!-- Image Container with Dual Image Hover -->
        <div class="product-image-container" data-action="open-detail">
          <!-- Floating Badges -->
          <div class="card-badges-pos">
            ${p.tags.map(tag => {
              let tagClass = "tag-bestseller";
              if (tag === "New Drop") tagClass = "tag-new-drop";
              if (tag === "Limited Edition") tagClass = "tag-limited";
              return `<span class="badge-tag-pill ${tagClass}">${tag}</span>`;
            }).join("")}
            ${discountPercent ? `<span class="badge-tag-pill tag-sale">-${discountPercent}%</span>` : ""}
          </div>

          <!-- Wishlist Heart Button -->
          <button 
            type="button" 
            class="btn-wishlist-toggle ${isWish ? "active" : ""}" 
            data-action="toggle-wishlist"
            data-product-id="${p.id}"
            aria-label="Add to Wishlist"
            title="${isWish ? "Remove from Wishlist" : "Save to Wishlist"}"
          >
            <i class="bi ${isWish ? "bi-heart-fill text-danger" : "bi-heart"}"></i>
          </button>

          <!-- Dual Images -->
          <img 
            src="${p.images.front}" 
            alt="${p.name}" 
            class="product-img product-img-front" 
            loading="lazy"
          />
          <img 
            src="${p.images.model || p.images.front}" 
            alt="${p.name} Model View" 
            class="product-img product-img-model" 
            loading="lazy"
          />

          <!-- Quick View Hover Bar -->
          <div class="quick-view-overlay-btn" data-action="open-quick-view">
            <i class="bi bi-eye me-1"></i> Quick View
          </div>
        </div>

        <!-- Product Card Body -->
        <div class="product-card-body">
          <div class="product-category-sub">${p.category}</div>
          <h3 class="product-title-text" data-action="open-detail" title="${p.name}">
            ${p.name}
          </h3>

          <div class="product-price-box">
            <span class="price-current">$${p.price}</span>
            ${p.originalPrice ? `<span class="price-original">$${p.originalPrice}</span>` : ""}
            ${discountPercent ? `<span class="price-discount-percent">Save $${p.originalPrice - p.price}</span>` : ""}
          </div>

          <!-- Rating & Color Swatches -->
          <div class="card-footer-meta">
            <div class="star-rating-box">
              <i class="bi bi-star-fill"></i>
              <span class="fw-bold">${p.rating.toFixed(1)}</span>
              <span class="rating-count">(${p.reviewCount})</span>
            </div>

            <div class="d-flex align-items-center gap-1">
              ${p.colors.map(c => `
                <span 
                  class="rounded-circle d-inline-block" 
                  style="width: 12px; height: 12px; background-color: ${c.hex}; border: 1px solid rgba(255,255,255,0.3);"
                  title="${c.name}"
                ></span>
              `).join("")}
            </div>
          </div>
        </div>
      </article>
    </div>
  `;
}

function attachCardEvents(container, products) {
  // Wishlist toggle listener
  const wishBtns = container.querySelectorAll("[data-action='toggle-wishlist']");
  wishBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const pId = btn.getAttribute("data-product-id");
      store.toggleWishlist(pId);
      const isNowWish = store.isInWishlist(pId);
      btn.classList.toggle("active", isNowWish);
      const icon = btn.querySelector("i");
      if (icon) {
        icon.className = `bi ${isNowWish ? "bi-heart-fill text-danger" : "bi-heart"}`;
      }
    });
  });

  // Open Detail / Quick-View
  const cards = container.querySelectorAll(".product-card");
  cards.forEach(card => {
    const pId = card.getAttribute("data-product-id");
    const product = products.find(p => p.id === pId);
    if (!product) return;

    card.querySelectorAll("[data-action='open-detail'], [data-action='open-quick-view']").forEach(el => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        store.emit("store:open-pdp", { product });
      });
    });
  });
}
