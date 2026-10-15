// Product Detail View (PDP) & Quick-View Modal Component
import { store } from "../store.js";

export function initProductModal() {
  let modalEl = document.getElementById("productModal");
  if (!modalEl) {
    modalEl = document.createElement("div");
    modalEl.id = "productModal";
    modalEl.className = "modal fade";
    modalEl.tabIndex = -1;
    modalEl.setAttribute("aria-hidden", "true");
    document.body.appendChild(modalEl);
  }

  // Listen for 'store:open-pdp'
  window.addEventListener("store:open-pdp", (e) => {
    const { product } = e.detail;
    if (product) {
      renderModalContent(modalEl, product);
      if (window.bootstrap) {
        const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
        bsModal.show();
      }
    }
  });
}

function renderModalContent(modalEl, p) {
  let activeColor = p.colors[0].name;
  let activeImage = p.colors[0].image || p.images.front;

  // Find first size with stock > 0
  const firstAvailableSize = p.sizes.find(s => s.stock > 0);
  let activeSize = firstAvailableSize ? firstAvailableSize.size : p.sizes[0].size;
  let activeStock = firstAvailableSize ? firstAvailableSize.stock : p.sizes[0].stock;
  let quantity = 1;

  const isWish = store.isInWishlist(p.id);
  const discountPercent = p.originalPrice
    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
    : null;

  modalEl.innerHTML = `
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content modal-content-atelier">
        <div class="modal-header border-0 pb-0">
          <span class="text-muted small text-uppercase letter-spacing-1">${p.category} • SKU: ${p.sku}</span>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body p-4 p-lg-5 pt-2">
          <div class="row g-4 g-lg-5">
            <!-- Left: Gallery Column -->
            <div class="col-12 col-lg-6">
              <div class="position-relative rounded-3 overflow-hidden bg-dark shadow-elevated">
                <img 
                  id="pdp-main-image" 
                  src="${activeImage}" 
                  alt="${p.name}" 
                  class="w-100 object-fit-cover" 
                  style="aspect-ratio: 3/4; transition: opacity 0.3s ease;"
                />

                <div class="card-badges-pos">
                  ${p.tags.map(t => `<span class="badge-tag-pill tag-bestseller">${t}</span>`).join("")}
                  ${discountPercent ? `<span class="badge-tag-pill tag-sale">-${discountPercent}%</span>` : ""}
                </div>
              </div>

              <!-- Thumbnails -->
              <div class="gallery-thumbnail-strip mt-3" id="pdp-thumbnails">
                ${p.images.gallery.map((img, idx) => `
                  <img 
                    src="${img}" 
                    alt="${p.name} angle ${idx + 1}" 
                    class="gallery-thumb-item ${idx === 0 ? "active" : ""}" 
                    data-img-src="${img}"
                  />
                `).join("")}
              </div>
            </div>

            <!-- Right: Product Information & Purchase Matrix -->
            <div class="col-12 col-lg-6 d-flex flex-column">
              <div class="d-flex align-items-start justify-content-between mb-2">
                <h2 class="font-editorial text-light mb-1">${p.name}</h2>
                <button 
                  class="btn-icon-action ms-3 flex-shrink-0 ${isWish ? "text-danger" : ""}" 
                  id="pdp-wishlist-toggle"
                  title="Toggle Wishlist"
                >
                  <i class="bi ${isWish ? "bi-heart-fill text-danger" : "bi-heart"} fs-5"></i>
                </button>
              </div>

              <p class="text-secondary mb-3">${p.tagline}</p>

              <!-- Price Box -->
              <div class="d-flex align-items-baseline gap-3 mb-3">
                <span class="display-6 fw-bold text-light">$${p.price}</span>
                ${p.originalPrice ? `<span class="fs-4 text-muted text-decoration-line-through">$${p.originalPrice}</span>` : ""}
                ${discountPercent ? `<span class="badge bg-danger rounded-pill px-3 py-2">Save $${p.originalPrice - p.price}</span>` : ""}
              </div>

              <!-- Star Rating -->
              <div class="d-flex align-items-center gap-2 mb-4 text-warning small">
                <div>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                </div>
                <span class="text-light fw-bold">${p.rating.toFixed(1)}</span>
                <span class="text-muted">(${p.reviewCount} verified client reviews)</span>
              </div>

              <hr class="border-secondary opacity-25 my-2">

              <!-- Color Selection -->
              <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="small text-secondary fw-semibold">Color: <strong class="text-light" id="pdp-color-name">${activeColor}</strong></span>
                </div>
                <div class="d-flex gap-3" id="pdp-color-list">
                  ${p.colors.map(c => `
                    <button 
                      type="button"
                      class="color-swatch-chip ${c.name === activeColor ? "active" : ""}" 
                      data-color-name="${c.name}"
                      data-color-image="${c.image || p.images.front}"
                      title="${c.name}" 
                      style="background-color: ${c.hex}; width: 34px; height: 34px;"
                    ></button>
                  `).join("")}
                </div>
              </div>

              <!-- Size Selection & Size Guide Trigger -->
              <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="small text-secondary fw-semibold">Select Size</span>
                  <button type="button" class="btn btn-link btn-sm text-warning p-0 text-decoration-none" id="pdp-open-sizeguide">
                    <i class="bi bi-rulers"></i> Size & Fit Guide
                  </button>
                </div>
                <div class="size-chips-grid" id="pdp-size-list">
                  ${p.sizes.map(s => `
                    <button 
                      type="button"
                      class="size-chip ${s.size === activeSize ? "active" : ""} ${s.stock === 0 ? "opacity-25" : ""}" 
                      data-size="${s.size}"
                      data-stock="${s.stock}"
                      ${s.stock === 0 ? "disabled title='Out of stock'" : ""}
                      style="width: 52px; height: 44px; font-size: 0.9rem;"
                    >
                      ${s.size}
                    </button>
                  `).join("")}
                </div>
                <div class="mt-2" id="pdp-stock-status">
                  ${getStockBadgeHtml(activeStock)}
                </div>
              </div>

              <!-- Quantity & Add to Bag -->
              <div class="d-flex align-items-center gap-3 mb-4">
                <div class="qty-stepper-box py-1 px-2">
                  <button type="button" class="qty-step-btn" id="pdp-qty-minus"><i class="bi bi-dash"></i></button>
                  <span class="qty-val-display px-2" id="pdp-qty-display">1</span>
                  <button type="button" class="qty-step-btn" id="pdp-qty-plus"><i class="bi bi-plus"></i></button>
                </div>

                <button 
                  type="button" 
                  class="btn-gold-luxury flex-grow-1 justify-content-center py-3" 
                  id="pdp-add-to-cart-btn"
                  ${activeStock === 0 ? "disabled" : ""}
                >
                  <i class="bi bi-bag-plus"></i> Add To Shopping Bag
                </button>
              </div>

              <!-- Editorial Accordion -->
              <div class="accordion accordion-atelier mt-auto" id="pdpAccordion">
                <!-- Item 1: Details & Tailoring -->
                <div class="accordion-item">
                  <h2 class="accordion-header">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#acc-details">
                      Details & Silhouette
                    </button>
                  </h2>
                  <div id="acc-details" class="accordion-collapse collapse show" data-bs-parent="#pdpAccordion">
                    <div class="accordion-body">
                      <p class="mb-2">${p.description}</p>
                      <ul class="mb-0 ps-3">
                        ${p.details.map(d => `<li>${d}</li>`).join("")}
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Item 2: Composition & Care -->
                <div class="accordion-item">
                  <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#acc-care">
                      Composition & Care
                    </button>
                  </h2>
                  <div id="acc-care" class="accordion-collapse collapse" data-bs-parent="#pdpAccordion">
                    <div class="accordion-body">
                      <p class="fw-semibold text-light mb-1">${p.composition}</p>
                      <ul class="mb-0 ps-3">
                        ${p.careInstructions.map(c => `<li>${c}</li>`).join("")}
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Item 3: Shipping & Returns -->
                <div class="accordion-item">
                  <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#acc-ship">
                      Complimentary Delivery & Returns
                    </button>
                  </h2>
                  <div id="acc-ship" class="accordion-collapse collapse" data-bs-parent="#pdpAccordion">
                    <div class="accordion-body">
                      Free carbon-neutral courier delivery on all orders over $250. Orders placed before 2 PM EST are dispatched same-day in biodegradable signature packaging. 30-day effortless returns with prepaid doorstep collection.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  setupPdpInteractions(modalEl, p, {
    getActiveColor: () => activeColor,
    setActiveColor: (c) => { activeColor = c; },
    getActiveSize: () => activeSize,
    setActiveSize: (s) => { activeSize = s; },
    getActiveStock: () => activeStock,
    setActiveStock: (stk) => { activeStock = stk; },
    getQuantity: () => quantity,
    setQuantity: (q) => { quantity = q; }
  });
}

function getStockBadgeHtml(stock) {
  if (stock <= 0) {
    return `<span class="badge bg-danger"><i class="bi bi-x-circle"></i> Currently Out of Stock</span>`;
  }
  if (stock <= 3) {
    return `<span class="badge bg-warning text-dark"><i class="bi bi-exclamation-triangle"></i> Only ${stock} pieces remaining</span>`;
  }
  return `<span class="badge bg-success-subtle text-success"><i class="bi bi-check-circle"></i> In Stock & Ready to Dispatch</span>`;
}

function setupPdpInteractions(modalEl, p, state) {
  const mainImage = modalEl.querySelector("#pdp-main-image");
  const colorNameDisplay = modalEl.querySelector("#pdp-color-name");
  const stockDisplay = modalEl.querySelector("#pdp-stock-status");
  const qtyDisplay = modalEl.querySelector("#pdp-qty-display");
  const addBtn = modalEl.querySelector("#pdp-add-to-cart-btn");

  // Thumbnail click
  modalEl.querySelectorAll(".gallery-thumb-item").forEach(thumb => {
    thumb.addEventListener("click", () => {
      modalEl.querySelectorAll(".gallery-thumb-item").forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
      const src = thumb.getAttribute("data-img-src");
      if (mainImage && src) {
        mainImage.style.opacity = "0.4";
        setTimeout(() => {
          mainImage.src = src;
          mainImage.style.opacity = "1";
        }, 150);
      }
    });
  });

  // Color Swatch click
  modalEl.querySelectorAll("#pdp-color-list .color-swatch-chip").forEach(swatch => {
    swatch.addEventListener("click", () => {
      modalEl.querySelectorAll("#pdp-color-list .color-swatch-chip").forEach(s => s.classList.remove("active"));
      swatch.classList.add("active");
      const cName = swatch.getAttribute("data-color-name");
      const cImg = swatch.getAttribute("data-color-image");
      state.setActiveColor(cName);
      if (colorNameDisplay) colorNameDisplay.textContent = cName;
      if (mainImage && cImg) {
        mainImage.style.opacity = "0.4";
        setTimeout(() => {
          mainImage.src = cImg;
          mainImage.style.opacity = "1";
        }, 150);
      }
    });
  });

  // Size click
  modalEl.querySelectorAll("#pdp-size-list .size-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const sizeVal = chip.getAttribute("data-size");
      const stockVal = Number(chip.getAttribute("data-stock"));
      if (stockVal <= 0) return;

      modalEl.querySelectorAll("#pdp-size-list .size-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");

      state.setActiveSize(sizeVal);
      state.setActiveStock(stockVal);
      state.setQuantity(1);
      if (qtyDisplay) qtyDisplay.textContent = "1";

      if (stockDisplay) {
        stockDisplay.innerHTML = getStockBadgeHtml(stockVal);
      }

      if (addBtn) {
        addBtn.disabled = stockVal <= 0;
      }
    });
  });

  // Quantity Stepper
  modalEl.querySelector("#pdp-qty-minus")?.addEventListener("click", () => {
    const cur = state.getQuantity();
    if (cur > 1) {
      state.setQuantity(cur - 1);
      if (qtyDisplay) qtyDisplay.textContent = state.getQuantity();
    }
  });

  modalEl.querySelector("#pdp-qty-plus")?.addEventListener("click", () => {
    const cur = state.getQuantity();
    const max = state.getActiveStock();
    if (cur < max) {
      state.setQuantity(cur + 1);
      if (qtyDisplay) qtyDisplay.textContent = state.getQuantity();
    } else {
      store.emit("store:toast", {
        message: `Maximum stock limit of ${max} reached for size ${state.getActiveSize()}.`,
        type: "warning"
      });
    }
  });

  // Add To Cart Button
  addBtn?.addEventListener("click", () => {
    store.addToCart(p, state.getActiveColor(), state.getActiveSize(), state.getQuantity());

    // Close PDP modal and open Cart Drawer for seamless conversion
    if (window.bootstrap) {
      const bsModal = bootstrap.Modal.getInstance(modalEl);
      bsModal?.hide();

      setTimeout(() => {
        const cartEl = document.getElementById("cartDrawer");
        if (cartEl) {
          const bsDrawer = bootstrap.Offcanvas.getOrCreateInstance(cartEl);
          bsDrawer.show();
        }
      }, 350);
    }
  });

  // Wishlist toggle button
  const wishBtn = modalEl.querySelector("#pdp-wishlist-toggle");
  wishBtn?.addEventListener("click", () => {
    store.toggleWishlist(p.id);
    const isNowWish = store.isInWishlist(p.id);
    wishBtn.classList.toggle("text-danger", isNowWish);
    const icon = wishBtn.querySelector("i");
    if (icon) {
      icon.className = `bi ${isNowWish ? "bi-heart-fill text-danger" : "bi-heart"} fs-5`;
    }
  });

  // Size Guide trigger
  modalEl.querySelector("#pdp-open-sizeguide")?.addEventListener("click", () => {
    const guideEl = document.getElementById("sizeGuideModal");
    if (guideEl && window.bootstrap) {
      const guideModal = bootstrap.Modal.getOrCreateInstance(guideEl);
      guideModal.show();
    }
  });
}
