// Wishlist Modal Component
import { store } from "../store.js";
import { api } from "../api.js";

export function initWishlistModal() {
  let modalEl = document.getElementById("wishlistModal");
  if (!modalEl) {
    modalEl = document.createElement("div");
    modalEl.id = "wishlistModal";
    modalEl.className = "modal fade";
    modalEl.tabIndex = -1;
    modalEl.setAttribute("aria-hidden", "true");
    document.body.appendChild(modalEl);
  }

  const renderContent = async () => {
    const allProducts = await api.getProducts({});
    const wishIds = Array.from(store.wishlist);
    const wishProducts = allProducts.filter(p => wishIds.includes(p.id));

    modalEl.innerHTML = `
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content modal-content-atelier">
          <div class="modal-header border-0 pb-0">
            <div>
              <h4 class="font-editorial text-light mb-1">Your Curated Wishlist</h4>
              <p class="text-secondary small m-0">${wishProducts.length} saved pieces</p>
            </div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body p-4 p-lg-5">
            ${
              wishProducts.length === 0
                ? `
                  <div class="text-center py-5">
                    <div class="text-muted display-4 mb-3"><i class="bi bi-heart"></i></div>
                    <h5 class="font-editorial text-light">No pieces saved yet</h5>
                    <p class="text-muted small">Tap the heart on any garment to keep track of your favorites.</p>
                  </div>
                `
                : `
                  <div class="row g-3">
                    ${wishProducts.map(p => `
                      <div class="col-12 col-sm-6">
                        <div class="d-flex gap-3 p-3 rounded-3" style="background: var(--bg-card); border: 1px solid var(--border-subtle);">
                          <img src="${p.images.front}" alt="${p.name}" class="rounded-2 object-fit-cover" style="width: 75px; height: 95px;" />
                          <div class="d-flex flex-column flex-grow-1">
                            <h6 class="text-light mb-1 small fw-bold">${p.name}</h6>
                            <span class="text-muted small mb-2">${p.category} • $${p.price}</span>
                            <div class="mt-auto d-flex gap-2">
                              <button 
                                type="button" 
                                class="btn btn-outline-warning btn-sm rounded-pill py-1 px-3" 
                                data-action="view-pdp" 
                                data-product-id="${p.id}"
                              >
                                View Piece
                              </button>
                              <button 
                                type="button" 
                                class="btn btn-outline-danger btn-sm rounded-circle p-0" 
                                style="width: 28px; height: 28px;"
                                data-action="remove-wish" 
                                data-product-id="${p.id}"
                                title="Remove from wishlist"
                              >
                                <i class="bi bi-x"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    `).join("")}
                  </div>
                `
            }
          </div>
        </div>
      </div>
    `;

    setupWishlistEvents(modalEl, wishProducts);
  };

  renderContent();
  window.addEventListener("store:wishlist-updated", renderContent);
}

function setupWishlistEvents(modalEl, wishProducts) {
  modalEl.querySelectorAll("[data-action='view-pdp']").forEach(btn => {
    btn.addEventListener("click", () => {
      const pId = btn.getAttribute("data-product-id");
      const product = wishProducts.find(p => p.id === pId);
      if (product) {
        if (window.bootstrap) {
          const bsModal = bootstrap.Modal.getInstance(modalEl);
          bsModal?.hide();
        }
        setTimeout(() => {
          store.emit("store:open-pdp", { product });
        }, 300);
      }
    });
  });

  modalEl.querySelectorAll("[data-action='remove-wish']").forEach(btn => {
    btn.addEventListener("click", () => {
      const pId = btn.getAttribute("data-product-id");
      store.toggleWishlist(pId);
    });
  });
}
