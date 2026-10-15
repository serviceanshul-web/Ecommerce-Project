// Slide-out Shopping Bag Cart Drawer Component
import { store } from "../store.js";
import { api } from "../api.js";

export function initCartDrawer() {
  let drawerEl = document.getElementById("cartDrawer");
  if (!drawerEl) {
    drawerEl = document.createElement("div");
    drawerEl.id = "cartDrawer";
    drawerEl.className = "offcanvas offcanvas-end offcanvas-atelier";
    drawerEl.tabIndex = -1;
    drawerEl.setAttribute("aria-labelledby", "cartDrawerLabel");
    document.body.appendChild(drawerEl);
  }

  const renderContent = () => {
    const summary = store.getCartSummary();

    drawerEl.innerHTML = `
      <div class="offcanvas-header offcanvas-header-atelier">
        <div class="d-flex align-items-center gap-2">
          <h5 class="offcanvas-title font-editorial text-light m-0" id="cartDrawerLabel">Shopping Bag</h5>
          <span class="badge bg-secondary-subtle text-light rounded-pill px-2 py-1 small">${summary.count} pieces</span>
        </div>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>

      <div class="offcanvas-body d-flex flex-column p-4">
        <!-- Free Shipping Tracker -->
        <div class="shipping-meter-box">
          <div class="d-flex align-items-center justify-content-between small">
            ${
              summary.isFreeShipping && summary.subtotal > 0
                ? `<span class="text-success fw-bold"><i class="bi bi-patch-check-fill me-1"></i> Complimentary Express Unlocked!</span>`
                : `<span>Add <strong class="text-warning">$${summary.amountNeededForFreeShipping}</strong> for Complimentary Delivery</span>`
            }
            <span class="text-muted">${summary.progressToFreeShipping}%</span>
          </div>
          <div class="shipping-progress-bar-track">
            <div class="shipping-progress-fill" style="width: ${summary.progressToFreeShipping}%;"></div>
          </div>
        </div>

        <!-- Items Container -->
        <div class="flex-grow-1 overflow-y-auto pe-1" id="cart-items-container">
          ${
            summary.items.length === 0
              ? `
                <div class="text-center py-5">
                  <div class="text-muted display-4 mb-3"><i class="bi bi-bag-x"></i></div>
                  <h5 class="font-editorial text-light">Your shopping bag is empty</h5>
                  <p class="text-muted small">Discover our latest architectural silhouettes and wardrobe staples.</p>
                  <button type="button" class="btn-gold-luxury btn-sm mt-3" data-bs-dismiss="offcanvas">
                    Explore Curations
                  </button>
                </div>
              `
              : summary.items.map(item => `
                <div class="cart-item-row" data-cart-item-id="${item.cartItemId}">
                  <img src="${item.image}" alt="${item.name}" class="cart-item-thumb" />
                  <div class="cart-item-info">
                    <div class="d-flex justify-content-between align-items-start">
                      <h6 class="cart-item-name text-light mb-1">${item.name}</h6>
                      <button type="button" class="btn-remove-item ms-2" data-action="remove-item" title="Remove piece">
                        <i class="bi bi-trash3"></i>
                      </button>
                    </div>

                    <div class="cart-item-variant">
                      Size: <strong class="text-light">${item.selectedSize}</strong> • 
                      Color: <strong class="text-light">${item.selectedColor}</strong>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-auto">
                      <div class="qty-stepper-box">
                        <button type="button" class="qty-step-btn" data-action="decrease-qty"><i class="bi bi-dash"></i></button>
                        <span class="qty-val-display">${item.quantity}</span>
                        <button type="button" class="qty-step-btn" data-action="increase-qty"><i class="bi bi-plus"></i></button>
                      </div>
                      <div class="cart-item-price">$${item.price * item.quantity}</div>
                    </div>
                  </div>
                </div>
              `).join("")
          }
        </div>

        ${
          summary.items.length > 0
            ? `
              <!-- Promo Code Engine -->
              <div class="my-3 pt-3 border-top border-secondary border-opacity-25">
                ${
                  summary.appliedCoupon
                    ? `
                      <div class="d-flex justify-content-between align-items-center p-2 rounded-2" style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3);">
                        <span class="small text-success fw-bold">
                          <i class="bi bi-tag-fill me-1"></i> ${summary.appliedCoupon.code} (-${summary.appliedCoupon.discountPercent}%)
                        </span>
                        <button class="btn btn-link btn-sm text-danger text-decoration-none p-0" id="btn-remove-coupon">Remove</button>
                      </div>
                    `
                    : `
                      <div class="input-group input-group-sm">
                        <input type="text" class="form-control bg-dark text-light border-secondary" id="coupon-input" placeholder="Promo code (e.g. WELCOME10)">
                        <button class="btn btn-outline-warning" type="button" id="btn-apply-coupon">Apply</button>
                      </div>
                      <div class="text-muted" style="font-size: 0.7rem; margin-top: 4px;">
                        Try: <span class="text-warning text-decoration-underline" role="button" id="try-code-welcome">WELCOME10</span> (10% off) or <span class="text-warning text-decoration-underline" role="button" id="try-code-atelier">ATELIER20</span> (20% off)
                      </div>
                    `
                }
              </div>

              <!-- Order Summary Breakdown -->
              <div class="pt-2 border-top border-secondary border-opacity-25 small">
                <div class="d-flex justify-content-between text-secondary mb-1">
                  <span>Subtotal</span>
                  <span class="text-light fw-semibold">$${summary.subtotal}</span>
                </div>

                ${
                  summary.discountAmount > 0
                    ? `
                      <div class="d-flex justify-content-between text-success mb-1">
                        <span>Privilege Discount</span>
                        <span>-$${summary.discountAmount}</span>
                      </div>
                    `
                    : ""
                }

                <div class="d-flex justify-content-between text-secondary mb-1">
                  <span>Estimated Courier</span>
                  <span class="${summary.isFreeShipping ? "text-success fw-bold" : "text-light"}">
                    ${summary.isFreeShipping ? "FREE" : `$${summary.shipping}`}
                  </span>
                </div>

                <div class="d-flex justify-content-between text-secondary mb-2">
                  <span>Estimated Tax (8%)</span>
                  <span class="text-light">$${summary.tax}</span>
                </div>

                <div class="d-flex justify-content-between fs-5 fw-bold text-light pt-2 border-top border-secondary border-opacity-25 mb-3">
                  <span class="font-editorial">Total</span>
                  <span class="text-warning">$${summary.total}</span>
                </div>

                <!-- Checkout CTA -->
                <button type="button" class="btn-gold-luxury w-100 justify-content-center py-3 fs-6" id="btn-cart-checkout">
                  Proceed To Secure Checkout <i class="bi bi-arrow-right"></i>
                </button>
              </div>
            `
            : ""
        }
      </div>
    `;

    setupDrawerEvents(drawerEl);
  };

  renderContent();
  window.addEventListener("store:cart-updated", renderContent);
}

function setupDrawerEvents(drawerEl) {
  // Stepper & Removal
  drawerEl.querySelectorAll(".cart-item-row").forEach(row => {
    const cartItemId = row.getAttribute("data-cart-item-id");
    const item = store.cart.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    row.querySelector("[data-action='increase-qty']")?.addEventListener("click", () => {
      store.updateQuantity(cartItemId, item.quantity + 1);
    });

    row.querySelector("[data-action='decrease-qty']")?.addEventListener("click", () => {
      store.updateQuantity(cartItemId, item.quantity - 1);
    });

    row.querySelector("[data-action='remove-item']")?.addEventListener("click", () => {
      store.removeFromCart(cartItemId);
    });
  });

  // Promo code apply
  const couponInput = drawerEl.querySelector("#coupon-input");
  const applyBtn = drawerEl.querySelector("#btn-apply-coupon");

  const tryApply = async (code) => {
    if (!code) return;
    const res = await api.validateCoupon(code);
    if (res.success) {
      store.applyCoupon(res.coupon);
    } else {
      store.emit("store:toast", { message: res.message, type: "warning" });
    }
  };

  applyBtn?.addEventListener("click", () => {
    tryApply(couponInput?.value);
  });

  couponInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      tryApply(couponInput?.value);
    }
  });

  drawerEl.querySelector("#btn-remove-coupon")?.addEventListener("click", () => {
    store.removeCoupon();
  });

  // Try code shortcuts
  drawerEl.querySelector("#try-code-welcome")?.addEventListener("click", () => tryApply("WELCOME10"));
  drawerEl.querySelector("#try-code-atelier")?.addEventListener("click", () => tryApply("ATELIER20"));

  // Checkout button
  drawerEl.querySelector("#btn-cart-checkout")?.addEventListener("click", () => {
    if (window.bootstrap) {
      const bsDrawer = bootstrap.Offcanvas.getInstance(drawerEl);
      bsDrawer?.hide();

      setTimeout(() => {
        const checkoutEl = document.getElementById("checkoutModal");
        if (checkoutEl) {
          const bsCheckout = bootstrap.Modal.getOrCreateInstance(checkoutEl);
          bsCheckout.show();
        }
      }, 350);
    }
  });
}
