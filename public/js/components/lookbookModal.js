// Lookbook Editorial Modal Component
import { store } from "../store.js";
import { api } from "../api.js";

export function initLookbookModal() {
  let modalEl = document.getElementById("lookbookModal");
  if (!modalEl) {
    modalEl = document.createElement("div");
    modalEl.id = "lookbookModal";
    modalEl.className = "modal fade";
    modalEl.tabIndex = -1;
    modalEl.setAttribute("aria-hidden", "true");
    document.body.appendChild(modalEl);
  }

  const LOOKBOOK_ITEMS = [
    {
      title: "Look 01: Architectural Monochrome",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
      description: "Structured double-faced virgin wool layered over pleated high-rise wool blend trousers.",
      featuredProductId: "prod-001"
    },
    {
      title: "Look 02: Tactile Luxury & Cashmere",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
      description: "7-gauge Mongolian cashmere mockneck paired with tailored fluid bottoms.",
      featuredProductId: "prod-002"
    },
    {
      title: "Look 03: Heritage Raw Denim & Boxy Drape",
      image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=1200&q=80",
      description: "13.5 oz Kurabo Mills Japanese selvedge denim balanced with a 300 GSM organic boxy tee.",
      featuredProductId: "prod-007"
    }
  ];

  modalEl.innerHTML = `
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content modal-content-atelier">
        <div class="modal-header border-0 pb-0">
          <div>
            <h4 class="font-editorial text-light mb-1">Fall / Winter Editorial Lookbook</h4>
            <p class="text-secondary small m-0">Curated styling silhouettes captured in motion</p>
          </div>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body p-4 p-lg-5">
          <div class="row g-4">
            ${LOOKBOOK_ITEMS.map((item, idx) => `
              <div class="col-12 col-md-4">
                <div class="rounded-3 overflow-hidden position-relative h-100 d-flex flex-column" style="background: var(--bg-card); border: 1px solid var(--border-subtle);">
                  <div class="overflow-hidden" style="aspect-ratio: 3/4;">
                    <img 
                      src="${item.image}" 
                      alt="${item.title}" 
                      class="w-100 h-100 object-fit-cover" 
                      style="transition: transform 0.6s ease;" 
                    />
                  </div>
                  <div class="p-3 d-flex flex-column flex-grow-1">
                    <h6 class="font-editorial text-light mb-1">${item.title}</h6>
                    <p class="text-secondary small mb-3 flex-grow-1">${item.description}</p>
                    <button 
                      type="button" 
                      class="btn-gold-luxury btn-sm w-100 justify-content-center" 
                      data-action="shop-look" 
                      data-product-id="${item.featuredProductId}"
                    >
                      Shop Featured Piece
                    </button>
                  </div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `;

  modalEl.querySelectorAll("[data-action='shop-look']").forEach(btn => {
    btn.addEventListener("click", async () => {
      const pId = btn.getAttribute("data-product-id");
      const product = await api.getProductById(pId);
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
}
